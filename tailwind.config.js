export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00f0ff',
        glow: '#8a2be2',
        dark: '#0b0f1a',
      },
      boxShadow: {
        neon: '0 0 30px rgba(0, 240, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
