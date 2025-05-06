import React from "react";
import { render as testingLibraryRender } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { theme } from "./mantine-config";

export * from "@testing-library/react";
export function render(ui: React.ReactNode) {
    return testingLibraryRender(ui, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <MantineProvider theme={theme}>
                <DatesProvider settings={{ locale: "en" }}>{children}</DatesProvider>
            </MantineProvider>
        ),
    });
}
export { userEvent } from "@testing-library/user-event";
