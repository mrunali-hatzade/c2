import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          plum: '#5B2333',
          'plum-hover': '#4A1525',
          'plum-dark': '#3D101E',
          crimson: '#9E2A2B',
          'cream-light': '#FAF7F2',
          cream: '#F5EBE1',
          blush: '#FCEFEF',
          'blush-border': '#F5EBE6',
          espresso: '#2B1810',
          muted: '#786C65',
          border: '#EBDCCD',
          gold: '#F59E0B',
        },
        owner: {
          sidebar: '#3D101E',
          'sidebar-active': '#5B1C2E',
          'sidebar-text': '#E5D0D6',
          canvas: '#F8F9FA',
          card: '#FFFFFF',
          border: '#E9ECEF',
        },
        admin: {
          sidebar: '#162232',
          'sidebar-active': '#21354D',
          'sidebar-text': '#A0AEC0',
          canvas: '#F4F6F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
          accent: '#3182CE',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(91, 35, 51, 0.05)',
        elevated: '0 10px 25px -3px rgba(43, 24, 16, 0.08)',
        subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
};

export default config;
