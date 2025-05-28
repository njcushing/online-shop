import { screen, render, userEvent } from "@test-utils";
import { BrowserRouter } from "react-router-dom";
import _ from "lodash";
import { act } from "react";
import { vi } from "vitest";
import { Logo, TLogo } from ".";

// Mock dependencies
const mockProps: TLogo = {
    size: "m",
    onClick: undefined,
};

type renderFuncArgs = {
    propsOverride?: TLogo;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { propsOverride } = args;

    const mergedProps = _.merge(_.cloneDeep(structuredClone(mockProps)), propsOverride);

    const component = (
        // Using BrowserRouter for Link component
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Logo {...mergedProps} />
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return { rerender, component };
};

describe("The Logo component...", () => {
    describe("Should render a React Link component...", async () => {
        test("That directs the user to '/' on click", async () => {
            window.history.pushState({}, "", "/some-path");

            renderFunc();

            const LinkComponent = screen.getByRole("link");
            expect(LinkComponent).toBeInTheDocument();

            expect(window.location.pathname).toBe("/some-path");

            await act(() => userEvent.click(LinkComponent));

            expect(window.location.pathname).toBe("/");
        });

        test("That should, on click, invoke the callback function passed to the 'onClick' prop", async () => {
            const callback = vi.fn();

            renderFunc({ propsOverride: { onClick: callback } });

            const LinkComponent = screen.getByRole("link");
            expect(LinkComponent).toBeInTheDocument();

            expect(callback).not.toHaveBeenCalled();

            await act(() => userEvent.click(LinkComponent));

            expect(callback).toHaveBeenCalled();
        });
    });
});
