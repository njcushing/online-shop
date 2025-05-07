import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { App } from "./App";

// Mock dependencies
vi.mock("@/themes", () => ({
    Theme: () => <div aria-label="theme"></div>,
}));

vi.mock("@/routes", () => ({
    Router: () => <div aria-label="router"></div>,
}));

describe("The App component...", () => {
    let rootElement: HTMLDivElement;

    beforeEach(() => {
        document.body.innerHTML = "";
        rootElement = document.createElement("div");
        rootElement.setAttribute("id", "root");
        document.body.appendChild(rootElement);
    });

    test("Should render the Theme component", async () => {
        render(<App />);

        expect(screen.getByLabelText("theme")).toBeInTheDocument();
    });

    test("Should set the '--vw' and '--vh' properties on the document element equal to 1% of the window's innerWidth and innerHeight, respectively", async () => {
        render(<App />);

        const documentElementStyles = document.documentElement.style;

        expect(documentElementStyles.getPropertyValue("--vw")).toBe(
            `${window.innerWidth * 0.01}px`,
        );
        expect(documentElementStyles.getPropertyValue("--vh")).toBe(
            `${window.innerHeight * 0.01}px`,
        );
    });
});
