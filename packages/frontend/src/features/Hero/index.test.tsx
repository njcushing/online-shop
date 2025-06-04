import { screen, render } from "@test-utils";
import { Hero } from ".";

const renderFunc = () => {
    const component = <Hero />;

    const { rerender } = render(component);

    return {
        rerender,
        component,
    };
};

describe("The Hero component...", () => {
    test("Should render a <section> element with visible text equal to: 'Hero'", () => {
        renderFunc();

        const sectionElement = screen.getByText("Hero");
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement.tagName).toBe("SECTION");
    });
});
