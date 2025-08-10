import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { IUserContext, UserContext } from "@/pages/Root";
import { SubscriptionProduct, TSubscriptionProduct } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
const mockVariant = {
    price: { base: 1000, current: 500, subscriptionDiscountPercentage: 10 },
    options: { option1Name: "option1Value", option2Name: "option2Value" },
    image: { src: "variantThumbImgSrc", alt: "variantThumbImgAlt" },
};
const mockProduct = {
    id: "productId",
    slug: "product-slug",
    name: { full: "Product Name" },
    images: { thumb: { src: "productThumbImgSrc", alt: "productThumbImgAlt" }, dynamic: [] },
};
const mockProps: RecursivePartial<TSubscriptionProduct> = {
    data: { product: mockProduct, variant: mockVariant },
};

// Mock contexts are only using fields relevant to component being tested
const mockUserContext: RecursivePartial<IUserContext> = {
    subscriptions: {
        response: {
            data: [],
            status: 200,
            message: "Success",
        },
        awaiting: false,
    },

    defaultData: { subscriptions: [] },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TSubscriptionProduct;
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
                <SubscriptionProduct {...mergedProps} />
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

vi.mock("@/features/Price", () => ({
    Price: vi.fn((props: unknown) => {
        return <div aria-label="Price component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        variantOptions: [
            {
                id: "option1Name",
                name: "Option 1 Name",
                values: [{ id: "option1Value", name: "Option 1 Value" }],
            },
        ],
    };
});

describe("The SubscriptionProduct component...", () => {
    describe("Should render an <img> element", () => {
        test("With 'src' and 'alt' attributes equal to the variant's image by default", () => {
            renderFunc();

            const { src, alt } = mockVariant.image;

            const variantImage = screen.getByAltText(alt);
            expect(variantImage).toBeInTheDocument();
            expect(variantImage.getAttribute("src")).toBe(src);
        });

        test("With 'src' and 'alt' attributes equal to the product's image if the variant doesn't have an image", () => {
            renderFunc({
                propsOverride: {
                    data: { variant: { image: null } },
                } as unknown as TSubscriptionProduct,
            });

            const { src, alt } = mockProduct.images.thumb;

            const productImage = screen.getByAltText(alt);
            expect(productImage).toBeInTheDocument();
            expect(productImage.getAttribute("src")).toBe(src);
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", () => {
            renderFunc({
                UserContextOverride: {
                    subscriptions: { awaiting: true },
                } as unknown as IUserContext,
            });

            const { alt } = mockVariant.image;

            // queryByAltText *does not* exclude hidden elements - must manually check visibility
            const variantImage = screen.queryByAltText(alt);
            expect(variantImage).not.toBeVisible();
        });
    });

    describe("Should render a react-router-dom Link component...", () => {
        test("With text content equal to the product's 'name.full' field", () => {
            renderFunc();

            const { full } = mockProduct.name;

            const LinkComponent = screen.getByRole("link", { name: full });
            expect(LinkComponent).toBeInTheDocument();
        });

        test("With an 'href' attribute equal to the product page and its specific variant", () => {
            renderFunc();

            const { id, slug, name } = mockProduct;
            const { full } = name;
            const { options } = mockVariant;

            const variantUrlParams = new URLSearchParams();
            Object.entries(options).forEach(([key, value]) =>
                variantUrlParams.append(key, `${value}`),
            );

            const LinkComponent = screen.getByRole("link", { name: full });
            expect(LinkComponent.getAttribute("href")).toBe(`/p/${id}/${slug}?${variantUrlParams}`);
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", () => {
            renderFunc({
                UserContextOverride: {
                    subscriptions: { awaiting: true },
                } as unknown as IUserContext,
            });

            const LinkComponent = screen.queryByRole("link");
            expect(LinkComponent).not.toBeInTheDocument();
        });
    });

    describe("Should render information about each of the variant's options...", () => {
        test("Including the name and value from the defined variant options", () => {
            renderFunc();

            expect(screen.getByText("Option 1 Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("Option 1 Value")).toBeInTheDocument();
        });

        test("Or the key and value as a backup", () => {
            renderFunc();

            expect(screen.getByText("option2Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("option2Value")).toBeInTheDocument();
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", () => {
            renderFunc({
                UserContextOverride: {
                    subscriptions: { awaiting: true },
                } as unknown as IUserContext,
            });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            expect(screen.queryByText("Option 1 Name", { exact: false })).not.toBeVisible();
        });
    });

    describe("Should render a Price component...", () => {
        test("With text content equal to the product's 'name.full' field", () => {
            renderFunc();

            const PriceComponent = screen.getByLabelText("Price component");
            expect(PriceComponent).toBeInTheDocument();
        });

        test("Passing the correct props", () => {
            renderFunc();

            const { base, current, subscriptionDiscountPercentage } =
                mockProps.data!.variant!.price!;

            const PriceComponent = screen.getByLabelText("Price component");
            const props = getProps(PriceComponent);
            expect(props).toEqual(
                expect.objectContaining({
                    base,
                    current: current! * (1 - subscriptionDiscountPercentage! / 100),
                }),
            );
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", () => {
            renderFunc({
                UserContextOverride: {
                    subscriptions: { awaiting: true },
                } as unknown as IUserContext,
            });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const PriceComponent = screen.queryByLabelText("Price component");
            expect(PriceComponent).not.toBeVisible();
        });
    });

    describe("Should render a subscription discount message with appropriate text content...", () => {
        test("As expected", () => {
            renderFunc();

            const { subscriptionDiscountPercentage } = mockProps.data!.variant!.price!;

            const subscriptionDiscountMessageElement = screen.getByText(
                `${subscriptionDiscountPercentage}%`,
            );
            expect(subscriptionDiscountMessageElement).toBeInTheDocument();
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", () => {
            renderFunc({
                UserContextOverride: {
                    subscriptions: { awaiting: true },
                } as unknown as IUserContext,
            });

            const { subscriptionDiscountPercentage } = mockProps.data!.variant!.price!;

            const subscriptionDiscountMessageElement = screen.queryByText(
                `${subscriptionDiscountPercentage}%`,
            );
            expect(subscriptionDiscountMessageElement).not.toBeInTheDocument();
        });
    });
});
