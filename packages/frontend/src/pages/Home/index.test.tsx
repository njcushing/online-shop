import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { Home } from ".";

// Mock dependencies
vi.mock("@/features/Hero", () => ({
    Hero: () => <div aria-label="hero-component"></div>,
}));

describe("The Home component...", () => {
    test("Should render the Hero component", () => {
        render(<Home />);

        const HeroComponent = screen.getByLabelText("hero-component");
        expect(HeroComponent).toBeInTheDocument();
    });
});
