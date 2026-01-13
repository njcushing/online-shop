import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "dayjs/locale/en";

import { useEffect } from "react";
import { Theme } from "./themes";
import { theme } from "../mantine-config";
import { Router } from "./routes";
import "./assets/flags/flag-icons.min.css";
import "./index.css";

dayjs.locale("en");
dayjs.extend(customParseFormat);

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
        <MantineProvider defaultColorScheme="light" theme={theme}>
            <DatesProvider settings={{ locale: "en" }}>
                <Theme>
                    <Router />
                </Theme>
            </DatesProvider>
        </MantineProvider>
    );
}
