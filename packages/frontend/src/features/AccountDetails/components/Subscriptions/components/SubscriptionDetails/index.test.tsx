import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { SubscriptionDetails, TSubscriptionDetails } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockSubscription: RecursivePartial<
    NonNullable<IUserContext["subscriptions"]["data"]>[number]
> = {
    id: "1",
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
    count: 10,
    variant: { price: { current: 500, subscriptionDiscountPercentage: 10 } },
};
const mockProps: RecursivePartial<TSubscriptionDetails> = {
    data: mockSubscription as NonNullable<IUserContext["subscriptions"]["data"]>[number],
};

const mockUserContext: RecursivePartial<IUserContext> = {
    subscriptions: {
        data: [],
        status: 200,
        message: "Success",
        awaiting: false,
    },

    defaultData: { subscriptions: [] },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TSubscriptionDetails;
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
                <SubscriptionDetails {...mergedProps} />
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

vi.mock("@settings", () => ({
    settings: { freeDeliveryThreshold: 5000, expressDeliveryCost: 599 },
}));

describe("The SubscriptionDetails component...", () => {
    describe("Should render the subscription's delivery address...", () => {
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

    describe("Should render the subscription's billing address...", () => {
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

    test("Should render the subscription's expected item cost subtotal, in pence, in the format: £XX.XX", () => {
        renderFunc();

        const { count, variant } = mockProps.data!;
        const { price } = variant!;
        const { current, subscriptionDiscountPercentage } = price!;

        const estimatedUnitCost = current! * (1 - subscriptionDiscountPercentage! / 100) * count!;

        const itemSubtotalElement = screen.getByText(
            `Item(s) Subtotal: £${(estimatedUnitCost / 100).toFixed(2)}`,
        );
        expect(itemSubtotalElement).toBeInTheDocument();
    });

    describe("Should render the subscription's expected postage cost...", () => {
        test("In pence, the format: £XX.XX, if the expected item cost subtotal exceeds the free delivery threshold", () => {
            renderFunc({
                propsOverride: {
                    data: { variant: { price: { current: 1 } } },
                } as TSubscriptionDetails,
            });

            const postageCostElement = screen.getByText("Postage: £5.99");
            expect(postageCostElement).toBeInTheDocument();
        });

        test("As 'FREE' if the expected item cost subtotal does not exceed the free delivery threshold", () => {
            renderFunc({
                propsOverride: {
                    data: { variant: { price: { current: 1000000 } } },
                } as TSubscriptionDetails,
            });

            const postageCostElement = screen.getByText("Postage: FREE");
            expect(postageCostElement).toBeInTheDocument();
        });
    });

    test("Should render the subscription's expected total cost, in pence, in the format: £XX.XX", () => {
        renderFunc();

        const { count, variant } = mockProps.data!;
        const { price } = variant!;
        const { current, subscriptionDiscountPercentage } = price!;

        const estimatedUnitCost = current! * (1 - subscriptionDiscountPercentage! / 100) * count!;
        const meetsFreeDeliveryThreshold = estimatedUnitCost >= 5000;
        const deliveryCost = meetsFreeDeliveryThreshold ? 0 : 599;
        const subtotal = estimatedUnitCost + deliveryCost;

        const postageCostElement = screen.getByText(`Total: £${(subtotal / 100).toFixed(2)}`);
        expect(postageCostElement).toBeInTheDocument();
    });
});
