/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {

    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: [
            {
                lavender: {
                    'primary': '#A855F7',
                    'secondary': '#3B82F6',
                    'accent': '#37CDFF',
                    'neutral': '#46474a',
                    'base-100': '#ffffff',
                },
            },
            "light",
            "dark", "cupcake", "lemonade"
        ],
    },
};
