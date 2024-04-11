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
    require('flowbite/plugin')
  ],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[light]"],
          "primary": "#1D242A",
          "primary-focus": "#1D242A",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[dark]"],
          "primary": "#fff",
          "secondary": "#252E36",
          "primary-focus": "#fff",
        },
      },
    ],
  },
};
