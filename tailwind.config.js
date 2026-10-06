/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.ts',
        './resources/**/*.tsx',
    ],
    theme: {
        extend: {
            colors: {
                industrial: {
                    50:  '#f6f5f4',
                    100: '#e9e7e3',
                    200: '#cac6bf',
                    300: '#a8a298',
                    400: '#7c7569',
                    500: '#5c564c',
                    600: '#454039',
                    700: '#302d29',
                    800: '#22201c',
                    900: '#181714',
                },
                leather: {
                    50:  '#faf3ea',
                    100: '#f3e1cb',
                    200: '#e0b988',
                    300: '#cb8f4b',
                    400: '#a7671f',
                    500: '#8b4e11',
                    600: '#6b3a0d',
                    700: '#502b0c',
                    800: '#3a1e0b',
                    900: '#291508',
                },
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
                header: ['Oswald', 'Impact', 'sans-serif'],
            },
            boxShadow: {
                'industrial': '0 4px 14px 0 rgba(24,23,20,0.25)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
