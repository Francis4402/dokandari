import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
        colors: {
            ink: "#111013",
            paper: "#F7F5EF",
            "paper-dim": "#EFECE3",
            marigold: "#FF5A1F",
            "marigold-dark": "#D6430E",
            teal: "#0E6E5B",
            sun: "#FFC53D",
            line: "#DAD5C7",
            "text-soft": "#6B6A66",
        },
        fontFamily: {
            display: ['"Big Shoulders Display"', "sans-serif"],
            body: ["Manrope", "sans-serif"],
            mono: ['"Space Mono"', "monospace"],
        },
        boxShadow: {
            hard: "5px 5px 0 #111013",
            "hard-lg": "7px 7px 0 #111013",
            "hard-sm": "4px 4px 0 #111013",
            "hard-marigold": "5px 5px 0 #D6430E",
        },
    },
  },

    plugins: [forms],
};
