/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        'header-height': '64px', // If the header is 64px high (16px padding + height)
        'content-height': 'calc(100vh - 64px)', // For the rest of the page content minus the header height
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fontcolor: "var(--fontcolor)",
        header: "var(--header)",
        hover: "var(--hover)",
      },
      padding: {
        's': '22px',
        'm': '48px',
      },
      borderRadius: {
        'xs': '8px',
      }
    },
  },
  plugins: [],
};
