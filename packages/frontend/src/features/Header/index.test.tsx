import { vi } from "vitest";
import { screen, render, within } from "@test-utils";
import _ from "lodash";
import { IHeaderContext, HeaderContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { Header } from ".";

// Mock dependencies
const mockHeaderContext: RecursivePartial<IHeaderContext> = {
    setHeaderInfo: () => {},
};

type renderFuncArgs = {
    HeaderContextOverride?: IHeaderContext;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { HeaderContextOverride } = args;

    let HeaderContextValue!: IHeaderContext;

    const mergedUserContext = _.merge(_.cloneDeep(mockHeaderContext), HeaderContextOverride);

    const component = (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <HeaderContext.Provider value={mergedUserContext}>
                <HeaderContext.Consumer>
                    {(value) => {
                        HeaderContextValue = value;
                        return null;
                    }}
                </HeaderContext.Consumer>
                <Header />
            </HeaderContext.Provider>
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return {
        rerender,
        HeaderContextValue,
        component,
    };
};

vi.mock("@/features/Header/components/Navigation", () => ({
    Navigation: vi.fn((props: unknown) => {
        return (
            <nav
                aria-label="Navigation component"
                data-props={JSON.stringify(props)}
                style={{ height: "100px" }}
            ></nav>
        );
    }),
}));

describe("The Header component...", () => {
    afterEach(() => {
        window.history.pushState({}, "", "/");
    });

    test("Should render the Navigation component within a <header> element", () => {
        renderFunc();

        const headerElement = screen.getByRole("banner");
        expect(headerElement).toBeInTheDocument();

        const NavigationComponent = within(headerElement).getByLabelText("Navigation component");
        expect(NavigationComponent).toBeInTheDocument();
    });

    // Some of the following tests aren't very comprehensive as they don't test the internal logic
    // of the component, i.e. - the forceClose function should be able to force the 'open' state of
    // the component to be 'false'. However, due to the way resizing elements works in jsdom, I
    // haven't found a good solution for manually resizing the <header> element and window to test
    // how scrolling and the forceClose function affect the position of the header (caused by
    // changes in the internal state).
    //
    // The component uses the ResizeObserver API, but I can't get it to trigger a manual resize of
    // the <header> element, even using a mocked callback passed to the API, meaning I can't test
    // the internal logic that depends on the window and <header> having different sizes. I may
    // revisit this in future and try to find a solution for this, but for now I have disabled
    // coverage for the useEffect hook that handles this logic.

    describe("Should pass an object to the Root component's HeaderContext's 'setHeaderInfo' field", () => {
        describe("Containing the 'active' state", () => {
            test("Which should be 'false' by default", () => {
                const setHeaderInfoSpy = vi.fn();

                renderFunc({ HeaderContextOverride: { setHeaderInfo: setHeaderInfoSpy } });

                expect(setHeaderInfoSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ active: false }),
                );
            });
        });

        describe("Containing the 'open' state", () => {
            test("Which should be 'true' if the user is currently at the top of the window (which, in jsdom, it will be)", () => {
                const setHeaderInfoSpy = vi.fn();

                renderFunc({ HeaderContextOverride: { setHeaderInfo: setHeaderInfoSpy } });

                expect(setHeaderInfoSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ open: true }),
                );
            });
        });

        describe("Containing the 'height' state", () => {
            test("Which should be equal to the height of the header obtained from a ResizeObserver (which, in jsdom, will be 0)", () => {
                const setHeaderInfoSpy = vi.fn();

                renderFunc({ HeaderContextOverride: { setHeaderInfo: setHeaderInfoSpy } });

                const headerElement = screen.getByRole("banner");

                expect(setHeaderInfoSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        height: headerElement.getBoundingClientRect().height,
                    }),
                );
            });
        });

        test("Containing the 'forceClose' function", () => {
            const setHeaderInfoSpy = vi.fn();

            renderFunc({ HeaderContextOverride: { setHeaderInfo: setHeaderInfoSpy } });

            const args = setHeaderInfoSpy.mock.calls[0][0];
            const { forceClose } = args;

            expect(typeof forceClose).toBe("function");
        });
    });
});
