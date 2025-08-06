/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{html,js}",
    "./components/**/*.js",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Tons de beige - Base neutre inspirée d'Anthropic
        beige: {
          50: '#fefdfb',   // Blanc cassé
          100: '#f7f5f0',  // Beige très clair
          200: '#f0ebe0',  // Beige clair
          300: '#e8ddd0',  // Beige moyen
          400: '#d4c4a8',  // Beige soutenu
          500: '#b8a082',  // Beige foncé
        },
        
        // Couleurs d'accent - Touches colorées
        accent: {
          primary: '#d97706',    // Orange doux
          secondary: '#059669',  // Vert sauge
          tertiary: '#7c3aed',   // Violet subtil
          info: '#0ea5e9',       // Bleu calme
          warning: '#f59e0b',    // Jaune miel
          danger: '#dc2626',     // Rouge discret
        }
      },
      
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'secondary': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.05em' }],
      },
      
      borderRadius: {
        'xl': '12px',
      },
      
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
        'card-lifted': '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
        'primary': '0 4px 8px rgba(217, 119, 6, 0.25)',
        'focus': '0 0 0 3px rgba(217, 119, 6, 0.1)',
      },
      
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
