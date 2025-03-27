import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },

  darkMode: "class",
  plugins: [
    heroui({
      defaultTheme: "dark",
      themes: {
        light: {
          colors: {
            primary: "#0DE5A8",
            secondary: "#0BAF8E",
            accent: "#F7A046",
            background: "#EEEEEE",
            foreground: "#FDFDFD",
            card: "#FDFDFD",
            content1: "#FFFFFF",
            content2: "#F5F5F5",
            border: "#0DE5A8",
            muted: "#C4C4C4",
            danger: {
              50: "#FDEDED", // Sehr helles Rosa
              100: "#FCDADA", // Helles Pastell-Rosa
              200: "#F8BDBD", // Weiches Korallenrot
              300: "#F28F8F", // Heller Rotton
              400: "#EC6C6C", // Softes Rot
              500: "#E57373", // Basisfarbe (Dein Referenzwert)
              600: "#D65C5C", // Satteres Mittelrot
              700: "#B84A4A", // Dunkleres Rot
              800: "#973C3C", // Tiefes Dunkelrot
              900: "#7A2F2F", // Sehr dunkles, warmes Rot
            },
            warning: "#FFB300",
            info: "#1E88E5",
            focus: "#0DE5A8",
          },
        },
        dark: {
          colors: {
            primary: "#D63235",
            secondary: "#D332D6",
            accent: "#F7A046",
            background: "#EEEEEE",
            foreground: "#FDFDFD",
            card: "#FDFDFD",
            text: "#3A3A3A",
            content1: "#FDFDFD",
            content2: "#3A3A3A",
            content3: "#3A3A3A",
            content4: "#3A3A3A",
            default: "#EEEEEE",
            border: "#0DE5A8",
            overlay: "#000000",
            muted: "#9c9c9c",

            danger: {
              50: "#471E1E", // Sehr dunkles, gedämpftes Rot
              100: "#5C2323", // Dunkler, aber leicht gesättigt
              200: "#792929", // Satte Basis für dunkle Hintergründe
              300: "#9A3030", // Lebendiges, dunkles Rot
              400: "#BA3636", // Kräftiges Signalrot
              500: "#D84444", // Basisfarbe für Warnungen
              600: "#E35656", // Helles Alarmrot mit starkem Kontrast
              700: "#EC6868", // Knalliges Rot für wichtige Fehler
              800: "#F08A8A", // Leuchtendes, aber angenehmes Rot
              900: "#F4AFAF", // Softes, aber intensives Highlight-Rot
            },
            warning: "#FFB74D",
            info: "#42A5F5",
            focus: "#D63235",
          },
        },
      },
    }),
  ],
};

module.exports = config;
