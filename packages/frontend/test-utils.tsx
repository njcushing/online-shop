import React from "react";
import { render as testingLibraryRender } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./mantine-config";

export * from "@testing-library/react";
export function render(ui: React.ReactNode) {
    return testingLibraryRender(ui, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <MantineProvider theme={theme}>
                    <DatesProvider settings={{ locale: "en" }}>{children}</DatesProvider>
                </MantineProvider>
            </BrowserRouter>
        ),
    });
}
export { userEvent } from "@testing-library/user-event";
