import { vi } from "vitest";
import { screen, render, within, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { mockFrequencies } from "./index.mocks";
import { SubscriptionSummary, TSubscriptionSummary } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

const mockSubscription: RecursivePartial<
    NonNullable<IUserContext["subscriptions"]["response"]["data"]>[number]
> = {
    count: 10,
    frequency: "one_week",
    nextDate: new Date("2025-01-08").toISOString(),
    product: { id: "productId" }, // Required for mocked SubscriptionProduct component
};
const mockProps: RecursivePartial<TSubscriptionSummary> = {
    data: mockSubscription as NonNullable<
        IUserContext["subscriptions"]["response"]["data"]
    >[number],
    awaiting: false,
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
    propsOverride?: TSubscriptionSummary;
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
                <SubscriptionSummary {...mergedProps} />
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
        SubscriptionProduct: vi.fn((props: unknown & { data: { product: { id: string } } }) => {
            const { data } = props;
            const { product } = data;
            const { id } = product;

            return (
                <div
                    aria-label="SubscriptionProduct component"
                    data-props={JSON.stringify(props)}
                >{`SubscriptionProduct id: ${id}`}</div>
            );
        }),
    }),
);

vi.mock(
    "@/features/AccountDetails/components/Subscriptions/components/SubscriptionDetails",
    () => ({
        SubscriptionDetails: vi.fn((props: unknown) => {
            return (
                <div
                    aria-label="SubscriptionDetails component"
                    data-props={JSON.stringify(props)}
                ></div>
            );
        }),
    }),
);

vi.mock("@/features/AccountDetails/components/Subscriptions/components/ScheduleModal", () => ({
    ScheduleModal: vi.fn((props: unknown & { onClose: () => unknown }) => {
        const { onClose } = props;

        return (
            <button
                type="button"
                aria-label="ScheduleModal component"
                onClick={() => onClose && onClose()}
                data-props={JSON.stringify(props)}
            ></button>
        );
    }),
}));

vi.mock("@/features/AccountDetails/components/Subscriptions/components/CancellationModal", () => ({
    CancellationModal: vi.fn((props: unknown & { onClose: () => unknown }) => {
        const { onClose } = props;

        return (
            <button
                type="button"
                aria-label="CancellationModal component"
                onClick={() => onClose && onClose()}
                data-props={JSON.stringify(props)}
            ></button>
        );
    }),
}));

vi.mock("@/utils/products/subscriptions", async () => {
    const actual = await vi.importActual("@/utils/products/subscriptions");
    return {
        ...actual,
        frequencies: (await import("./index.mocks")).mockFrequencies,
    };
});

