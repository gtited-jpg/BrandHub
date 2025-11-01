import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          primary: '#8b5cf6', // violet-500
      },
      fontFamily: {
          sans: ['Inter', 'sans-serif'],
          display: ['Poppins', 'sans-serif'],
      },
      animation: {
          'fade-in': 'fadeIn 0.5s ease-out forwards',
          'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
          'card-twinkle': 'cardTwinkle 8s ease-in-out infinite alternate',
          'pulse': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'twinkle': 'twinkle 2s ease-in-out infinite',
          'shoot': 'shoot 5s linear infinite',
      },
      keyframes: {
          fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
          },
          fadeInUp: {
              '0%': { opacity: '0', transform: 'translateY(20px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          cardTwinkle: {
              '0%': { 'border-color': 'rgba(139, 92, 246, 0.2)' },
              '100%': { 'border-color': 'rgba(139, 92, 246, 0.6)' },
          },
          pulse: {
              '0%, 100%': { opacity: '1' },
              '50%': { opacity: '0.4' },
          },
          twinkle: {
              '0%, 100%': { opacity: '1', transform: 'scale(1.1)' },
              '50%': { opacity: '0.2', transform: 'scale(0.7)' },
          },
          shoot: {
             '0%': { transform: 'translateX(0)' },
             '100%': { transform: 'translateX(calc(100vw + 200px))' }
          }
      },
    },
  },
  plugins: [],
};
export default config;
