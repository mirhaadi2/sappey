/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(30, 20%, 85%)",
                input: "hsl(30, 20%, 90%)",
                ring: "hsl(22, 56%, 29%)",
                background: "hsl(30, 35%, 98%)",
                foreground: "hsl(22, 40%, 20%)",
                primary: {
                    DEFAULT: "hsl(22, 56%, 29%)",
                    foreground: "hsl(35, 100%, 97%)",
                },
                secondary: {
                    DEFAULT: "hsl(22, 56%, 38%)",
                    foreground: "hsl(35, 100%, 97%)",
                },
                tertiary: {
                    DEFAULT: "hsl(275, 25%, 34%)",
                    foreground: "hsl(35, 100%, 97%)",
                },
                neutral: {
                    DEFAULT: "hsl(35, 40%, 96%)",
                    foreground: "hsl(22, 40%, 20%)",
                },
                destructive: {
                    DEFAULT: "hsl(0, 72%, 51%)",
                    foreground: "hsl(35, 100%, 97%)",
                },
                muted: {
                    DEFAULT: "hsl(30, 20%, 96%)",
                    foreground: "hsl(30, 10%, 40%)",
                },
                accent: {
                    DEFAULT: "hsl(35, 40%, 96%)",
                    foreground: "hsl(22, 40%, 20%)",
                },
                popover: {
                    DEFAULT: "hsl(30, 35%, 98%)",
                    foreground: "hsl(22, 40%, 20%)",
                },
                card: {
                    DEFAULT: "hsl(30, 35%, 98%)",
                    foreground: "hsl(22, 40%, 20%)",
                },
                success: "hsl(142, 45%, 35%)",
                warning: "hsl(38, 75%, 45%)",
                "brand-brown": "hsl(22, 56%, 29%)",
                "brand-cocoa": "hsl(22, 56%, 38%)",
                "brand-plum": "hsl(275, 25%, 34%)",
                "brand-cream": "hsl(35, 100%, 97%)",
                "brand-latte": "hsl(35, 40%, 96%)",
                "gray-50": "hsl(30, 30%, 98%)",
                "gray-100": "hsl(30, 20%, 96%)",
                "gray-200": "hsl(30, 20%, 90%)",
                "gray-300": "hsl(30, 15%, 80%)",
                "gray-400": "hsl(30, 10%, 65%)",
                "gray-500": "hsl(30, 8%, 50%)",
                "gray-600": "hsl(30, 10%, 40%)",
                "gray-700": "hsl(30, 15%, 30%)",
                "gray-800": "hsl(30, 20%, 20%)",
                "gray-900": "hsl(30, 25%, 10%)",
            },
            fontFamily: {
                sans: ["Open Sans", "sans-serif"],
                headline: ["Open Sans", "sans-serif"],
                label: ["DM Sans", "sans-serif"],
                mono: ["IBM Plex Mono", "monospace"],
            },
            borderRadius: {
                lg: "8px",
                md: "6px",
                sm: "4px",
            },
            spacing: {
                '4': '1rem',
                '8': '2rem',
                '12': '3rem',
                '16': '4rem',
                '24': '6rem',
                '32': '8rem',
                '48': '12rem',
                '64': '16rem',
            },
            backgroundImage: {
                'gradient-1': 'linear-gradient(135deg, hsl(32, 55%, 35%) 0%, hsl(22, 56%, 29%) 100%)',
                'gradient-2': 'linear-gradient(135deg, hsl(275, 25%, 46%) 0%, hsl(275, 25%, 34%) 100%)',
                'button-border-gradient': 'linear-gradient(135deg, hsla(22, 56%, 29%, 0.9), hsla(32, 55%, 35%, 0.9))',
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
};