describe("The SubscriptionSummary component...", () => {
    describe("Should render a <li> element...", () => {
        test("As expected", () => {
            renderFunc();

            const liElement = screen.getByRole("listitem");
            expect(liElement).toBeInTheDocument();
        });

        describe("That should contain a subscription frequency message with the unit count and appropriate text content...", () => {
            test("For subscriptions on a one week delivery schedule", () => {
                renderFunc({
                    propsOverride: { data: { frequency: "one_week" } } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                const frequencyMessageElement = within(liElement).getByText(
                    `${count} units every ${mockFrequencies["one_week"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("For subscriptions on a two week delivery schedule", () => {
                renderFunc({
                    propsOverride: { data: { frequency: "two_weeks" } } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                const frequencyMessageElement = within(liElement).getByText(
                    `${count} units every ${mockFrequencies["two_weeks"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("For subscriptions on a one month delivery schedule", () => {
                renderFunc({
                    propsOverride: { data: { frequency: "one_month" } } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                const frequencyMessageElement = within(liElement).getByText(
                    `${count} units every ${mockFrequencies["one_month"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("For subscriptions on a three month delivery schedule", () => {
                renderFunc({
                    propsOverride: { data: { frequency: "three_months" } } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                const frequencyMessageElement = within(liElement).getByText(
                    `${count} units every ${mockFrequencies["three_months"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("For subscriptions on a six month delivery schedule", () => {
                renderFunc({
                    propsOverride: { data: { frequency: "six_months" } } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                const frequencyMessageElement = within(liElement).getByText(
                    `${count} units every ${mockFrequencies["six_months"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("For subscriptions on a one year delivery schedule", () => {
                renderFunc({
                    propsOverride: { data: { frequency: "one_year" } } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                const frequencyMessageElement = within(liElement).getByText(
                    `${count} units every ${mockFrequencies["one_year"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("Or text content equal to the value of the 'data' prop's 'frequency' field if it doesn't match a preset", () => {
                renderFunc({
                    // @ts-expect-error - Disabling type checking for function parameters in unit test
                    propsOverride: {
                        data: { frequency: "one_hundred_years" },
                    } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const frequencyMessageElement = within(liElement).getByText(
                    `${mockProps.data!.count} units every one_hundred_years`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("With correct text content if the unit count is equal to 1", () => {
                renderFunc({
                    propsOverride: {
                        data: { count: 1, frequency: "one_week" },
                    } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const frequencyMessageElement = within(liElement).getByText(
                    `1 unit every ${mockFrequencies["one_week"].text}`,
                );
                expect(frequencyMessageElement).toBeInTheDocument();
            });

            test("Unless the 'awaiting' prop is 'true'", () => {
                renderFunc({
                    propsOverride: {
                        data: { frequency: "one_week" },
                        awaiting: true,
                    } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const { count } = mockProps.data!;

                // queryByText *does not* exclude hidden elements - must manually check visibility
                const frequencyMessageElement = within(liElement).queryByText(
                    `${count} units every ${mockFrequencies["one_week"].text}`,
                );
                expect(frequencyMessageElement).not.toBeVisible();
            });
        });

        describe("That should contain the next delivery date...", () => {
            test("In the format: e.g. - January 1, 1970...", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const nextDeliveryDateElement = within(liElement).getByText("January 8, 2025");
                expect(nextDeliveryDateElement).toBeInTheDocument();
            });

            test("Unless the 'awaiting' prop is 'true'", () => {
                renderFunc({
                    propsOverride: { awaiting: true } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                // queryByText *does not* exclude hidden elements - must manually check visibility
                const nextDeliveryDateElement = within(liElement).queryByText("January 8, 2025");
                expect(nextDeliveryDateElement).not.toBeVisible();
            });
        });

        describe("That should contain a SubscriptionProduct component..", () => {
            test("As expected", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { product } = mockProps.data!;
                const { id } = product!;

                const SubscriptionProductComponent = within(liElement).getByText(
                    `SubscriptionProduct id: ${id}`,
                );
                expect(SubscriptionProductComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { data } = mockProps;
                const { product } = data!;
                const { id } = product!;

                const SubscriptionProductComponent = within(liElement).getByText(
                    `SubscriptionProduct id: ${id}`,
                );
                const props = getProps(SubscriptionProductComponent);
                expect(props).toStrictEqual({ data, awaiting: mockProps.awaiting });
            });
        });

        describe("That should contain a button for changing the delivery schedule", () => {
            test("With text content equal to: 'Change delivery schedule'", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const changeDeliveryScheduleButton = within(liElement).getByRole("button", {
                    name: "Change delivery schedule",
                });
                expect(changeDeliveryScheduleButton).toBeInTheDocument();
            });

            test("That, when clicked, should set the ScheduleModal's 'opened' prop to 'true'", async () => {
                await renderFunc();

                const liElement = screen.getByRole("listitem");

                const changeDeliveryScheduleButton = within(liElement).getByRole("button", {
                    name: "Change delivery schedule",
                });

                const ScheduleModalComponent =
                    within(liElement).getByLabelText("ScheduleModal component");
                expect(getProps(ScheduleModalComponent).opened).toBe(false);

                await act(async () => userEvent.click(changeDeliveryScheduleButton));

                expect(getProps(ScheduleModalComponent).opened).toBe(true);
            });

            test("Unless the 'awaiting' prop is 'true'", () => {
                renderFunc({
                    propsOverride: { awaiting: true } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const changeDeliveryScheduleButton = within(liElement).queryByRole("button", {
                    name: "Change delivery schedule",
                });
                expect(changeDeliveryScheduleButton).not.toBeInTheDocument();
            });
        });

        describe("That should contain a button for cancelling the subscription", () => {
            test("With text content equal to: 'Cancel subscription'", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const cancelSubscriptionButton = within(liElement).getByRole("button", {
                    name: "Cancel subscription",
                });
                expect(cancelSubscriptionButton).toBeInTheDocument();
            });

            test("That, when clicked, should set the CancellationModal's 'opened' prop to 'true'", async () => {
                await renderFunc();

                const liElement = screen.getByRole("listitem");

                const cancelSubscriptionButton = within(liElement).getByRole("button", {
                    name: "Cancel subscription",
                });

                const CancellationModalComponent = within(liElement).getByLabelText(
                    "CancellationModal component",
                );
                expect(getProps(CancellationModalComponent).opened).toBe(false);

                await act(async () => userEvent.click(cancelSubscriptionButton));

                expect(getProps(CancellationModalComponent).opened).toBe(true);
            });

            test("Unless the 'awaiting' prop is 'true'", () => {
                renderFunc({
                    propsOverride: { awaiting: true } as TSubscriptionSummary,
                });

                const liElement = screen.getByRole("listitem");

                const cancelSubscriptionButton = within(liElement).queryByRole("button", {
                    name: "Cancel subscription",
                });
                expect(cancelSubscriptionButton).not.toBeInTheDocument();
            });
        });

        describe("That should contain a SubscriptionDetails component...", () => {
            test("As expected", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const SubscriptionDetailsComponent = within(liElement).getByLabelText(
                    "SubscriptionDetails component",
                );
                expect(SubscriptionDetailsComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { data } = mockProps;

                const SubscriptionDetailsComponent = within(liElement).getByLabelText(
                    "SubscriptionDetails component",
                );
                const props = getProps(SubscriptionDetailsComponent);
                expect(props).toEqual(expect.objectContaining({ data }));
            });
        });

        describe("That should contain a ScheduleModal component...", () => {
            test("As expected", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const ScheduleModalComponent =
                    within(liElement).getByLabelText("ScheduleModal component");
                expect(ScheduleModalComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { data } = mockProps;

                const ScheduleModalComponent =
                    within(liElement).getByLabelText("ScheduleModal component");
                const props = getProps(ScheduleModalComponent);
                expect(props).toEqual(expect.objectContaining({ data }));
            });

            test("That should have a callback function passed to its 'onClose' prop that, when called, sets the ScheduleModal's 'opened' prop to 'false'", async () => {
                await renderFunc();

                const liElement = screen.getByRole("listitem");

                const changeDeliveryScheduleButton = within(liElement).getByRole("button", {
                    name: "Change delivery schedule",
                });

                const ScheduleModalComponent =
                    within(liElement).getByLabelText("ScheduleModal component");
                expect(getProps(ScheduleModalComponent).opened).toBe(false);

                await act(async () => userEvent.click(changeDeliveryScheduleButton));

                expect(getProps(ScheduleModalComponent).opened).toBe(true);

                await act(async () => userEvent.click(ScheduleModalComponent));

                expect(getProps(ScheduleModalComponent).opened).toBe(false);
            });
        });

        describe("That should contain a CancellationModal component...", () => {
            test("As expected", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const CancellationModalComponent = within(liElement).getByLabelText(
                    "CancellationModal component",
                );
                expect(CancellationModalComponent).toBeInTheDocument();
            });

            test("Passing the correct props", () => {
                renderFunc();

                const liElement = screen.getByRole("listitem");

                const { data } = mockProps;

                const CancellationModalComponent = within(liElement).getByLabelText(
                    "CancellationModal component",
                );
                const props = getProps(CancellationModalComponent);
                expect(props).toEqual(expect.objectContaining({ data }));
            });

            test("That should have a callback function passed to its 'onClose' prop that, when called, sets the ScheduleModal's 'opened' prop to 'false'", async () => {
                await renderFunc();

                const liElement = screen.getByRole("listitem");

                const cancelSubscriptionButton = within(liElement).getByRole("button", {
                    name: "Cancel subscription",
                });

                const CancellationModalComponent = within(liElement).getByLabelText(
                    "CancellationModal component",
                );
                expect(getProps(CancellationModalComponent).opened).toBe(false);

                await act(async () => userEvent.click(cancelSubscriptionButton));

                expect(getProps(CancellationModalComponent).opened).toBe(true);

                await act(async () => userEvent.click(CancellationModalComponent));

                expect(getProps(CancellationModalComponent).opened).toBe(false);
            });
        });
    });
});
