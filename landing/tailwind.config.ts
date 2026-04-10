import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        surface: "var(--surface)",
        haze: "var(--haze)",
        accent: "var(--accent)",
        accentSoft: "var(--accent-soft)",
        line: "var(--line)"
      },
      boxShadow: {
        soft: "0 10px 30px -18px rgba(20, 20, 24, 0.4)",
        card: "0 14px 30px -24px rgba(255, 132, 31, 0.45)"
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.8rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        reveal: "reveal 700ms ease forwards"
      }
    }
  },
  plugins: []
};

export default config;
