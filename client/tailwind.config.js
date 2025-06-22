const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        "./node_modules/@nextui-org/theme/dist/**/*.{html,js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                custom: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
            }, borderRadius: {
                '5px': '5px',
            }, colors: {
                'mint-green': '#39c184',
            },

        },
    },
    plugins: [],
};
