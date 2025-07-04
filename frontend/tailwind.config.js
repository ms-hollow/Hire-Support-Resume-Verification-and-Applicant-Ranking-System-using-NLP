/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  transpilePackages: ['gsap'],
  webpack: (config, { isServer }) => {
    // Add this to handle ES Module imports correctly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
      };
    }
    return config;
  },
  theme: {
    extend: {
      screens: {
        xxsm: '320px',
        xsm: '375px',
        sm: '425px',
        mb: '768px',
        lg: '1224px',
      },
      transitionProperty: {
        transform: "transform",
      },
      height: {
        'header-height': '64px', // If the header is 64px high (16px padding + height)
        'content-height': 'calc(100vh - 64px)', // For the rest of the page content minus the header height
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fontcolor: "var(--fontcolor)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        secondary: "var(--secondary)",
        placeholder: "var(--placeholder)",
        complete:"var(--complete)",
      },
      padding: {
        's': '22px',
        'm': '48px',
      },
      borderRadius: {
        'xs': '8px',
      },
      fontWeight: {
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      fontSize:{
        xxsmall: '0.75rem',  /*12px*/
        xsmall: '0.875rem', /*14px*/
        small:'0.9375rem', /*15px*/
        medium:'1rem', /*16px*/
        large: '1.125rem', /*18px'*/
        xlarge: '1.5rem', /*18px'*/
        extralarge:'2rem', /*32px*/
      },
      height:{
        medium: '35px',
        large: '60px',
        auto:'auto',   
      },
      overscrollBehavior: ['none', 'auto' ,'contain'],
    },
    keyframes: {
       bar1: {
        '0%, 100%': { transform: 'scaleY(0.6)' },
        '50%': { transform: 'scaleY(0.0)' },
      },
      bar2: {
        '0%, 100%': { transform: 'scaleY(0.6)' },
        '50%': { transform: 'scaleY(0.4)' },
      },
      bar3: {
        '0%, 100%': { transform: 'scaleY(0.8)' },
        '50%': { transform: 'scaleY(0.6)' },
      },
      bar4: {
        '0%, 100%': { transform: 'scaleY(1)' },
        '50%': { transform: 'scaleY(0.6)' },
      },
      bar5: {
        '0%, 100%': { transform: 'scaleY(1.2)' },
        '50%': { transform: 'scaleY(0.6)' },
      },
    },
    animation: {
      bar1: 'bar1 1.2s ease-in-out infinite',
      bar2: 'bar2 1.2s ease-in-out infinite 0.1s',
      bar3: 'bar3 1.2s ease-in-out infinite 0.2s',
      bar4: 'bar4 1.2s ease-in-out infinite 0.3s',
      bar5: 'bar5 1.2s ease-in-out infinite 0.4s',
    },
  },
  plugins: [],
};
