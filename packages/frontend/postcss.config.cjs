module.exports = {
    plugins: {
        "postcss-preset-mantine": {},
        "postcss-simple-vars": {
            variables: {
                "mantine-breakpoint-xs": "1280px",
                "mantine-breakpoint-sm": "1024px",
                "mantine-breakpoint-md": "768px",
                "mantine-breakpoint-lg": "640px",
                "mantine-breakpoint-xl": "480px",
            },
        },
    },
};
