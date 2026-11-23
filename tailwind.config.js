/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#04070F',
          900: '#070A14',
          850: '#0B101F',
          800: '#0F162A',
          750: '#151E38',
          700: '#1C2748',
        },
        navy: {
          950: '#060B19',
          900: '#0B132B',
          800: '#141E38',
          700: '#1E2C52',
          600: '#2C3E72',
        },
        teal: {
          accent: '#00F0FF',
          glow: 'rgba(0, 240, 255, 0.25)',
          deep: '#0891B2',
          muted: '#164E63',
        },
        emergency: {
          red: '#EF4444',
          darkRed: '#991B1B',
          glow: 'rgba(239, 68, 68, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'tactile': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        'tactile-lg': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'glow-crimson': '0 0 50px -10px rgba(239, 68, 68, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35)',
        'glow-teal': '0 0 30px -8px rgba(0, 240, 255, 0.5)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
