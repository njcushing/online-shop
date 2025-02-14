import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { useEffect } from "react";
import { Theme } from "./themes";
import { Router } from "./routes";
import "./index.css";

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
        <MantineProvider defaultColorScheme="light">
            <Theme>
                <Router />
            </Theme>
        </MantineProvider>
    );
}
