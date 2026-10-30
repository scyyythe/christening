/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Main headings and names.
        navy: "#0F2557",
        // Subheadings and labels.
        ink: "#2B4A7A",
        // Primary accent: buttons, active tabs, links, route line, map pins.
        sky: "#3E7CC4",
        // Body and secondary text.
        mist: "#6B86A8",
        // Light surfaces.
        cloud: "#EAF4FC",
        // Small highlights only: stars, sun icons, a dot or underline.
        sun: "#E8B04B",
      },
      fontFamily: {
        script: ['"Great Vibes"', "cursive"],
        display: ['"Amatic SC"', "sans-serif"],
        sans: ['"Montserrat"', "sans-serif"],
      },
      boxShadow: {
        glass: "0 10px 40px rgba(15, 37, 87, 0.10)",
      },
    },
  },
  plugins: [],
};
