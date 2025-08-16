import { vi } from "vitest";
import { screen, render, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { Subscriptions } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
// Mock contexts are only using fields relevant to component being tested

const mockUser: RecursivePartial<IUserContext["user"]["response"]["data"]> = {
    subscriptions: [],
};

const mockSubscriptions: RecursivePartial<IUserContext["subscriptions"]["response"]["data"]> = [
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
    subscriptions: {
        response: {
            data: mockSubscriptions as IUserContext["subscriptions"]["response"]["data"],
            status: 200,
            message: "Success",
        },
        setParams: () => {},
        attempt: () => {},
        awaiting: false,
    },

    defaultData: { subscriptions: [] },
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
                <Subscriptions />
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

vi.mock(
    "@/features/AccountDetails/components/Subscriptions/components/SubscriptionSummary",
    () => ({
        SubscriptionSummary: vi.fn((props: unknown & { data: { id: string } }) => {
            const { data } = props;
            const { id } = data;

            return (
                <div
                    aria-label="SubscriptionSummary component"
                    data-props={JSON.stringify(props)}
                >{`SubscriptionSummary id: ${id}`}</div>
            );
        }),
    }),
);

describe("The Subscriptions component...", () => {
    describe("Should render a <ul> element...", () => {
        test("If the UserContext's 'subscriptions.response.data' array field contains at least one entry", () => {
            renderFunc();

            const ulElement = screen.getByRole("list");
            expect(ulElement).toBeInTheDocument();
        });

        test("Unless the UserContext's 'subscriptions.response.data' and 'defaultData.subscriptions' array fields are falsy or empty", async () => {
            const { rerenderFunc } = await renderFunc({
                UserContextOverride: {
                    subscriptions: { response: { data: null }, awaiting: true },
                } as IUserContext,
            });
            rerenderFunc({
                UserContextOverride: {
                    subscriptions: { response: { data: null }, awaiting: false },
                } as IUserContext,
            });

            const ulElement = screen.queryByRole("list");
            expect(ulElement).not.toBeInTheDocument();
        });

        describe("That renders an SubscriptionSummary component...", () => {
            test("For each entry in the UserContext's 'subscriptions.response.data' array field", async () => {
                const { rerenderFunc } = await renderFunc({
                    UserContextOverride: { subscriptions: { awaiting: true } } as IUserContext,
                });
                rerenderFunc({
                    UserContextOverride: { subscriptions: { awaiting: false } } as IUserContext,
                });

                const ulElement = screen.getByRole("list");

                mockSubscriptions.forEach((subscription) => {
                    const { id } = subscription!;

                    const SubscriptionSummaryComponent = within(ulElement).getByText(
                        `SubscriptionSummary id: ${id}`,
                    );
                    expect(SubscriptionSummaryComponent).toBeInTheDocument();
                });
            });

            test("For each entry in the UserContext's 'defaultData.subscriptions' array field if the UserContext's 'subscriptions.response.data' array field is falsy or empty", () => {
                renderFunc({
                    UserContextOverride: {
                        subscriptions: { response: { data: null } },
                        defaultData: { subscriptions: [{ id: "4" }] },
                    } as IUserContext,
                });

                const ulElement = screen.getByRole("list");

                const SubscriptionSummaryComponent = within(ulElement).getByText(
                    "SubscriptionSummary id: 4",
                );
                expect(SubscriptionSummaryComponent).toBeInTheDocument();
            });

            test("Passing the correct props", async () => {
                const { rerenderFunc } = await renderFunc({
                    UserContextOverride: { subscriptions: { awaiting: true } } as IUserContext,
                });
                rerenderFunc({
                    UserContextOverride: { subscriptions: { awaiting: false } } as IUserContext,
                });

                const ulElement = screen.getByRole("list");

                mockSubscriptions.forEach((subscription, i) => {
                    const { id } = subscription!;

                    const SubscriptionSummaryComponent = within(ulElement).getByText(
                        `SubscriptionSummary id: ${id}`,
                    );
                    const props = getProps(SubscriptionSummaryComponent);
                    expect(props).toStrictEqual({
                        data: mockUserContext.subscriptions!.response!.data![i],
                        awaiting: false,
                    });
                });
            });
        });
    });

    test("Should render a relevant message if the UserContext's 'subscriptions.response.data' and 'defaultData.subscriptions' array fields are falsy or empty", async () => {
        const { rerenderFunc } = await renderFunc({
            UserContextOverride: {
                subscriptions: { response: { data: null }, awaiting: true },
            } as IUserContext,
        });
        rerenderFunc({
            UserContextOverride: {
                subscriptions: { response: { data: null }, awaiting: false },
            } as IUserContext,
        });

        const messageElement = screen.getByText("Nothing to show!");
        expect(messageElement).toBeInTheDocument();
    });
});
