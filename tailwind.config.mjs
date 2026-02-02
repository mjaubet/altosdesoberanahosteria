/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                patagonia: {
                    snow: '#F9FAFB', // White/clean
                    slate: '#64748B', // Soft gray
                    earth: '#8D7F71', // Earthy brown
                    sand: '#E3DDD3', // Warm light beige
                    lake: '#2C8C99', // Lago Argentino blue/teal
                    deep: '#1E293B', // Dark contrast
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
