/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          plum: "#C56E56",
          "plum-dark": "#A35742",
          "plum-hover": "#D37D66",
          "plum-deep": "#7E3D2C",
          "plum-light": "#FDF2EF",
          cream: "#FCFAF7",
          "cream-light": "#FDFBF9",
          "cream-dark": "#F4EBE3",
          blush: "#FDEEF2",
          "blush-border": "#F8D7E1",
          espresso: "#2B1822",
          muted: "#7A6B74",
          gold: "#F59E0B",
          border: "#EFE8EB",
          rose: "#c97b63",
          "rose-dark": "#b86851",
          sage: "#8a9e8a",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(83, 27, 59, 0.05), 0 4px 6px -2px rgba(83, 27, 59, 0.03)",
        card: "0 4px 20px -2px rgba(83, 27, 59, 0.08)",
        "card-hover": "0 12px 30px -4px rgba(83, 27, 59, 0.14)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
