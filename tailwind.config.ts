import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'serif'],
      },
      colors: {
        se: { dark: '#0B2545', mid: '#1B4D8E', light: '#EBF3FF', acc: '#F5C842' },
        dk: { dark: '#6B1010', mid: '#C0392B', light: '#FDECEA', acc: '#F5E8A0' },
        nl: { dark: '#6B3400', mid: '#D4690A', light: '#FFF0E0', acc: '#F5D060' },
        be: { dark: '#3A2200', mid: '#8B6914', light: '#FFF9E0', acc: '#E8C040' },
      },
      borderRadius: { xl: '16px', '2xl': '20px', '3xl': '24px' },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
      },
      maxWidth: { app: '430px' },
    },
  },
  plugins: [],
}
export default config