import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import { BrowserRouter } from "react-router-dom";
import { act } from "react";
import { ErrorPage } from ".";

const renderFunc = async () => {
    const component = (
        // Using BrowserRouter for Link component
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <ErrorPage />
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return { rerender, component };
};

vi.mock("@/features/Header", () => ({
    Header: vi.fn(() => <div aria-label="Header component"></div>),
}));

vi.mock("@/features/Footer", () => ({
    Footer: vi.fn(() => <div aria-label="Footer component"></div>),
}));

describe("The ErrorPage component...", () => {
    test("Should render a heading element explaining to the user that they are on an error page", async () => {
        renderFunc();

        const heading = screen.getByRole("heading");
        expect(heading).toBeInTheDocument();
    });

    test("Should render a Link component that directs the user to '/' on click", async () => {
        window.history.pushState({}, "", "/some-path");

        renderFunc();

        const LinkComponent = screen.getByRole("link");
        expect(LinkComponent).toBeInTheDocument();

        expect(window.location.pathname).toBe("/some-path");

        await act(() => userEvent.click(LinkComponent));

        expect(window.location.pathname).toBe("/");
    });
});
