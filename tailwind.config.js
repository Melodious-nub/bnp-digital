/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'bnp-green': '#006a4e',
                'bnp-red': '#f42a41',
                'party-gray': '#f3f4f6',
            }
        },
    },
    plugins: [],
}
