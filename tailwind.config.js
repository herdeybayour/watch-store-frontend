// Colors come from CSS variables in src/index.css. Change them there.
const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { bg: c("bg"), surface: c("surface"), line: c("line"), ink: c("ink"), muted: c("muted"), gold: c("gold") },
      fontFamily: { display: ["Cormorant Garamond", "Georgia", "serif"], sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
