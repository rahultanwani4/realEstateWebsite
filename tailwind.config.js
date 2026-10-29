/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          dark: '#1E40AF',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          light: '#94A3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFC',
        },
        line: {
          DEFAULT: '#E2E8F0',
          dark: '#CBD5E1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(15, 23, 42, 0.05)',
        'elevated': '0 12px 36px -10px rgba(15, 23, 42, 0.08)',
        'brand': '0 4px 14px rgba(37, 99, 235, 0.28)',
      }
    },
  },
  plugins: [],
}
