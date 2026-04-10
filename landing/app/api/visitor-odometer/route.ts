import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const ODOMETER_KEY = "odo:visitor_total_meters";
const ODOMETER_ROW_ID = 1;

let neonSetupPromise: Promise<void> | null = null;

function getNeonClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  return neon(databaseUrl);
}

type NeonSql = NonNullable<ReturnType<typeof getNeonClient>>;

async function ensureNeonSchema(sql: NeonSql) {
  if (!neonSetupPromise) {
    neonSetupPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS visitor_odometer (
          id SMALLINT PRIMARY KEY,
          total_meters DOUBLE PRECISION NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        INSERT INTO visitor_odometer (id, total_meters)
        VALUES (${ODOMETER_ROW_ID}, 0)
        ON CONFLICT (id) DO NOTHING
      `;
    })().catch((error) => {
      neonSetupPromise = null;
      throw error;
    });
  }

  await neonSetupPromise;
}

function getKvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return null;
  }
  return { url, token };
}

async function kvRequest(commandPath: string) {
  const config = getKvConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}${commandPath}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`KV request failed (${response.status})`);
  }

  return response.json() as Promise<{ result?: unknown }>;
}

async function readTotalMeters() {
  const sql = getNeonClient();
  if (sql) {
    await ensureNeonSchema(sql);
    const rows = await sql`
      SELECT total_meters
      FROM visitor_odometer
      WHERE id = ${ODOMETER_ROW_ID}
      LIMIT 1
    `;

    const raw = Number(rows[0]?.total_meters ?? 0);
    return {
      totalMeters: Number.isFinite(raw) ? Math.max(0, raw) : 0,
      configured: true,
      provider: "neon"
    };
  }

  const data = await kvRequest(`/get/${encodeURIComponent(ODOMETER_KEY)}`);
  if (!data) {
    return { totalMeters: 0, configured: false };
  }

  const raw = typeof data.result === "string" ? Number(data.result) : Number(data.result ?? 0);
  return {
    totalMeters: Number.isFinite(raw) ? Math.max(0, raw) : 0,
    configured: true
  };
}

export async function GET() {
  try {
    const payload = await readTotalMeters();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ totalMeters: 0, configured: true, error: "read_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { deltaMeters?: number };
    const deltaMeters = Number(body.deltaMeters ?? 0);

    if (!Number.isFinite(deltaMeters) || deltaMeters <= 0) {
      return NextResponse.json({ error: "invalid_delta" }, { status: 400 });
    }

    const clampedDelta = Math.min(deltaMeters, 2000);
    const sql = getNeonClient();
    if (sql) {
      await ensureNeonSchema(sql);
      const rows = await sql`
        UPDATE visitor_odometer
        SET
          total_meters = GREATEST(0, total_meters + ${clampedDelta}),
          updated_at = NOW()
        WHERE id = ${ODOMETER_ROW_ID}
        RETURNING total_meters
      `;

      const raw = Number(rows[0]?.total_meters ?? 0);
      return NextResponse.json({
        totalMeters: Number.isFinite(raw) ? Math.max(0, raw) : 0,
        configured: true,
        provider: "neon"
      });
    }
    const data = await kvRequest(
      `/incrbyfloat/${encodeURIComponent(ODOMETER_KEY)}/${encodeURIComponent(clampedDelta.toFixed(4))}`
    );

    if (!data) {
      return NextResponse.json({ totalMeters: 0, configured: false });
    }

    const raw = typeof data.result === "string" ? Number(data.result) : Number(data.result ?? 0);
    return NextResponse.json({
      totalMeters: Number.isFinite(raw) ? Math.max(0, raw) : 0,
      configured: true
    });
  } catch {
    return NextResponse.json({ error: "write_failed" }, { status: 500 });
  }
}
