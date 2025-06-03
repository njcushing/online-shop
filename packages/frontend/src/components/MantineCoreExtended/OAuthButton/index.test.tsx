import { screen, render } from "@test-utils";
import { BrowserRouter } from "react-router-dom";
import { OAuthButton } from ".";

const renderFunc = () => {
    const component = (
        // Using BrowserRouter for polymorphic Mantine Button component with 'link' role
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <OAuthButton />
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return {
        rerender,
        component,
    };
};

describe("The OAuthButton component...", () => {
    test("Should render a Mantine Button component with <a> root element via the 'component' prop", () => {
        renderFunc();

        const ButtonComponent = screen.getByRole("link");
        expect(ButtonComponent).toBeInTheDocument();
    });
});
