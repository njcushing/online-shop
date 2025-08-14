import { vi } from "vitest";
import { screen, render, waitFor } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import {
    IRootContext,
    RootContext,
    IUserContext,
    UserContext,
    IHeaderContext,
    HeaderContext,
    Root,
} from ".";

// Mock dependencies
const mockCart: RecursivePartial<IUserContext["cart"]["response"]["data"]> = [
    // Only using relevant fields
    { product: {}, variant: { id: "variant1Id" }, quantity: 1 },
    { product: {}, variant: { id: "variant2Id" }, quantity: 1 },
    { product: {}, variant: { id: "variant3Id" }, quantity: 1 },
];

const mockOrders: RecursivePartial<IUserContext["orders"]["response"]["data"]> = [
    { id: "orderId1" },
    { id: "orderId2" },
    { id: "orderId3" },
];

const mockSubscriptions: RecursivePartial<IUserContext["orders"]["response"]["data"]> = [
    { id: "subscriptionId1" },
    { id: "subscriptionId2" },
    { id: "subscriptionId3" },
];

const mockUser: RecursivePartial<IUserContext["user"]["response"]["data"]> = {
    profile: { personal: { firstName: "First", lastName: "Last" } },
};

const mockRootContext: RecursivePartial<IRootContext> = {
    headerInfo: { active: false, open: true, height: 0, forceClose: () => {} },
};

const mockUserContext: RecursivePartial<IUserContext> = {
    user: { response: { data: null, status: 200, message: "Success" }, awaiting: false },
    cart: { response: { data: null, status: 200, message: "Success" }, awaiting: false },
    orders: { response: { data: null, status: 200, message: "Success" }, awaiting: false },
    subscriptions: { response: { data: null, status: 200, message: "Success" }, awaiting: false },

    defaultData: {
        user: {},
        cart: [],
        orders: [],
        subscriptions: [],
    },
};

const mockHeaderContext: RecursivePartial<IHeaderContext> = {
    setHeaderInfo: () => {},
};

type renderFuncArgs = {
    RootContextOverride?: IRootContext;
    UserContextOverride?: IUserContext;
    HeaderContextOverride?: IHeaderContext;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const {
        RootContextOverride,
        UserContextOverride,
        HeaderContextOverride,
        initRender = false,
    } = args;

    let RootContextValue!: IRootContext;
    let UserContextValue!: IUserContext;
    let HeaderContextValue!: IHeaderContext;

    const mergedProductContext = _.merge(_.cloneDeep(mockRootContext), RootContextOverride);
    const mergedUserContext = _.merge(_.cloneDeep(mockUserContext), UserContextOverride);
    const mergedHeaderContext = _.merge(_.cloneDeep(mockHeaderContext), HeaderContextOverride);

    const component = (
        // Using BrowserRouter for routing within Root component
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <RootContext.Provider value={mergedProductContext}>
                <UserContext.Provider value={mergedUserContext}>
                    <HeaderContext.Provider value={mergedHeaderContext}>
                        <Root>
                            <RootContext.Consumer>
                                {(value) => {
                                    RootContextValue = value;
                                    return null;
                                }}
                            </RootContext.Consumer>
                            <UserContext.Consumer>
                                {(value) => {
                                    UserContextValue = value;
                                    return null;
                                }}
                            </UserContext.Consumer>
                            <HeaderContext.Consumer>
                                {(value) => {
                                    HeaderContextValue = value;
                                    return null;
                                }}
                            </HeaderContext.Consumer>
                        </Root>
                    </HeaderContext.Provider>
                </UserContext.Provider>
            </RootContext.Provider>
        </BrowserRouter>
    );

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender ? render(component) : await act(() => render(component));

    return {
        rerender,
        getRootContextValue: () => RootContextValue,
        getUserContextValue: () => UserContextValue,
        getHeaderContextValue: () => HeaderContextValue,
        component,
    };
};

export const mockMockGetUser = vi.fn(async () => ({
    status: 200,
    message: "Success",
    data: mockUser,
}));
export const mockMockGetCart = vi.fn(async () => ({
    status: 200,
    message: "Success",
    data: mockCart,
}));
export const mockMockGetOrders = vi.fn(async () => ({
    status: 200,
    message: "Success",
    data: mockOrders,
}));
export const mockMockGetSubscriptions = vi.fn(async () => ({
    status: 200,
    message: "Success",
    data: mockSubscriptions,
}));
vi.mock("@/api/mocks", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        mockGetUser: () => mockMockGetUser(),
        mockGetCart: () => mockMockGetCart(),
        mockGetOrders: () => mockMockGetOrders(),
        mockGetSubscriptions: () => mockMockGetSubscriptions(),
    };
});

