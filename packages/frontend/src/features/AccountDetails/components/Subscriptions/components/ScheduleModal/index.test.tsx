import { vi } from "vitest";
import { screen, render, within, fireEvent, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { mockFrequencies } from "../SubscriptionSummary/index.mocks";
import { ScheduleModal, TScheduleModal } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockSubscription: RecursivePartial<
    NonNullable<IUserContext["subscriptions"]["data"]>[number]
> = {
    count: 10,
    frequency: "one_week",
    nextDate: new Date("2025-01-08").toISOString(),
    product: { allowance: 10 },
    variant: { allowanceOverride: 5 },
};
const mockProps: RecursivePartial<TScheduleModal> = {
    data: mockSubscription as NonNullable<IUserContext["subscriptions"]["data"]>[number],
    opened: true,
    onClose: () => {},
    onChange: () => {},
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
    propsOverride?: TScheduleModal;
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
                <ScheduleModal {...mergedProps} />
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

vi.mock("@/components/Inputs/Quantity", () => ({
    Quantity: vi.fn((props: unknown & { onQuantityChange: (newValue: number) => unknown }) => {
        const { onQuantityChange } = props;

        return (
            <button
                type="button"
                aria-label="Quantity component"
                data-props={JSON.stringify(props)}
                onClick={() => onQuantityChange && onQuantityChange(mockProps.data!.count! + 1)}
            ></button>
        );
    }),
}));

vi.mock("@/utils/products/subscriptions", async () => {
    const actual = await vi.importActual("@/utils/products/subscriptions");
    return {
        ...actual,
        frequencies: (await import("../SubscriptionSummary/index.mocks")).mockFrequencies,
    };
});

describe("The ScheduleModal component...", () => {
    describe("Should render a 'Close' button", () => {
        test("As expected", () => {
            renderFunc();

            const closeButton = screen.getByRole("button", { name: "Close" });
            expect(closeButton).toBeInTheDocument();
        });

        test("That, on click, should invoke the callback function passed to the 'onClose' prop", async () => {
            const onCloseSpy = vi.fn();
            await renderFunc({
                propsOverride: { onClose: onCloseSpy } as unknown as TScheduleModal,
            });

            const closeButton = screen.getByRole("button", { name: "Close" });

            expect(onCloseSpy).not.toHaveBeenCalled();

            await act(async () => userEvent.click(closeButton));

            expect(onCloseSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Should render a message about the current schedule...", () => {
        test("That should contain either the word 'unit' if the 'data' prop's 'count' field is 1", () => {
            renderFunc({ propsOverride: { data: { count: 1 } } as TScheduleModal });

            const currentScheduleMessage = screen.getByText(
                "You are currently receiving 1 unit every",
                { exact: false },
            );
            expect(currentScheduleMessage).toBeInTheDocument();
        });

        test("That should contain either the word 'unit' if the 'data' prop's 'count' field is 1", () => {
            renderFunc({ propsOverride: { data: { count: 10 } } as TScheduleModal });

            const currentScheduleMessage = screen.getByText(
                "You are currently receiving 10 units every",
                { exact: false },
            );
            expect(currentScheduleMessage).toBeInTheDocument();
        });
    });

    describe("Should render a <fieldset> element...", () => {
        test("That should contain a legend element with text content equal to: 'Select a new delivery schedule:'", () => {
            renderFunc();

            const fieldsetElement = screen.getByRole("group", {
                name: "Select a new delivery schedule:",
            });
            expect(fieldsetElement).toBeInTheDocument();
        });

        describe("That should contain the Quantity component...", () => {
            test("As expected", () => {
                renderFunc();

                const fieldsetElement = screen.getByRole("group", {
                    name: "Select a new delivery schedule:",
                });

                const QuantityComponent =
                    within(fieldsetElement).getByLabelText("Quantity component");
                expect(QuantityComponent).toBeInTheDocument();
            });

            test("Passing the correct props when the variant has a valid 'allowanceOverride' value", () => {
                renderFunc();

                const fieldsetElement = screen.getByRole("group", {
                    name: "Select a new delivery schedule:",
                });

                const QuantityComponent =
                    within(fieldsetElement).getByLabelText("Quantity component");

                const props = getProps(QuantityComponent);
                expect(props).toEqual(
                    expect.objectContaining({
                        defaultValue: mockProps.data!.count,
                        min: 1,
                        max: mockProps.data!.variant!.allowanceOverride,
                        disabled: mockUserContext.subscriptions!.awaiting,
                    }),
                );
            });

            test("Passing the correct props when the variant doesn't have a valid 'allowanceOverride' value", () => {
                renderFunc({
                    propsOverride: {
                        data: { variant: { allowanceOverride: null } },
                    } as unknown as TScheduleModal,
                });

                const fieldsetElement = screen.getByRole("group", {
                    name: "Select a new delivery schedule:",
                });

                const QuantityComponent =
                    within(fieldsetElement).getByLabelText("Quantity component");

                const props = getProps(QuantityComponent);
                expect(props).toEqual(
                    expect.objectContaining({
                        defaultValue: mockProps.data!.count,
                        min: 1,
                        max: mockProps.data!.product!.allowance,
                        disabled: mockUserContext.subscriptions!.awaiting,
                    }),
                );
            });

            test("That, on change, should invoke the callback function passed to the 'onChange' prop", async () => {
                const onChangeSpy = vi.fn();
                await renderFunc({
                    propsOverride: { onChange: onChangeSpy } as unknown as TScheduleModal,
                });

                const fieldsetElement = screen.getByRole("group", {
                    name: "Select a new delivery schedule:",
                });

                const QuantityComponent =
                    within(fieldsetElement).getByLabelText("Quantity component");

                expect(onChangeSpy).not.toHaveBeenCalled();

                await act(async () => userEvent.click(QuantityComponent));

                expect(onChangeSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("That should contain a <select> element...", () => {
            test("As expected", () => {
                renderFunc();

                const fieldsetElement = screen.getByRole("group", {
                    name: "Select a new delivery schedule:",
                });

                const selectElement = within(fieldsetElement).getByRole("combobox");
                expect(selectElement).toBeInTheDocument();
            });

            describe("That should contain an <option> element for each of the preset frequencies...", () => {
                test("With text content equal to that frequency's 'optionName' field", () => {
                    renderFunc();

                    const fieldsetElement = screen.getByRole("group", {
                        name: "Select a new delivery schedule:",
                    });

                    const selectElement = within(fieldsetElement).getByRole("combobox");

                    Object.entries(mockFrequencies).forEach((entry) => {
                        const [, value] = entry;
                        const { optionName } = value;

                        const optionElement = within(selectElement).getByRole("option", {
                            name: optionName,
                        });
                        expect(optionElement).toBeInTheDocument();
                    });
                });
            });

            test("That, on change, should invoke the callback function passed to the 'onChange' prop", async () => {
                const onChangeSpy = vi.fn();
                await renderFunc({
                    propsOverride: { onChange: onChangeSpy } as unknown as TScheduleModal,
                });

                const fieldsetElement = screen.getByRole("group", {
                    name: "Select a new delivery schedule:",
                });

                const selectElement = within(fieldsetElement).getByRole("combobox");

                expect(onChangeSpy).not.toHaveBeenCalled();

                await act(async () => {
                    fireEvent.change(selectElement, { target: { value: "one_year" } });
                });

                expect(onChangeSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Should render a button for saving the user's changes", () => {
        test("With text content equal to: 'Save changes'", async () => {
            await renderFunc();

            const selectElement = screen.getByRole("combobox");

            await act(async () => {
                fireEvent.change(selectElement, { target: { value: "one_year" } });
            });

            const saveChangesButton = screen.getByRole("button", { name: "Save changes" });
            expect(saveChangesButton).toBeInTheDocument();
        });

        test("Unless none of the fields' values have been changed", () => {
            renderFunc();

            const saveChangesButton = screen.queryByRole("button", { name: "Save changes" });
            expect(saveChangesButton).not.toBeInTheDocument();
        });

        test("Unless the UserContext's 'subscriptions.awaiting' field is 'true'", async () => {
            await renderFunc({
                UserContextOverride: { subscriptions: { awaiting: true } } as IUserContext,
            });

            const selectElement = screen.getByRole("combobox");

            await act(async () => {
                fireEvent.change(selectElement, { target: { value: "one_year" } });
            });

            const saveChangesButton = screen.queryByRole("button", { name: "Save changes" });
            expect(saveChangesButton).not.toBeInTheDocument();
        });
    });
});
