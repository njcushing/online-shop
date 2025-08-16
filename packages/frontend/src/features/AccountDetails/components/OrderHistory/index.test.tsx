import { vi } from "vitest";
import { screen, render, within, fireEvent } from "@test-utils";
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

const mockUser: RecursivePartial<IUserContext["user"]["response"]["data"]> = {
    orders: [],
};

const mockOrders: RecursivePartial<IUserContext["orders"]["response"]["data"]> = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
];

const mockUserContext: RecursivePartial<IUserContext> = {
    user: {
        response: {
            data: mockUser as IUserContext["user"]["response"]["data"],
        },
    },
    orders: {
        response: {
            data: mockOrders as IUserContext["orders"]["response"]["data"],
            status: 200,
            message: "Success",
        },
        setParams: () => {},
        attempt: () => {},
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
        test("If the UserContext's 'orders.response.data' array field contains at least one entry", () => {
            renderFunc();

            const ulElement = screen.getByRole("list");
            expect(ulElement).toBeInTheDocument();
        });

        test("Unless the UserContext's 'orders.response.data' and 'defaultData.orders' array fields are falsy or empty", async () => {
            const { rerenderFunc } = await renderFunc({
                UserContextOverride: {
                    orders: { response: { data: null }, awaiting: true },
                } as IUserContext,
            });
            rerenderFunc({
                UserContextOverride: {
                    orders: { response: { data: null }, awaiting: false },
                } as IUserContext,
            });

            const ulElement = screen.queryByRole("list");
            expect(ulElement).not.toBeInTheDocument();
        });

        describe("That should contain a <select> element for filtering orders...", () => {
            test("Wrapped in a <label> element with textContent equal to 'Display orders placed within'", () => {
                renderFunc();

                const filterSelectLabel = screen.getByText("Display orders placed within");
                expect(filterSelectLabel).toBeInTheDocument();
                expect(filterSelectLabel.tagName).toBe("LABEL");

                const filterSelect = within(filterSelectLabel).getByRole("combobox");
                expect(filterSelect).toBeInTheDocument();
            });

            test("That should, onChange, cause the 'setParams' function to be invoked with the selected filter", async () => {
                const setParamsSpy = vi.fn();
                await renderFunc({
                    UserContextOverride: {
                        orders: { setParams: setParamsSpy } as unknown as IUserContext["orders"],
                    } as IUserContext,
                });

                const filterSelectLabel = screen.getByText("Display orders placed within");
                const filterSelect = within(filterSelectLabel).getByRole("combobox");

                /**
                 * Injecting a fake <option> element into the <select> for this test only allows me
                 * to test onChange logic without updating test if the real options change in future
                 */
                const fakeOption = document.createElement("option");
                fakeOption.value = "filter_value";
                filterSelect.appendChild(fakeOption);

                setParamsSpy.mockRestore();

                await act(async () =>
                    fireEvent.change(filterSelect, { target: { value: "filter_value" } }),
                );

                expect(setParamsSpy).toHaveBeenCalledTimes(1);
                expect(setParamsSpy).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            params: expect.objectContaining({
                                filter: "filter_value",
                            }),
                        }),
                    ]),
                );
            });

            test("That should, onChange, cause the 'attempt' function to be invoked", async () => {
                const attemptSpy = vi.fn();
                await renderFunc({
                    UserContextOverride: {
                        orders: { attempt: attemptSpy } as unknown as IUserContext["orders"],
                    } as IUserContext,
                });

                const filterSelectLabel = screen.getByText("Display orders placed within");
                const filterSelect = within(filterSelectLabel).getByRole("combobox");

                /**
                 * Injecting a fake <option> element into the <select> for this test only allows me
                 * to test onChange logic without updating test if the real options change in future
                 */
                const fakeOption = document.createElement("option");
                fakeOption.value = "filter_value";
                filterSelect.appendChild(fakeOption);

                attemptSpy.mockRestore();

                await act(async () =>
                    fireEvent.change(filterSelect, { target: { value: "filter_value" } }),
                );

                expect(attemptSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("That renders an OrderSummary component...", () => {
            test("For each entry in the UserContext's 'orders.response.data' array field", async () => {
                const { rerenderFunc } = await renderFunc({
                    UserContextOverride: { orders: { awaiting: true } } as IUserContext,
                });
                rerenderFunc({
                    UserContextOverride: { orders: { awaiting: false } } as IUserContext,
                });

                const ulElement = screen.getByRole("list");

                mockOrders.forEach((order) => {
                    const { id } = order!;

                    const OrderSummaryComponent = within(ulElement).getByText(
                        `OrderSummary id: ${id}`,
                    );
                    expect(OrderSummaryComponent).toBeInTheDocument();
                });
            });

            test("For each entry in the UserContext's 'defaultData.orders' array field if the UserContext's 'orders.response.data' array field is falsy or empty", () => {
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

            test("Passing the correct props", async () => {
                const { rerenderFunc } = await renderFunc({
                    UserContextOverride: { orders: { awaiting: true } } as IUserContext,
                });
                rerenderFunc({
                    UserContextOverride: { orders: { awaiting: false } } as IUserContext,
                });

                const ulElement = screen.getByRole("list");

                mockOrders.forEach((order, i) => {
                    const { id } = order!;

                    const OrderSummaryComponent = within(ulElement).getByText(
                        `OrderSummary id: ${id}`,
                    );
                    const props = getProps(OrderSummaryComponent);
                    expect(props).toStrictEqual({
                        data: mockUserContext.orders!.response!.data![i],
                        awaiting: false,
                    });
                });
            });
        });
    });

    test("Should render a relevant message if the UserContext's 'orders.response.data' and 'defaultData.orders' array fields are falsy or empty", async () => {
        const { rerenderFunc } = await renderFunc({
            UserContextOverride: {
                orders: { response: { data: null }, awaiting: true },
            } as IUserContext,
        });
        rerenderFunc({
            UserContextOverride: {
                orders: { response: { data: null }, awaiting: false },
            } as IUserContext,
        });

        const messageElement = screen.getByText("Nothing to show!");
        expect(messageElement).toBeInTheDocument();
    });
});
