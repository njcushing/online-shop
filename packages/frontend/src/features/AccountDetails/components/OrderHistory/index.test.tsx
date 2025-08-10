import { vi } from "vitest";
import { screen, render, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { OrderHistory } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies

// Mock contexts are only using fields relevant to component being tested
const mockOrders: RecursivePartial<IUserContext["orders"]["response"]["data"]> = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
];

const mockUserContext: RecursivePartial<IUserContext> = {
    orders: {
        response: {
            data: mockOrders as IUserContext["orders"]["response"]["data"],
            status: 200,
            message: "Success",
        },
        awaiting: false,
    },

    defaultData: { orders: [] },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { UserContextOverride, initRender = false } = args;

    let UserContextValue!: IUserContext;

    function Component({
        context,
    }: {
        context?: { User?: renderFuncArgs["UserContextOverride"] };
    }) {
        const mergedUserContext = _.merge(_.cloneDeep(mockUserContext), context?.User);

        return (
            <UserContext.Provider value={mergedUserContext}>
                <UserContext.Consumer>
                    {(value) => {
                        UserContextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
                <OrderHistory />
            </UserContext.Provider>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<Component context={{ User: UserContextOverride }} />)
        : await act(() => render(<Component context={{ User: UserContextOverride }} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<Component context={{ User: newArgs.UserContextOverride }} />);
        },
        getUserContextValue: () => UserContextValue,
        component: <Component context={{ User: UserContextOverride }} />,
    };
};

vi.mock("@/features/AccountDetails/components/OrderHistory/components/OrderSummary", () => ({
    OrderSummary: vi.fn((props: unknown & { data: { id: string } }) => {
        const { data } = props;
        const { id } = data;

        return (
            <div
                aria-label="OrderSummary component"
                data-props={JSON.stringify(props)}
            >{`OrderSummary id: ${id}`}</div>
        );
    }),
}));

describe("The OrderHistory component...", () => {
    describe("Should render a <ul> element...", () => {
        test("If the UserContext's 'orders.data' array field contains at least one entry", () => {
            renderFunc();

            const ulElement = screen.getByRole("list");
            expect(ulElement).toBeInTheDocument();
        });

        test("Unless the UserContext's 'orders.data' and 'defaultData.orders' array fields are falsy or empty", () => {
            renderFunc({
                UserContextOverride: { orders: { response: { data: null } } } as IUserContext,
            });

            const ulElement = screen.queryByRole("list");
            expect(ulElement).not.toBeInTheDocument();
        });

        describe("That renders an OrderSummary component...", () => {
            test("For each entry in the UserContext's 'orders.data' array field", () => {
                renderFunc();

                const ulElement = screen.getByRole("list");

                mockOrders.forEach((order) => {
                    const { id } = order!;

                    const OrderSummaryComponent = within(ulElement).getByText(
                        `OrderSummary id: ${id}`,
                    );
                    expect(OrderSummaryComponent).toBeInTheDocument();
                });
            });

            test("For each entry in the UserContext's 'defaultData.orders' array field if the UserContext's 'orders.data' array field is falsy or empty", () => {
                renderFunc({
                    UserContextOverride: {
                        orders: { response: { data: null } },
                        defaultData: { orders: [{ id: "4" }] },
                    } as IUserContext,
                });

                const ulElement = screen.getByRole("list");

                const OrderSummaryComponent = within(ulElement).getByText("OrderSummary id: 4");
                expect(OrderSummaryComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const ulElement = screen.getByRole("list");

                mockOrders.forEach((order, i) => {
                    const { id } = order!;

                    const OrderSummaryComponent = within(ulElement).getByText(
                        `OrderSummary id: ${id}`,
                    );
                    const props = getProps(OrderSummaryComponent);
                    expect(props).toStrictEqual({
                        data: mockUserContext.orders!.response!.data![i],
                    });
                });
            });
        });
    });

    test("Should render a relevant message if the UserContext's 'orders.data' and 'defaultData.orders' array fields are falsy or empty", () => {
        renderFunc({
            UserContextOverride: { orders: { response: { data: null } } } as IUserContext,
        });

        const messageElement = screen.getByText("Nothing to show!");
        expect(messageElement).toBeInTheDocument();
    });
});
