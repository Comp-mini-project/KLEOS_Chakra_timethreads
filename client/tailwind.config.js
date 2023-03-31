/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui"), require("@tailwindcss/typography")],
    daisyui: {
        themes: [
            {
                lavender: {
                    primary: "#A855F7",
                    secondary: "#3B82F6",
                    accent: "#37CDFF",
                    neutral: "#46474a",
                    "base-100": "#ffffff",
                },
            },
            "light",
            "dark",
            "cupcake",
            "lemonade",
        ],
    },
};
