import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Lato",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular"],
      },
      animation: {
        wave: "wave 1.2s linear infinite",
        pulse: "pulse 1.5s ease-in-out infinite",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { height: "0.5rem" },
          "50%": { height: "1.5rem" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animationDelay: {
        "100": "100ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities, theme }) {
      const delays = theme("animationDelay");
      const utilities = Object.entries(delays as Record<string, string>).map(
        ([key, value]) => {
          return {
            [`.delay-${key}`]: {
              animationDelay: value,
            },
          };
        },
      );
      addUtilities(utilities);
    }),
  ],
} satisfies Config;
