/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF3E3",
        ink: "#191919",
        navy: "#1E3968",
        signred: "#E5341E",
        signred50: "#FBE1DC",
        gold: "#F5A623",
        gold50: "#FCEACB",
        signgreen: "#0D8162",
        signgreen50: "#EDF3E8",
      },
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
