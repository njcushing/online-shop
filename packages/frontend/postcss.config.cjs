module.exports = {
    plugins: {
        "postcss-preset-mantine": {},
        "postcss-simple-vars": {
            variables: {
                "mantine-breakpoint-xl": "1280px",
                "mantine-breakpoint-lg": "1024px",
                "mantine-breakpoint-md": "768px",
                "mantine-breakpoint-sm": "640px",
                "mantine-breakpoint-xs": "480px",
            },
        },
    },
};
