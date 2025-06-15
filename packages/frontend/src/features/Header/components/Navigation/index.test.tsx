import { vi } from "vitest";
import { screen, render, userEvent, within } from "@test-utils";
import _ from "lodash";
import { act, forwardRef } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { IUserContext, UserContext } from "@/pages/Root";
import { mockCategories } from "./index.mocks";
import { Navigation, TNavigation } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
const mockProps: TNavigation = {
    opened: true,
};

// Mock contexts are only using fields relevant to component being tested
const mockCart: RecursivePartial<IUserContext["cart"]["data"]> = [
    // Only using relevant fields
    { product: {}, variant: { id: "variant1Id" }, quantity: 1 },
    { product: {}, variant: { id: "variant2Id" }, quantity: 1 },
    { product: {}, variant: { id: "variant3Id" }, quantity: 1 },
];

const mockUserContext: RecursivePartial<IUserContext> = {
    cart: {
        data: mockCart as IUserContext["cart"]["data"],
        status: 200,
        message: "Success",
        awaiting: false,
    },

    defaultData: { cart: [] },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TNavigation;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { UserContextOverride, propsOverride, initRender = false } = args;

    let UserContextValue!: IUserContext;

    function Component({
        context,
        props,
    }: {
        context?: { User?: renderFuncArgs["UserContextOverride"] };
        props?: renderFuncArgs["propsOverride"];
    }) {
        const mergedUserContext = _.merge(_.cloneDeep(mockUserContext), context?.User);
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return (
            <UserContext.Provider value={mergedUserContext}>
                <UserContext.Consumer>
                    {(value) => {
                        UserContextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
                <Navigation {...mergedProps} />
            </UserContext.Provider>
        );
    }

    function BrowserRouterWrapper({
        context,
        props,
    }: {
        context?: { User?: renderFuncArgs["UserContextOverride"] };
        props?: renderFuncArgs["propsOverride"];
    }) {
        return (
            // Using BrowserRouter for Link component(s)
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component context={context} props={props} />
            </BrowserRouter>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(
              <BrowserRouterWrapper
                  context={{ User: UserContextOverride }}
                  props={propsOverride}
              />,
          )
        : await act(() =>
              render(
                  <BrowserRouterWrapper
                      context={{ User: UserContextOverride }}
                      props={propsOverride}
                  />,
              ),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <BrowserRouterWrapper
                    context={{ User: newArgs.UserContextOverride }}
                    props={newArgs.propsOverride}
                />,
            );
        },
        getUserContextValue: () => UserContextValue,
        component: (
            <BrowserRouterWrapper context={{ User: UserContextOverride }} props={propsOverride} />
        ),
    };
};

vi.mock("@/features/Logo", () => ({
    Logo: vi.fn((props: unknown) => {
        return <div aria-label="Logo component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/Header/components/Navigation/components/NavDrawer", () => ({
    NavDrawer: vi.fn((props: unknown & { onClose: () => unknown }) => {
        const { onClose } = props;

        return (
            <div aria-label="NavDrawer component" data-props={JSON.stringify(props)}>
                <button type="button" onClick={() => onClose && onClose()}></button>
            </div>
        );
    }),
}));

vi.mock("@/features/Cart/components/CartDrawer", () => ({
    CartDrawer: vi.fn((props: unknown & { onClose: () => unknown }) => {
        const { onClose } = props;

        return (
            <div aria-label="CartDrawer component" data-props={JSON.stringify(props)}>
                <button type="button" onClick={() => onClose && onClose()}></button>
            </div>
        );
    }),
}));

vi.mock("@/features/Header/components/SearchBar", async () => {
    const SearchBar = forwardRef<HTMLDivElement, unknown>((props, ref) => {
        return (
            <>
                <div
                    aria-label="SearchBar component"
                    data-props={JSON.stringify(props)}
                    ref={ref}
                ></div>
                <div data-testid="outside"></div>
            </>
        );
    });
    SearchBar.displayName = "HeaderSearchBar";

    return { SearchBar };
});

vi.mock("@/utils/products/categories", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        categories: (await import("./index.mocks")).mockCategories,
    };
});

describe("The Navigation component...", () => {
    describe("Should render a <nav> element...", () => {
        test("As expected", () => {
            renderFunc();

            const navElement = screen.getByRole("navigation");
            expect(navElement).toBeInTheDocument();
        });

        describe("Which should contain a Mantine Burger component...", () => {
            test("Accessible via a 'Toggle navigation' aria-label", () => {
                renderFunc();

                const navElement = screen.getByRole("navigation");
                const BurgerComponent = within(navElement).getByRole("button", {
                    name: "Toggle navigation",
                });
                expect(BurgerComponent).toBeInTheDocument();
            });

            test("That, on click, toggles the NavDrawer component's 'opened' prop", async () => {
                await renderFunc();

                const navElement = screen.getByRole("navigation");

                const BurgerComponent = within(navElement).getByRole("button", {
                    name: "Toggle navigation",
                });

                const NavDrawerComponent = screen.getByLabelText("NavDrawer component");
                expect(NavDrawerComponent).toBeInTheDocument();

                const initialOpenedPropValue = getProps(NavDrawerComponent).opened;

                await act(async () => userEvent.click(BurgerComponent));

                expect(getProps(NavDrawerComponent).opened).toBe(!initialOpenedPropValue);
            });
        });

        test("Which should contain the Logo component", () => {
            renderFunc();

            const navElement = screen.getByRole("navigation");
            const LogoComponent = within(navElement).getByLabelText("Logo component");
            expect(LogoComponent).toBeInTheDocument();
        });

        describe("Which should contain a 'Search' button...", async () => {
            test("That, on click, toggles the SearchBar component's 'opened' prop", async () => {
                await renderFunc();

                const navElement = screen.getByRole("navigation");

                const SearchButton = within(navElement).getByRole("button", { name: "Search" });
                expect(SearchButton).toBeInTheDocument();

                const SearchBarComponent = screen.getByLabelText("SearchBar component");
                expect(SearchBarComponent).toBeInTheDocument();

                const initialOpenedPropValue = getProps(SearchBarComponent).opened;

                await act(async () => userEvent.click(SearchButton));

                expect(getProps(SearchBarComponent).opened).toBe(!initialOpenedPropValue);
            });
        });

        describe("Which should contain a 'Cart' button...", async () => {
            test("That, on click, toggles the CartDrawer component's 'opened' prop", async () => {
                await renderFunc();

                const navElement = screen.getByRole("navigation");

                const CartButton = within(navElement).getByRole("button", { name: "Cart" });
                expect(CartButton).toBeInTheDocument();

                const CartDrawerComponent = screen.getByLabelText("CartDrawer component");
                expect(CartDrawerComponent).toBeInTheDocument();

                const initialOpenedPropValue = getProps(CartDrawerComponent).opened;

                await act(async () => userEvent.click(CartButton));

                expect(getProps(CartDrawerComponent).opened).toBe(!initialOpenedPropValue);
            });
        });

        test("Should render an element that displays the quantity of items in the user's cart", async () => {
            await renderFunc();

            const cartQuantity = screen.getByText(mockCart.length);
            expect(cartQuantity).toBeInTheDocument();
        });

        test("Which should contain links to each product category", async () => {
            await renderFunc();

            const navElement = screen.getByRole("navigation");

            mockCategories.forEach((category) => {
                const categoryLink = within(navElement).getByRole("link", { name: category.name });
                expect(categoryLink).toBeInTheDocument();
                expect(categoryLink.getAttribute("href")).toBe(`/c/${category.slug}`);
            });
        });
    });

    describe("Should render the NavDrawer component...", async () => {
        test("That, on close, should have its 'opened' prop set to 'false'", async () => {
            await renderFunc();

            const navElement = screen.getByRole("navigation");

            const NavDrawerComponent = screen.getByLabelText("NavDrawer component");
            expect(NavDrawerComponent).toBeInTheDocument();

            const closeButton = within(NavDrawerComponent).getByRole("button");

            expect(getProps(NavDrawerComponent).opened).toBe(false);

            const BurgerComponent = within(navElement).getByRole("button", {
                name: "Toggle navigation",
            });
            await act(async () => userEvent.click(BurgerComponent));

            expect(getProps(NavDrawerComponent).opened).toBe(true);

            await act(async () => userEvent.click(closeButton));

            expect(getProps(NavDrawerComponent).opened).toBe(false);
        });
    });

    describe("Should render the CartDrawer component...", async () => {
        test("That, on close, should have its 'opened' prop set to 'false'", async () => {
            await renderFunc();

            const navElement = screen.getByRole("navigation");

            const CartDrawerComponent = screen.getByLabelText("CartDrawer component");
            expect(CartDrawerComponent).toBeInTheDocument();

            const closeButton = within(CartDrawerComponent).getByRole("button");

            expect(getProps(CartDrawerComponent).opened).toBe(false);

            const CartButton = within(navElement).getByRole("button", { name: "Cart" });
            await act(async () => userEvent.click(CartButton));

            expect(getProps(CartDrawerComponent).opened).toBe(true);

            await act(async () => userEvent.click(closeButton));

            expect(getProps(CartDrawerComponent).opened).toBe(false);
        });
    });

    test("Should render the SearchBar component", async () => {
        await renderFunc();

        const SearchBarComponent = screen.getByLabelText("SearchBar component");
        expect(SearchBarComponent).toBeInTheDocument();
    });

    test("Should, when one of the NavDrawer, CartDrawer or SearchBar components' 'opened' props are 'true', force the others' to be 'false'", async () => {
        await renderFunc();

        const navElement = screen.getByRole("navigation");

        const NavDrawerComponent = screen.getByLabelText("NavDrawer component");
        const CartDrawerComponent = screen.getByLabelText("CartDrawer component");
        const SearchBarComponent = screen.getByLabelText("SearchBar component");

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(false);

        const CartButton = within(navElement).getByRole("button", { name: "Cart" });
        await act(async () => userEvent.click(CartButton));

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(true);
        expect(getProps(SearchBarComponent).opened).toBe(false);

        const SearchButton = within(navElement).getByRole("button", { name: "Search" });
        await act(async () => userEvent.click(SearchButton));

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(true);

        const BurgerComponent = within(navElement).getByRole("button", {
            name: "Toggle navigation",
        });
        await act(async () => userEvent.click(BurgerComponent));

        expect(getProps(NavDrawerComponent).opened).toBe(true);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(false);
    });

    test("Should force the NavDrawer, CartDrawer and SearchBar components' 'opened' props to all be 'false' if its own 'opened' prop is 'false'", async () => {
        await renderFunc({ propsOverride: { opened: false } });

        const navElement = screen.getByRole("navigation");

        const NavDrawerComponent = screen.getByLabelText("NavDrawer component");
        const CartDrawerComponent = screen.getByLabelText("CartDrawer component");
        const SearchBarComponent = screen.getByLabelText("SearchBar component");

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(false);

        const CartButton = within(navElement).getByRole("button", { name: "Cart" });
        await act(async () => userEvent.click(CartButton));

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(false);

        const SearchButton = within(navElement).getByRole("button", { name: "Search" });
        await act(async () => userEvent.click(SearchButton));

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(false);

        const BurgerComponent = within(navElement).getByRole("button", {
            name: "Toggle navigation",
        });
        await act(async () => userEvent.click(BurgerComponent));

        expect(getProps(NavDrawerComponent).opened).toBe(false);
        expect(getProps(CartDrawerComponent).opened).toBe(false);
        expect(getProps(SearchBarComponent).opened).toBe(false);
    });
});
