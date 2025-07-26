import { vi } from "vitest";
import { screen, render, within, userEvent, fireEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { FormBuilder, TFormBuilder } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

type MockFormData = {
    details: {
        name: string;
        age: number;
        password: string;
    };
};
const defaultValues = {
    details: {
        name: "defaultName",
        age: 30,
        password: "defaultPassword",
    },
};
const mockProps: RecursivePartial<TFormBuilder<MockFormData>> = {
    fieldsets: [
        {
            legend: "Details",
            fields: [
                {
                    type: "text",
                    name: "details.name",
                    label: "Name",
                    mode: "onTouched",
                },
                {
                    type: "numeric",
                    name: "details.age",
                    label: "Age",
                    mode: "onTouched",
                },
                {
                    type: "password",
                    name: "details.password",
                    label: "Password",
                    mode: "onTouched",
                },
            ],
            fullElement: <div aria-label="full-element"></div>,
        },
    ],
    ariaLabel: "User Details",
    defaultValues,
    resolver: undefined,
    onSubmit: undefined,
    submitButtonText: undefined,
    disabled: false,
    additionalErrorPaths: [],
};

type renderFuncArgs = {
    propsOverride?: TFormBuilder<MockFormData>;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <FormBuilder {...mergedProps} />;
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<Component props={propsOverride} />)
        : await act(() => render(<Component props={propsOverride} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<Component props={newArgs.propsOverride} />);
        },
        component: <Component props={propsOverride} />,
    };
};

