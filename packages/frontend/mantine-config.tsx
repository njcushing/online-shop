import { createTheme, Anchor } from "@mantine/core";

export const theme = createTheme({
    fontFamily: "var(--font-family, Inter, system-ui, sans-serif)",
    breakpoints: {
        xl: "1280px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xs: "480px",
    },
    components: {
        Anchor: Anchor.extend({
            defaultProps: {
                underline: "never",
            },
        }),
    },
});
