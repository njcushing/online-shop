import { vi } from "vitest";
import { screen, render, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { OrderSummary, TOrderSummary } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockOrder: RecursivePartial<NonNullable<IUserContext["orders"]["data"]>[number]> = {
    id: "1",
    orderNo: "Order 1 No",
    status: "pending",
    cost: { total: 3000 },
    products: [
        { product: { id: "product1Id" } },
        { product: { id: "product2Id" } },
        { product: { id: "product3Id" } },
    ],
    orderDate: new Date("1970-01-01").toISOString(),
    deliveryInfo: {
        expectedDate: new Date("1970-01-02").toISOString(),
        deliveredDate: new Date("1970-01-03").toISOString(),
        trackingNumber: "Tracking No",
    },
};
const mockProps: RecursivePartial<TOrderSummary> = {
    data: mockOrder as NonNullable<IUserContext["orders"]["data"]>[number],
};

const mockUserContext: RecursivePartial<IUserContext> = {
    orders: {
        data: [],
        status: 200,
        message: "Success",
        awaiting: false,
    },

    defaultData: { orders: [] },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TOrderSummary;
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
                <OrderSummary {...mergedProps} />
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

vi.mock("@/features/Price", () => ({
    Price: vi.fn((props: unknown) => {
        return <div aria-label="Price component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/AccountDetails/components/OrderHistory/components/OrderProduct", () => ({
    OrderProduct: vi.fn((props: unknown & { data: { product: { id: string } } }) => {
        const { data } = props;
        const { product } = data;
        const { id } = product;

        return (
            <div
                aria-label="OrderProduct component"
                data-props={JSON.stringify(props)}
            >{`OrderProduct id: ${id}`}</div>
        );
    }),
}));

vi.mock("@/features/AccountDetails/components/OrderHistory/components/OrderDetails", () => ({
    OrderDetails: vi.fn((props: unknown) => {
        return <div aria-label="OrderDetails component" data-props={JSON.stringify(props)}></div>;
    }),
}));

describe("The OrderSummary component...", () => {
    describe("Should render a <li> element...", () => {
        test("As expected", () => {
            renderFunc();

            const liElement = screen.getByRole("listitem");
            expect(liElement).toBeInTheDocument();
        });

        test("That should contain an element that display's the order's 'orderNo'", () => {
            renderFunc();

            const liElement = screen.getByRole("listitem");

            const { orderNo } = mockProps.data!;

            const orderNoElement = within(liElement).getByText(orderNo!);
            expect(orderNoElement).toBeInTheDocument();
        });

        describe("That should contain a Price component...", () => {
            test("With text content equal to the product's 'name.full' field", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const PriceComponent = within(liElement).getByLabelText("Price component");
                expect(PriceComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { total } = mockProps.data!.cost!;

                const PriceComponent = within(liElement).getByLabelText("Price component");
                const props = getProps(PriceComponent);
                expect(props).toEqual(expect.objectContaining({ base: total, current: total }));
            });

            test("Unless the UserContext's 'orders.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { orders: { awaiting: true } } as unknown as IUserContext,
                });

                const liElement = screen.getByRole("listitem");

                // queryByLabelText *does not* exclude hidden elements - must manually check visibility
                const PriceComponent = within(liElement).queryByLabelText("Price component");
                expect(PriceComponent).not.toBeVisible();
            });
        });

        test("That should contain the date the order was placed in the format: e.g. - January 1, 1970", () => {
            renderFunc();

            const liElement = screen.getByRole("listitem");

            const orderDateElement = within(liElement).getByText("January 1, 1970");
            expect(orderDateElement).toBeInTheDocument();
        });

        describe("That should contain a delivery status message with appropriate text content...", () => {
            test("For pending orders (order's 'status' field equals 'pending')", () => {
                renderFunc({ propsOverride: { data: { status: "pending" } } as TOrderSummary });

                const liElement = screen.getByRole("listitem");

                const statusMessageElement = within(liElement).getByText("Order pending");
                expect(statusMessageElement).toBeInTheDocument();
            });

            test("For orders awaiting dispatch (order's 'status' field equals 'paid')", () => {
                renderFunc({ propsOverride: { data: { status: "paid" } } as TOrderSummary });

                const liElement = screen.getByRole("listitem");

                const statusMessageElement = within(liElement).getByText("Awaiting dispatch");
                expect(statusMessageElement).toBeInTheDocument();
            });

            test("For dispatched orders (order's 'status' field equals 'shipped')", () => {
                renderFunc({ propsOverride: { data: { status: "shipped" } } as TOrderSummary });

                const liElement = screen.getByRole("listitem");

                const statusMessageElement = within(liElement).getByText("Order dispatched");
                expect(statusMessageElement).toBeInTheDocument();
            });

            test("For delivered orders (order's 'status' field equals 'delivered'), including the delivered date in the format: e.g. - January 1, 1970", () => {
                renderFunc({ propsOverride: { data: { status: "delivered" } } as TOrderSummary });

                const liElement = screen.getByRole("listitem");

                const statusMessageElement = within(liElement).getByText(
                    "Delivered January 3, 1970",
                );
                expect(statusMessageElement).toBeInTheDocument();
            });

            test("For cancelled orders (order's 'status' field equals 'cancelled')", () => {
                renderFunc({ propsOverride: { data: { status: "cancelled" } } as TOrderSummary });

                const liElement = screen.getByRole("listitem");

                const statusMessageElement = within(liElement).getByText("Order cancelled");
                expect(statusMessageElement).toBeInTheDocument();
            });

            test("For refunded orders (order's 'status' field equals 'refunded')", () => {
                renderFunc({ propsOverride: { data: { status: "refunded" } } as TOrderSummary });

                const liElement = screen.getByRole("listitem");

                const statusMessageElement = within(liElement).getByText("Order refunded");
                expect(statusMessageElement).toBeInTheDocument();
            });

            describe("And should render the expected delivery date in the format: e.g. - January 1, 1970...", () => {
                test("For pending orders (order's 'status' field equals 'pending')", () => {
                    renderFunc({ propsOverride: { data: { status: "pending" } } as TOrderSummary });

                    const liElement = screen.getByRole("listitem");

                    const expectedDeliveryDateElement = within(liElement).getByText(
                        "Expected delivery date: January 2, 1970",
                    );
                    expect(expectedDeliveryDateElement).toBeInTheDocument();
                });

                test("For orders awaiting dispatch (order's 'status' field equals 'paid')", () => {
                    renderFunc({ propsOverride: { data: { status: "paid" } } as TOrderSummary });

                    const liElement = screen.getByRole("listitem");

                    const expectedDeliveryDateElement = within(liElement).getByText(
                        "Expected delivery date: January 2, 1970",
                    );
                    expect(expectedDeliveryDateElement).toBeInTheDocument();
                });

                test("For dispatched orders (order's 'status' field equals 'shipped')", () => {
                    renderFunc({ propsOverride: { data: { status: "shipped" } } as TOrderSummary });

                    const liElement = screen.getByRole("listitem");

                    const expectedDeliveryDateElement = within(liElement).getByText(
                        "Expected delivery date: January 2, 1970",
                    );
                    expect(expectedDeliveryDateElement).toBeInTheDocument();
                });
            });
        });

        describe("That should contain a <ul> element...", () => {
            test("As expected", () => {
                renderFunc();

                const ulElement = screen.getByRole("list");
                expect(ulElement).toBeInTheDocument();
            });

            describe("That renders an OrderProduct component...", () => {
                test("For each entry in the 'data' prop's 'products' array field", () => {
                    renderFunc();

                    const ulElement = screen.getByRole("list");

                    const { products } = mockProps.data!;

                    products!.forEach((orderProduct) => {
                        const { product } = orderProduct!;
                        const { id } = product!;

                        const OrderProductComponent = within(ulElement).getByText(
                            `OrderProduct id: ${id}`,
                        );
                        expect(OrderProductComponent).toBeInTheDocument();
                    });
                });

                test("Passing the correct props", () => {
                    renderFunc();

                    const ulElement = screen.getByRole("list");

                    const { products } = mockProps.data!;

                    products!.forEach((orderProduct) => {
                        const { product } = orderProduct!;
                        const { id } = product!;

                        const OrderProductComponent = within(ulElement).getByText(
                            `OrderProduct id: ${id}`,
                        );
                        const props = getProps(OrderProductComponent);
                        expect(props).toStrictEqual({ data: orderProduct });
                    });
                });
            });
        });

        describe("That should contain an OrderDetails component...", () => {
            test("As expected", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const OrderDetailsComponent =
                    within(liElement).getByLabelText("OrderDetails component");
                expect(OrderDetailsComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { data } = mockProps;

                const OrderDetailsComponent =
                    within(liElement).getByLabelText("OrderDetails component");
                const props = getProps(OrderDetailsComponent);
                expect(props).toEqual(expect.objectContaining({ data }));
            });
        });
    });
});
