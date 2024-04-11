/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      screens: {
        "hover-hover": { raw: "(hover: hover)" }
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
    require("daisyui"),
    require("flowbite/plugin")
  ],
  daisyui: {
    logs: false,
    themes: ["light", "dark"],
  }
};
