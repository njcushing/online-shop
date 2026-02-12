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
    useEffect(() => {
        const setViewportUnits = () => {
            const vw = window.innerWidth * 0.01;
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vw", `${vw}px`);
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };

        setViewportUnits();

        window.addEventListener("resize", setViewportUnits);

        return () => {
            window.removeEventListener("resize", setViewportUnits);
        };
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const width = entry.borderBoxSize?.[0].inlineSize;
                document.documentElement.style.setProperty("--body-width", `${width}px`);
            });
        });

        observer.observe(document.body, { box: "border-box" });

        return () => observer.unobserve(document.body);
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
