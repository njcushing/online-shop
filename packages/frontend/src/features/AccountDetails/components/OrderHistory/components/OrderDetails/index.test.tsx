import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { OrderDetails, TOrderDetails } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockOrder: RecursivePartial<NonNullable<IUserContext["orders"]["response"]["data"]>[number]> =
    {
        id: "1",
        orderNo: "Order 1 No",
        status: "pending",
        cost: {
            total: 3000,
            products: 2500,
            postage: 500,
        },
        products: [
            { product: { id: "product1Id" } },
            { product: { id: "product2Id" } },
            { product: { id: "product3Id" } },
        ],
        deliveryAddress: {
            line1: "Delivery Address Line 1",
            line2: "Delivery Address Line 2",
            townCity: "Delivery Address Town/City",
            county: "Delivery Address County",
            postcode: "Delivery Address Postcode",
        },
        billingAddress: {
            line1: "Billing Address Line 1",
            line2: "Billing Address Line 2",
            townCity: "Billing Address Town/City",
            county: "Billing Address County",
            postcode: "Billing Address Postcode",
        },
        orderDate: new Date("1970-01-01").toISOString(),
        deliveryInfo: {
            expectedDate: new Date("1970-01-02").toISOString(),
            deliveredDate: new Date("1970-01-03").toISOString(),
            trackingNumber: "Tracking No",
        },
    };
const mockProps: RecursivePartial<TOrderDetails> = {
    data: mockOrder as NonNullable<IUserContext["orders"]["response"]["data"]>[number],
    awaiting: false,
};

const mockUserContext: RecursivePartial<IUserContext> = {
    orders: {
        response: {
            data: [],
            status: 200,
            message: "Success",
        },
        awaiting: false,
    },

    defaultData: { orders: [] },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TOrderDetails;
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
                <OrderDetails {...mergedProps} />
            </UserContext.Provider>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<Component context={{ User: UserContextOverride }} props={propsOverride} />)
        : await act(() =>
              render(<Component context={{ User: UserContextOverride }} props={propsOverride} />),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <Component
                    context={{ User: newArgs.UserContextOverride }}
                    props={newArgs.propsOverride}
                />,
            );
        },
        getUserContextValue: () => UserContextValue,
        component: <Component context={{ User: UserContextOverride }} props={propsOverride} />,
    };
};

describe("The OrderDetails component...", () => {
    describe("Should render the order's delivery address...", () => {
        test("Including the first line of the address", () => {
            renderFunc();

            const { line1 } = mockProps.data!.deliveryAddress!;

            const deliveryAddressLine1Element = screen.getByText(line1!);
            expect(deliveryAddressLine1Element).toBeInTheDocument();
        });

        test("Including the second line of the address", () => {
            renderFunc();

            const { line2 } = mockProps.data!.deliveryAddress!;

            const deliveryAddressLine2Element = screen.getByText(line2!);
            expect(deliveryAddressLine2Element).toBeInTheDocument();
        });

        test("Including the town/city", () => {
            renderFunc();

            const { townCity } = mockProps.data!.deliveryAddress!;

            const deliveryAddressTownCityElement = screen.getByText(townCity!);
            expect(deliveryAddressTownCityElement).toBeInTheDocument();
        });

        test("Including the county", () => {
            renderFunc();

            const { county } = mockProps.data!.deliveryAddress!;

            const deliveryAddressCountyElement = screen.getByText(county!);
            expect(deliveryAddressCountyElement).toBeInTheDocument();
        });

        test("Including the postcode", () => {
            renderFunc();

            const { postcode } = mockProps.data!.deliveryAddress!;

            const deliveryAddressPostcodeElement = screen.getByText(postcode!);
            expect(deliveryAddressPostcodeElement).toBeInTheDocument();
        });
    });

    describe("Should render the order's billing address...", () => {
        test("Including the first line of the address", () => {
            renderFunc();

            const { line1 } = mockProps.data!.billingAddress!;

            const billingAddressLine1Element = screen.getByText(line1!);
            expect(billingAddressLine1Element).toBeInTheDocument();
        });

        test("Including the second line of the address", () => {
            renderFunc();

            const { line2 } = mockProps.data!.billingAddress!;

            const billingAddressLine2Element = screen.getByText(line2!);
            expect(billingAddressLine2Element).toBeInTheDocument();
        });

        test("Including the town/city", () => {
            renderFunc();

            const { townCity } = mockProps.data!.billingAddress!;

            const billingAddressTownCityElement = screen.getByText(townCity!);
            expect(billingAddressTownCityElement).toBeInTheDocument();
        });

        test("Including the county", () => {
            renderFunc();

            const { county } = mockProps.data!.billingAddress!;

            const billingAddressCountyElement = screen.getByText(county!);
            expect(billingAddressCountyElement).toBeInTheDocument();
        });

        test("Including the postcode", () => {
            renderFunc();

            const { postcode } = mockProps.data!.billingAddress!;

            const billingAddressPostcodeElement = screen.getByText(postcode!);
            expect(billingAddressPostcodeElement).toBeInTheDocument();
        });
    });

    test("Should render the order's item cost subtotal, in pence, in the format: £XX.XX", () => {
        renderFunc();

        const { products } = mockProps.data!.cost!;

        const subtotalElement = screen.getByText(
            `Item(s) Subtotal: £${(products! / 100).toFixed(2)}`,
        );
        expect(subtotalElement).toBeInTheDocument();
    });

    test("Should render the order's postage cost, in pence, in the format: £XX.XX", () => {
        renderFunc();

        const { postage } = mockProps.data!.cost!;

        const subtotalElement = screen.getByText(`Postage: £${(postage! / 100).toFixed(2)}`);
        expect(subtotalElement).toBeInTheDocument();
    });

    test("Should render the order's postage cost as 'FREE' if the postage cost is '0'", () => {
        renderFunc({ propsOverride: { data: { cost: { postage: 0 } } } as TOrderDetails });

        const subtotalElement = screen.getByText(`Postage: FREE`);
        expect(subtotalElement).toBeInTheDocument();
    });
});
