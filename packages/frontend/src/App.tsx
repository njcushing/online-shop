import "@mantine/core/styles.css";
import { MantineProvider, createTheme, Anchor } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "@mantine/dates/styles.css";
import "dayjs/locale/en";

import { useEffect } from "react";
import { Theme } from "./themes";
import { Router } from "./routes";
import "./index.css";

dayjs.locale("en");
dayjs.extend(customParseFormat);

const mantineDefaultTheme = createTheme({
    fontFamily: "var(--font-family, Inter, system-ui, sans-serif)",
    breakpoints: {
        xl: "1280px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xs: "480px",
        xxs: "360px",
    },
    components: {
        Anchor: Anchor.extend({
            defaultProps: {
                underline: "never",
            },
        }),
    },
});

export function App() {
    // Calculate 'vw' and 'vh' units
    useEffect(() => {
        const setUnits = () => {
            const vw = window.innerWidth * 0.01;
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vw", `${vw}px`);
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };

        setUnits();
        window.addEventListener("resize", setUnits);

        return () => {
            window.removeEventListener("resize", setUnits);
        };
    }, []);

    return (
        <MantineProvider defaultColorScheme="light" theme={mantineDefaultTheme}>
            <DatesProvider settings={{ locale: "en" }}>
                <Theme>
                    <Router />
                </Theme>
            </DatesProvider>
        </MantineProvider>
    );
}