vi.mock("@/features/Header", () => ({
    Header: () => <div aria-label="Header component"></div>,
}));

vi.mock("@/features/Footer", () => ({
    Footer: () => <div aria-label="Footer component"></div>,
}));

describe("The Root component...", () => {
    describe("Should provide 'RootContext' context to all its descendant components...", () => {
        test("Which should be defined", async () => {
            const { getRootContextValue } = await renderFunc();
            const RootContextValue = getRootContextValue();
            expect(RootContextValue).toBeDefined();
        });

        test("Including the 'headerInfo' field", async () => {
            const { getRootContextValue } = await renderFunc();
            const RootContextValue = getRootContextValue();

            const { headerInfo } = RootContextValue;
            expect(headerInfo).toBeDefined();
        });

        describe("Which, when consumed by a component other than the Root component...", () => {
            test("Should match the shape of the expected context, but have fields containing default values", async () => {
                let RootContextValue!: IRootContext;

                render(
                    <div>
                        <RootContext.Consumer>
                            {(value) => {
                                RootContextValue = value;
                                return null;
                            }}
                        </RootContext.Consumer>
                    </div>,
                );

                expect(RootContextValue).toBeDefined();

                const { headerInfo } = RootContextValue;

                expect(headerInfo).toBeDefined();
                expect(() => headerInfo.forceClose(true, "")).not.toThrow();
            });
        });
    });

    describe("Should provide 'UserContext' context to all its descendant components...", () => {
        test("Which should be defined", async () => {
            const { getUserContextValue } = await renderFunc();
            const UserContextValue = getUserContextValue();
            expect(UserContextValue).toBeDefined();
        });

        describe("Including the 'user.response' field...", () => {
            test("Which should initially have its 'data' field set to 'null'", async () => {
                const { getUserContextValue } = await renderFunc({ initRender: true });
                const UserContextValue = getUserContextValue();

                const { user } = UserContextValue;
                expect(user).toBeDefined();

                const { response } = user;
                expect(response).toBeDefined();

                await waitFor(async () => {
                    expect(response).toEqual(expect.objectContaining({ data: null }));
                });
            });

            test("Which should be populated by the 'response' field in the return value of the 'useAsync' hook for the 'mockGetUser' function", async () => {
                const { getUserContextValue } = await renderFunc();
                const UserContextValue = getUserContextValue();

                const { user } = UserContextValue;
                const { response } = user;

                expect(response).toEqual(expect.objectContaining(await mockMockGetUser()));
            });
        });

        describe("Including the 'cart.response' field...", () => {
            test("Which should initially have its 'data' field set to 'null'", async () => {
                const { getUserContextValue } = await renderFunc({ initRender: true });
                const UserContextValue = getUserContextValue();

                const { cart } = UserContextValue;
                expect(cart).toBeDefined();

                const { response } = cart;
                expect(response).toBeDefined();

                await waitFor(async () => {
                    expect(response).toEqual(expect.objectContaining({ data: null }));
                });
            });

            test("Which should be populated by the 'response' field in the return value of the 'useAsync' hook for the 'mockGetCart' function", async () => {
                const { getUserContextValue } = await renderFunc();
                const UserContextValue = getUserContextValue();

                const { cart } = UserContextValue;
                const { response } = cart;

                expect(response).toEqual(expect.objectContaining(await mockMockGetCart()));
            });
        });

        describe("Including the 'orders.response' field...", () => {
            test("Which should initially have its 'data' field set to 'null'", async () => {
                const { getUserContextValue } = await renderFunc({ initRender: true });
                const UserContextValue = getUserContextValue();

                const { orders } = UserContextValue;
                expect(orders).toBeDefined();

                const { response } = orders;
                expect(response).toBeDefined();

                await waitFor(async () => {
                    expect(response).toEqual(expect.objectContaining({ data: null }));
                });
            });

            test("Which should be populated by the 'response' field in the return value of the 'useAsync' hook for the 'mockGetOrders' function", async () => {
                const { getUserContextValue } = await renderFunc();
                const UserContextValue = getUserContextValue();

                const { orders } = UserContextValue;
                const { response } = orders;

                expect(response).toEqual(expect.objectContaining(await mockMockGetOrders()));
            });
        });

        describe("Including the 'subscriptions.response' field...", () => {
            test("Which should initially have its 'data' field set to 'null'", async () => {
                const { getUserContextValue } = await renderFunc({ initRender: true });
                const UserContextValue = getUserContextValue();

                const { subscriptions } = UserContextValue;
                expect(subscriptions).toBeDefined();

                const { response } = subscriptions;
                expect(response).toBeDefined();

                await waitFor(async () => {
                    expect(response).toEqual(expect.objectContaining({ data: null }));
                });
            });

            test("Which should be populated by the 'response' field in the return value of the 'useAsync' hook for the 'mockGetSubscriptions' function", async () => {
                const { getUserContextValue } = await renderFunc();
                const UserContextValue = getUserContextValue();

                const { subscriptions } = UserContextValue;
                const { response } = subscriptions;

                expect(response).toEqual(expect.objectContaining(await mockMockGetSubscriptions()));
            });
        });

        describe("Which, when consumed by a component other than the Root component...", () => {
            test("Should match the shape of the expected context, but have fields containing default values", async () => {
                let UserContextValue!: IUserContext;

                render(
                    <div>
                        <UserContext.Consumer>
                            {(value) => {
                                UserContextValue = value;
                                return null;
                            }}
                        </UserContext.Consumer>
                    </div>,
                );

                expect(UserContextValue).toBeDefined();

                const { user, cart, orders, subscriptions } = UserContextValue;

                expect(user).toBeDefined();
                expect(cart).toBeDefined();
                expect(orders).toBeDefined();
                expect(subscriptions).toBeDefined();
            });
        });
    });

    describe("Should provide 'HeaderContext' context to the Header component...", () => {
        test("Which should be defined", async () => {
            const { getHeaderContextValue } = await renderFunc();
            const HeaderContextValue = getHeaderContextValue();
            expect(HeaderContextValue).toBeDefined();
        });

        test("Including a setter function for updating the 'headerInfo' field in the RootContext", async () => {
            const { getRootContextValue, getHeaderContextValue } = await renderFunc();
            const HeaderContextValue = getHeaderContextValue();

            const { setHeaderInfo } = HeaderContextValue;
            expect(setHeaderInfo).toBeDefined();

            const mockHeaderInfo = {
                active: true,
                open: false,
                height: 9999,
                forceClose: () => {},
            };

            expect(getRootContextValue().headerInfo).toEqual(
                expect.objectContaining({
                    active: mockRootContext.headerInfo?.active,
                    open: mockRootContext.headerInfo?.open,
                    height: mockRootContext.headerInfo?.height,
                }),
            );

            await act(async () => setHeaderInfo(mockHeaderInfo));

            expect(getRootContextValue().headerInfo).toEqual(
                expect.objectContaining({
                    active: mockHeaderInfo.active,
                    open: mockHeaderInfo.open,
                    height: mockHeaderInfo.height,
                }),
            );
        });

        describe("Which, when consumed by a component other than the Root component...", () => {
            test("Should match the shape of the expected context, but have fields containing default values", async () => {
                let HeaderContextValue!: IHeaderContext;

                render(
                    <div>
                        <HeaderContext.Consumer>
                            {(value) => {
                                HeaderContextValue = value;
                                return null;
                            }}
                        </HeaderContext.Consumer>
                    </div>,
                );

                expect(HeaderContextValue).toBeDefined();

                const { setHeaderInfo } = HeaderContextValue;

                expect(() =>
                    setHeaderInfo(mockRootContext.headerInfo as IRootContext["headerInfo"]),
                ).not.toThrow();
            });
        });
    });

    test("Should render the Header component", async () => {
        await renderFunc();

        const HeaderComponent = screen.getByLabelText("Header component");
        expect(HeaderComponent).toBeInTheDocument();
    });

    test("Should render the Footer component", async () => {
        await renderFunc();

        const FooterComponent = screen.getByLabelText("Footer component");
        expect(FooterComponent).toBeInTheDocument();
    });
});