describe("The FormBuilder component...", () => {
    describe("Should render a <form> element...", () => {
        test("With an aria-label attribute equal to the value of the 'ariaLabel' prop", () => {
            renderFunc();

            const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });
            expect(formElement).toBeInTheDocument();
        });

        describe("That should contain an edit/cancel button...", () => {
            test("With text content equal to: 'Edit', initially, meaning the form is not 'open'", () => {
                renderFunc();

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                const editCancelButton = within(formElement).getByRole("button", { name: "Edit" });
                expect(editCancelButton).toBeInTheDocument();
            });

            test("That, when clicked, should toggle the 'open' state of the form and therefore the button's text content between 'Edit' and 'Cancel'", async () => {
                await renderFunc();

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                const editCancelButton = within(formElement).getByRole("button", { name: "Edit" });
                expect(editCancelButton).toBeInTheDocument();

                await act(async () => userEvent.click(editCancelButton));

                expect(editCancelButton.textContent).toBe("Cancel");

                await act(async () => userEvent.click(editCancelButton));

                expect(editCancelButton.textContent).toBe("Edit");
            });
        });

        describe("That should contain a fieldset for each entry in the 'fieldsets' array prop...", () => {
            test("With a <legend> element with text content equal to that fieldset's 'legend' field", () => {
                renderFunc();

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                const { fieldsets } = mockProps!;
                const { legend } = fieldsets![0]!;

                const fieldsetElement = within(formElement).getByRole("group", { name: legend });
                expect(fieldsetElement).toBeInTheDocument();
            });

            describe("That should, if the form is 'open'...", () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: {},
                }));
                const onSubmitSpy = vi.fn();
                let fieldsetElement;

                beforeEach(async () => {
                    await renderFunc({
                        propsOverride: {
                            resolver: resolverSpy,
                            onSubmit: onSubmitSpy,
                            additionalErrorPaths: ["form.root"],
                        } as unknown as TFormBuilder<MockFormData>,
                    });

                    const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const editCancelButton = within(formElement).getByRole("button", {
                        name: "Edit",
                    });
                    await act(async () => userEvent.click(editCancelButton));

                    const { fieldsets } = mockProps!;
                    const { legend } = fieldsets![0]!;

                    fieldsetElement = within(formElement).getByRole("group", {
                        name: legend,
                    });
                });

                afterEach(() => {
                    resolverSpy.mockRestore();
                    onSubmitSpy.mockRestore();
                });

                describe("Contain a form input for each entry in that fieldset's 'fields' array...", async () => {
                    describe("Including text inputs...", async () => {
                        test("That should have the correct default value from the 'defaultValues' prop", async () => {
                            const { name } = defaultValues.details;

                            const nameInput = within(fieldsetElement!).getByRole("textbox", {
                                name: "Name",
                            }) as HTMLInputElement;
                            expect(nameInput).toBeInTheDocument();
                            expect(nameInput.value).toBe(name);
                        });
                    });

                    describe("Including number inputs", async () => {
                        test("That should have the correct default value from the 'defaultValues' prop", async () => {
                            const { age } = defaultValues.details;

                            const ageInput = within(fieldsetElement!).getByRole("textbox", {
                                name: "Age",
                            }) as HTMLInputElement;
                            expect(ageInput).toBeInTheDocument();
                            expect(ageInput.value).toBe(`${age}`);
                        });
                    });

                    describe("Including password inputs", async () => {
                        test("That should have the correct default value from the 'defaultValues' prop", async () => {
                            const { password } = defaultValues.details;

                            const passwordInput = within(fieldsetElement!).getByLabelText(
                                "Password",
                            ) as HTMLInputElement;
                            expect(passwordInput).toBeInTheDocument();
                            expect(passwordInput.value).toBe(password);
                            expect(passwordInput.tagName).toBe("INPUT");
                            expect(passwordInput.getAttribute("type")).toBe("password");
                        });
                    });
                });
            });

            describe("That should, if the form is not 'open'...", () => {
                test("Contain the element specified in that fieldset's 'fullElement' field", () => {
                    renderFunc();

                    const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const { fieldsets } = mockProps!;
                    const { legend } = fieldsets![0]!;

                    const fieldsetElement = within(formElement).getByRole("group", {
                        name: legend,
                    });

                    const fieldsetFullElement =
                        within(fieldsetElement).getByLabelText("full-element");
                    expect(fieldsetFullElement).toBeInTheDocument();
                });
            });
        });

        describe("That should, if the form is 'open'...", () => {
            test("Render any additional errors from the resolver", async () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: { form: { root: { message: "Additional error" } } },
                }));
                const onSubmitSpy = vi.fn();
                await renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                        additionalErrorPaths: ["form.root"],
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                const editCancelButton = within(formElement).getByRole("button", {
                    name: "Edit",
                });
                await act(async () => userEvent.click(editCancelButton));

                await act(async () => fireEvent.submit(formElement));

                expect(resolverSpy).toHaveBeenCalled();

                const additionalErrorElement = within(formElement).getByText("Additional error");
                expect(additionalErrorElement).toBeInTheDocument();
            });

            describe("Contain a submit button...", () => {
                test("With text content equal to the value of the 'submitButtonText' prop", async () => {
                    await renderFunc({
                        propsOverride: {
                            submitButtonText: "Save changes",
                        } as unknown as TFormBuilder<MockFormData>,
                    });

                    const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const editCancelButton = within(formElement).getByRole("button", {
                        name: "Edit",
                    });
                    await act(async () => userEvent.click(editCancelButton));

                    const submitButton = within(formElement).getByRole("button", {
                        name: "Save changes",
                    });
                    expect(submitButton).toBeInTheDocument();
                });

                test("Or with text content equal to 'Submit' if the 'submitButtonText' prop is undefined", async () => {
                    await renderFunc();

                    const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const editCancelButton = within(formElement).getByRole("button", {
                        name: "Edit",
                    });
                    await act(async () => userEvent.click(editCancelButton));

                    const submitButton = within(formElement).getByRole("button", {
                        name: "Submit",
                    });
                    expect(submitButton).toBeInTheDocument();
                });
            });
        });

        describe("That should, on submit...", async () => {
            test("Invoke the callback function passed to the 'resolver' prop", async () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: { age: { message: "Invalid value" } },
                }));
                const onSubmitSpy = vi.fn();
                renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                expect(resolverSpy).not.toHaveBeenCalled();

                await act(async () => fireEvent.submit(formElement));

                expect(resolverSpy).toHaveBeenCalled();
            });

            test("If the submission is unsuccessful, not invoke the callback function passed to the 'onSubmit' prop", async () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: { age: { message: "Invalid value" } },
                }));
                const onSubmitSpy = vi.fn();
                renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                expect(onSubmitSpy).not.toHaveBeenCalled();

                await act(async () => fireEvent.submit(formElement));

                expect(onSubmitSpy).not.toHaveBeenCalled();
                expect(resolverSpy).toHaveBeenCalled();
            });

            test("If the submission is successful, invoke the callback function passed to the 'onSubmit' prop", async () => {
                const resolverSpy = vi.fn(() => ({ values: {}, errors: {} }));
                const onSubmitSpy = vi.fn();
                renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const formElement = screen.getByRole("form", { name: mockProps.ariaLabel });

                expect(onSubmitSpy).not.toHaveBeenCalled();

                await act(async () => fireEvent.submit(formElement));

                expect(onSubmitSpy).toHaveBeenCalled();
                expect(resolverSpy).toHaveBeenCalled();
            });
        });
    });
});
