import { vi } from "vitest";
import { screen, render, userEvent, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { mockCategories } from "./index.mocks";
import { NavDrawer, TNavDrawer } from ".";

// Mock dependencies
const mockProps: TNavDrawer = {
    opened: true,
    onClose: () => {},
};

type renderFuncArgs = {
    propsOverride?: TNavDrawer;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <NavDrawer {...mergedProps} />;
    }

    function BrowserRouterWrapper({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        return (
            // Using BrowserRouter for Link component(s)
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component props={props} />
            </BrowserRouter>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<BrowserRouterWrapper props={propsOverride} />)
        : await act(() => render(<BrowserRouterWrapper props={propsOverride} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<BrowserRouterWrapper props={newArgs.propsOverride} />);
        },
        component: <BrowserRouterWrapper props={propsOverride} />,
    };
};

const mockGetIcon = vi.fn(() => <div></div>);
vi.mock("./utils/getIcon", async () => ({
    getIcon: () => mockGetIcon(),
}));

vi.mock("@/features/Logo", () => ({
    Logo: vi.fn((props: unknown & { onClick: () => unknown }) => {
        const { onClick } = props;

        return (
            <button
                type="button"
                aria-label="Logo component"
                data-props={JSON.stringify(props)}
                onClick={() => onClick && onClick()}
            ></button>
        );
    }),
}));

vi.mock("@/utils/products/categories", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        categories: (await import("./index.mocks")).mockCategories,
    };
});

describe("The NavDrawer component...", () => {
    describe("Should render a heading element...", async () => {
        describe("That should contain the Logo component...", async () => {
            test("That, on click, should invoke the callback function passed to the 'onClose' prop", async () => {
                const mockOnClose = vi.fn();

                await renderFunc({ propsOverride: { onClose: mockOnClose } });

                const headingElement = screen.getByRole("heading");
                expect(headingElement).toBeInTheDocument();

                const LogoComponent = within(headingElement).getByLabelText("Logo component");
                expect(LogoComponent).toBeInTheDocument();

                await act(async () => userEvent.click(LogoComponent));

                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        describe("That should contain a 'close' button...", async () => {
            test("That, on click, should invoke the callback function passed to the 'onClose' prop", async () => {
                const mockOnClose = vi.fn();

                await renderFunc({ propsOverride: { onClose: mockOnClose } });

                const closeButton = screen.getByRole("button", { name: "" });
                expect(closeButton).toBeInTheDocument();

                await act(async () => userEvent.click(closeButton));

                expect(mockOnClose).toHaveBeenCalled();
            });
        });
    });

    describe("Should render links...", async () => {
        test("To each product category", async () => {
            await renderFunc();

            mockCategories.forEach((category) => {
                const categoryLink = screen.getByRole("link", { name: category.name });
                expect(categoryLink).toBeInTheDocument();
                expect(categoryLink.getAttribute("href")).toBe(`/c/${category.slug}`);
            });
        });

        test("That, on click, should invoke the callback function passed to the 'onClose' prop", async () => {
            const mockOnClose = vi.fn();

            await renderFunc({ propsOverride: { onClose: mockOnClose } });

            for (let i = 0; i < mockCategories.length; i++) {
                const mockCategory = mockCategories[i];

                const categoryLink = screen.getByRole("link", { name: mockCategory.name });

                // Need to click each link one at a time and await the callback function invocation
                /* eslint-disable-next-line no-await-in-loop */
                await act(async () => userEvent.click(categoryLink));
            }

            expect(mockOnClose).toHaveBeenCalledTimes(mockCategories.length);
        });
    });
});
