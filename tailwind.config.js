/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ChatGPT/Notion inspired color palette
        'accent': {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Blue accent - used sparingly
          600: '#2563eb',
          700: '#1d4ed8',
        },
        'neutral': {
          50: '#fafafa',   // Almost white
          100: '#f5f5f5',  // Light grey background
          200: '#e5e5e5',  // Light border
          300: '#d4d4d4',  // Medium border
          400: '#a3a3a3',  // Icon grey
          500: '#737373',  // Secondary text
          600: '#525252',  // Primary text (dark grey, not black)
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['ui-sans-serif', '-apple-system', 'system-ui', '"Segoe UI"', 'Helvetica', '"Apple Color Emoji"', 'Arial', 'sans-serif', '"Segoe UI Emoji"', '"Segoe UI Symbol"'],
      },
      borderRadius: {
        'lg': '0.75rem',  // 12px - ChatGPT/Notion style rounded corners
        'xl': '1rem',     // 16px
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgb(0 0 0 / 0.03), 0 1px 2px -1px rgb(0 0 0 / 0.02)',
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}
