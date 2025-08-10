import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { CancellationModal, TCancellationModal } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockSubscription: RecursivePartial<
    NonNullable<IUserContext["subscriptions"]["response"]["data"]>[number]
> = {
    count: 10,
    frequency: "one_week",
    nextDate: new Date("2025-01-08").toISOString(),
    product: { allowance: 10 },
    variant: { allowanceOverride: 5 },
};
const mockProps: RecursivePartial<TCancellationModal> = {
    data: mockSubscription as NonNullable<
        IUserContext["subscriptions"]["response"]["data"]
    >[number],
    opened: true,
    onClose: () => {},
};

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
    propsOverride?: TCancellationModal;
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
                <CancellationModal {...mergedProps} />
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

vi.mock(
    "@/features/AccountDetails/components/Subscriptions/components/SubscriptionProduct",
    () => ({
        SubscriptionProduct: vi.fn((props: unknown) => {
            return (
                <div
                    aria-label="SubscriptionProduct component"
                    data-props={JSON.stringify(props)}
                ></div>
            );
        }),
    }),
);

describe("The CancellationModal component...", () => {
    describe("Should render a 'Close' button", () => {
        test("As expected", () => {
            renderFunc();

            const closeButton = screen.getByRole("button", { name: "Close" });
            expect(closeButton).toBeInTheDocument();
        });

        test("That, on click, should invoke the callback function passed to the 'onClose' prop", async () => {
            const onCloseSpy = vi.fn();
            await renderFunc({
                propsOverride: { onClose: onCloseSpy } as unknown as TCancellationModal,
            });

            const closeButton = screen.getByRole("button", { name: "Close" });

            expect(onCloseSpy).not.toHaveBeenCalled();

            await act(async () => userEvent.click(closeButton));

            expect(onCloseSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Should render the SubscriptionProduct component...", () => {
        test("As expected", () => {
            renderFunc();

            const SubscriptionProductComponent = screen.getByLabelText(
                "SubscriptionProduct component",
            );
            expect(SubscriptionProductComponent).toBeInTheDocument();
        });

        test("Passing the correct props", () => {
            renderFunc();

            const { data } = mockProps;

            const SubscriptionProductComponent = screen.getByLabelText(
                "SubscriptionProduct component",
            );
            expect(SubscriptionProductComponent).toBeInTheDocument();
            const props = getProps(SubscriptionProductComponent);
            expect(props).toStrictEqual({ data });
        });
    });

    describe("Should render a message about the current schedule...", () => {
        test("That should contain either the word 'unit' if the 'data' prop's 'count' field is 1", () => {
            renderFunc({ propsOverride: { data: { count: 1 } } as TCancellationModal });

            const currentScheduleMessage = screen.getByText("Your next delivery of 1 unit", {
                exact: false,
            });
            expect(currentScheduleMessage).toBeInTheDocument();
        });

        test("That should contain either the word 'unit' if the 'data' prop's 'count' field is 1", () => {
            renderFunc({ propsOverride: { data: { count: 10 } } as TCancellationModal });

            const currentScheduleMessage = screen.getByText("Your next delivery of 10 units", {
                exact: false,
            });
            expect(currentScheduleMessage).toBeInTheDocument();
        });
    });

    describe("Should render a button for cancelling the subscription", () => {
        test("With text content equal to: 'Yes, I'm sure'", () => {
            renderFunc();

            const saveChangesButton = screen.getByRole("button", { name: "Yes, I'm sure" });
            expect(saveChangesButton).toBeInTheDocument();
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", async () => {
            await renderFunc({
                UserContextOverride: { subscriptions: { awaiting: true } } as IUserContext,
            });

            const saveChangesButton = screen.queryByRole("button", { name: "Yes, I'm sure" });
            expect(saveChangesButton).not.toBeInTheDocument();
        });
    });
});
