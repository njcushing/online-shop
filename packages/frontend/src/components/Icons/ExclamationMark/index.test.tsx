import { screen, render } from "@test-utils";
import { ExclamationMark } from ".";

describe("The ExclamationMark component...", () => {
    test("Should render with a default 'ariaLabel' prop equal to 'Error: '", () => {
        render(<ExclamationMark />);

        const svg = screen.getByLabelText("Error");
        expect(svg).toBeInTheDocument();
    });

    test("Should apply value of 'ariaLabel' prop to SVG element's 'aria-label' attribute", () => {
        render(<ExclamationMark ariaLabel="Alert" />);

        const svg = screen.getByLabelText("Alert");
        expect(svg).toBeInTheDocument();
    });

    test("Should render with default 'width' and 'height' props equal to '20px'", () => {
        render(<ExclamationMark />);

        const svg = screen.getByLabelText("Error");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("width", "20");
        expect(svg).toHaveAttribute("height", "20");
    });

    test("Should apply value of 'width' and 'height' props to SVG element's 'width' and 'height' attributes, respectively", () => {
        render(<ExclamationMark width="32" height="32" />);

        const svg = screen.getByLabelText("Error");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("width", "32");
        expect(svg).toHaveAttribute("height", "32");
    });

    test("Should correctly merge default 'style' object prop with user-defined one", () => {
        render(<ExclamationMark style={{ stroke: "black", strokeWidth: "32px" }} />);

        const svg = screen.getByLabelText("Error");
        expect(svg).toBeInTheDocument();
        const path = svg.querySelector("path");

        expect(path).toHaveAttribute("stroke", "black");
        expect(path).toHaveAttribute("stroke-width", "32px");
    });
});
