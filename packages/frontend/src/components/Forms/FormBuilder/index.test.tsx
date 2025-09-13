import { Mock, vi } from "vitest";
import { screen, render, within, userEvent, fireEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { UseFormProps } from "react-hook-form";
import { FormBuilder, TFormBuilder } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

type MockFormData = {
    examples: {
        text: {
            onTouched: string;
            onChange: string;
            onBlur: string;
            onSubmit: string;
            all: string;
        };
        number: {
            onTouched: number;
            onChange: number;
            onBlur: number;
            onSubmit: number;
            all: number;
        };
        password: {
            onTouched: string;
            onChange: string;
            onBlur: string;
            onSubmit: string;
            all: string;
        };
    };
};
/**
 * Leaving some fields as empty strings/undefined to test that when empty string inputs are set to
 * undefined and vice-versa, the form doesn't mark that input as a changed field
 */
const defaultValues = {
    examples: {
        text: {
            onTouched: "defaultTextOnTouched",
            onChange: "defaultTextOnChange",
            onBlur: "",
            onSubmit: undefined,
            all: "defaultTextAll",
        },
        number: {
            onTouched: 10,
            onChange: 20,
            onBlur: undefined,
            onSubmit: 40,
            all: 50,
        },
        password: {
            onTouched: "defaultPasswordOnTouched",
            onChange: "defaultPasswordOnChange",
            onBlur: undefined,
            onSubmit: "defaultPasswordOnSubmit",
            all: "defaultPasswordAll",
        },
    },
};
const mockProps: RecursivePartial<TFormBuilder<MockFormData>> = {
    fieldsets: [
        {
            legend: "Text",
            fields: [
                {
                    type: "text",
                    name: "examples.text.onTouched",
                    label: "Text onTouched",
                    mode: "onTouched",
                    classNames: { input: "", label: "" },
                },
                {
                    type: "text",
                    name: "examples.text.onChange",
                    label: "Text onChange",
                    mode: "onChange",
                },
                {
                    type: "text",
                    name: "examples.text.onBlur",
                    label: "Text onBlur",
                    mode: "onBlur",
                },
                {
                    type: "text",
                    name: "examples.text.onSubmit",
                    label: "Text onSubmit",
                    mode: "onSubmit",
                },
                {
                    type: "text",
                    name: "examples.text.all",
                    label: "Text all",
                    mode: "all",
                    sharedValidation: ["examples.text.onChange"],
                },
            ],
            fullElement: <div aria-label="full-element-text"></div>,
            classNames: {
                fieldset: "fieldset",
                legend: "legend",
                formFieldsContainer: "formFieldsContainer",
            },
        },
        {
            legend: "Number",
            fields: [
                {
                    type: "numeric",
                    name: "examples.number.onTouched",
                    label: "Number onTouched",
                    mode: "onTouched",
                },
                {
                    type: "numeric",
                    name: "examples.number.onChange",
                    label: "Number onChange",
                    mode: "onChange",
                },
                {
                    type: "numeric",
                    name: "examples.number.onBlur",
                    label: "Number onBlur",
                    mode: "onBlur",
                },
                {
                    type: "numeric",
                    name: "examples.number.onSubmit",
                    label: "Number onSubmit",
                    mode: "onSubmit",
                },
                { type: "numeric", name: "examples.number.all", label: "Number all", mode: "all" },
            ],
            fullElement: <div aria-label="full-element-number"></div>,
            classNames: {
                fieldset: "fieldset",
                legend: "legend",
                formFieldsContainer: "formFieldsContainer",
            },
        },
        {
            legend: "Password",
            fields: [
                {
                    type: "password",
                    name: "examples.password.onTouched",
                    label: "Password onTouched",
                    mode: "onTouched",
                },
                {
                    type: "password",
                    name: "examples.password.onChange",
                    label: "Password onChange",
                    mode: "onChange",
                },
                {
                    type: "password",
                    name: "examples.password.onBlur",
                    label: "Password onBlur",
                    mode: "onBlur",
                },
                {
                    type: "password",
                    name: "examples.password.onSubmit",
                    label: "Password onSubmit",
                    mode: "onSubmit",
                },
                {
                    type: "password",
                    name: "examples.password.all",
                    label: "Password all",
                    mode: "all",
                },
            ],
            fullElement: <div aria-label="full-element-password"></div>,
            classNames: {
                fieldset: "fieldset",
                legend: "legend",
                formFieldsContainer: "formFieldsContainer",
            },
        },
    ],
    ariaLabel: "Examples",
    defaultValues,
    resolver: undefined,
    onSubmit: undefined,
    submitButtonText: undefined,
    disabled: false,
    additionalErrorPaths: [],
    classNames: {
        form: "form",
        editButton: "editButton",
        fieldsetsContainer: "fieldsetsContainer",
        additionalFieldErrorsContainer: "additionalFieldErrorsContainer",
        submitButton: "submitButton",
    },
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

const testInputValidation = async (
    input: HTMLInputElement,
    form: HTMLFormElement,
    mode: UseFormProps<MockFormData>["mode"],
    resolverSpy: Mock,
) => {
    // Each array entry is the cumulative expected number of calls of the resolverSpy
    let expectedCalls = [0, 0, 0, 0, 0];
    if (mode === "onChange") expectedCalls = [0, 0, 1, 2, 3];
    if (mode === "onTouched") expectedCalls = [0, 1, 2, 3, 4];
    if (mode === "onBlur") expectedCalls = [0, 1, 1, 1, 2];
    if (mode === "onSubmit") expectedCalls = [0, 0, 0, 0, 1];
    if (mode === "all") expectedCalls = [0, 1, 2, 3, 4];

    expect(resolverSpy).toHaveBeenCalledTimes(0);

    await act(async () => fireEvent.focus(input));

    expect(resolverSpy).toHaveBeenCalledTimes(expectedCalls[0]);

    await act(async () => fireEvent.blur(input));

    expect(resolverSpy).toHaveBeenCalledTimes(expectedCalls[1]);

    // Using a numeric value as it's valid for testing both text and number inputs
    await act(async () => fireEvent.change(input, { target: { value: 1 } }));

    expect(resolverSpy).toHaveBeenCalledTimes(expectedCalls[2]);

    await act(async () => fireEvent.change(input, { target: { value: "" } }));

    expect(resolverSpy).toHaveBeenCalledTimes(expectedCalls[3]);

    await act(async () => fireEvent.submit(form));

    expect(resolverSpy).toHaveBeenCalledTimes(expectedCalls[4]);
};

describe("The FormBuilder component...", () => {
    describe("Should render a <form> element...", () => {
        test("With an aria-label attribute equal to the value of the 'ariaLabel' prop", () => {
            renderFunc();

            const form = screen.getByRole("form", { name: mockProps.ariaLabel });
            expect(form).toBeInTheDocument();
        });

        describe("That should contain an edit/cancel button...", () => {
            test("With text content equal to: 'Edit', initially, meaning the form is not 'open'", () => {
                renderFunc();

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                const editCancelButton = within(form).getByRole("button", { name: "Edit" });
                expect(editCancelButton).toBeInTheDocument();
            });

            test("That, when clicked, should toggle the 'open' state of the form and therefore the button's text content between 'Edit' and 'Cancel'", async () => {
                await renderFunc();

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                const editCancelButton = within(form).getByRole("button", { name: "Edit" });
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

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                const { fieldsets } = mockProps!;
                const { legend } = fieldsets![0]!;

                const fieldsetElement = within(form).getByRole("group", { name: legend });
                expect(fieldsetElement).toBeInTheDocument();
            });

            describe("That should, if the form is 'open'...", () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: {},
                }));
                const onSubmitSpy = vi.fn();
                let form;

                beforeEach(async () => {
                    await renderFunc({
                        propsOverride: {
                            resolver: resolverSpy,
                            onSubmit: onSubmitSpy,
                        } as unknown as TFormBuilder<MockFormData>,
                    });

                    form = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const editCancelButton = within(form).getByRole("button", {
                        name: "Edit",
                    });
                    await act(async () => userEvent.click(editCancelButton));
                });

                afterEach(() => {
                    resolverSpy.mockRestore();
                    onSubmitSpy.mockRestore();
                });

                describe("Contain a form input for each entry in that fieldset's 'fields' array...", async () => {
                    describe("Including text inputs...", async () => {
                        let fieldsetElement;

                        beforeEach(() => {
                            const { fieldsets } = mockProps!;
                            const { legend } = fieldsets![0]!;

                            fieldsetElement = within(form!).getByRole("group", {
                                name: legend,
                            });
                        });

                        test("That should have the correct default value from the 'defaultValues' prop", async () => {
                            const { all } = defaultValues.examples.text;

                            const textInput = within(fieldsetElement!).getByRole("textbox", {
                                name: "Text all",
                            }) as HTMLInputElement;
                            expect(textInput).toBeInTheDocument();
                            expect(textInput.value).toBe(all);
                        });

                        describe("That should invoke the callback function passed to the 'resolver' prop...", async () => {
                            test("On change or submit, if the input's 'mode' field is 'onChange'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Text onChange",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onChange", resolverSpy);
                            });

                            test("On blur, change or submit (after the input has been 'touched'), if the input's 'mode' field is 'onTouched'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Text onTouched",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onTouched", resolverSpy);
                            });

                            test("On blur or submit, if the input's 'mode' field is 'onBlur'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Text onBlur",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onBlur", resolverSpy);
                            });

                            test("On submit, if the input's 'mode' field is 'onSubmit'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Text onSubmit",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onSubmit", resolverSpy);
                            });

                            test("On blur, change or submit, if the input's 'mode' field is 'all'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Text all",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "all", resolverSpy);
                            });
                        });
                    });

                    describe("Including number inputs", async () => {
                        let fieldsetElement;

                        beforeEach(() => {
                            const { fieldsets } = mockProps!;
                            const { legend } = fieldsets![1]!;

                            fieldsetElement = within(form!).getByRole("group", {
                                name: legend,
                            });
                        });

                        test("That should have the correct default value from the 'defaultValues' prop", async () => {
                            const { all } = defaultValues.examples.number;

                            const numberInput = within(fieldsetElement!).getByRole("textbox", {
                                name: "Number all",
                            }) as HTMLInputElement;
                            expect(numberInput).toBeInTheDocument();
                            expect(numberInput.value).toBe(`${all}`);
                        });

                        describe("That should invoke the callback function passed to the 'resolver' prop...", async () => {
                            test("On change or submit, if the input's 'mode' field is 'onChange'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Number onChange",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onChange", resolverSpy);
                            });

                            test("On blur, change or submit (after the input has been 'touched'), if the input's 'mode' field is 'onTouched'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Number onTouched",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onTouched", resolverSpy);
                            });

                            test("On blur or submit, if the input's 'mode' field is 'onBlur'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Number onBlur",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onBlur", resolverSpy);
                            });

                            test("On submit, if the input's 'mode' field is 'onSubmit'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Number onSubmit",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onSubmit", resolverSpy);
                            });

                            test("On blur, change or submit, if the input's 'mode' field is 'all'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Number all",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "all", resolverSpy);
                            });
                        });
                    });

                    describe("Including password inputs", async () => {
                        let fieldsetElement;

                        beforeEach(() => {
                            const { fieldsets } = mockProps!;
                            const { legend } = fieldsets![2]!;

                            fieldsetElement = within(form!).getByRole("group", {
                                name: legend,
                            });
                        });

                        test("That should have the correct default value from the 'defaultValues' prop", async () => {
                            const { all } = defaultValues.examples.password;

                            const passwordInput = within(fieldsetElement!).getByLabelText(
                                "Password all",
                            ) as HTMLInputElement;
                            expect(passwordInput).toBeInTheDocument();
                            expect(passwordInput.value).toBe(all);
                            expect(passwordInput.tagName).toBe("INPUT");
                            expect(passwordInput.getAttribute("type")).toBe("password");
                        });

                        describe("That should invoke the callback function passed to the 'resolver' prop...", async () => {
                            test("On change or submit, if the input's 'mode' field is 'onChange'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Password onChange",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onChange", resolverSpy);
                            });

                            test("On blur, change or submit (after the input has been 'touched'), if the input's 'mode' field is 'onTouched'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Password onTouched",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onTouched", resolverSpy);
                            });

                            test("On blur or submit, if the input's 'mode' field is 'onBlur'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Password onBlur",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onBlur", resolverSpy);
                            });

                            test("On submit, if the input's 'mode' field is 'onSubmit'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Password onSubmit",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "onSubmit", resolverSpy);
                            });

                            test("On blur, change or submit, if the input's 'mode' field is 'all'", async () => {
                                const input = within(fieldsetElement!).getByLabelText(
                                    "Password all",
                                ) as HTMLInputElement;

                                await testInputValidation(input, form!, "all", resolverSpy);
                            });
                        });
                    });

                    describe("That have a 'data-error' attribute of 'true'...", async () => {
                        test("When the resolver returns an error for that field", async () => {
                            resolverSpy.mockReturnValueOnce({
                                values: {},
                                errors: {
                                    examples: { text: { all: { message: "Error message" } } },
                                },
                            });

                            const { fieldsets } = mockProps!;
                            const { legend } = fieldsets![0]!;

                            const fieldsetElement = within(form!).getByRole("group", {
                                name: legend,
                            });

                            const textInput = within(fieldsetElement!).getByRole("textbox", {
                                name: "Text all",
                            }) as HTMLInputElement;

                            await act(async () => fireEvent.submit(form!));

                            expect(textInput.getAttribute("data-error")).toBe("true");
                        });

                        test("When the resolver returns an error for one of the field paths specified in that field's 'sharedValidation' array", async () => {
                            resolverSpy.mockReturnValueOnce({
                                values: {},
                                errors: {
                                    examples: { text: { onChange: { message: "Error message" } } },
                                },
                            });

                            const { fieldsets } = mockProps!;
                            const { legend } = fieldsets![0]!;

                            const fieldsetElement = within(form!).getByRole("group", {
                                name: legend,
                            });

                            const textInput = within(fieldsetElement!).getByRole("textbox", {
                                name: "Text all",
                            }) as HTMLInputElement;

                            await act(async () => fireEvent.submit(form!));

                            expect(textInput.getAttribute("data-error")).toBe("true");
                        });
                    });
                });
            });

            describe("That should, if the form is not 'open'...", () => {
                test("Contain the element specified in that fieldset's 'fullElement' field", () => {
                    renderFunc();

                    const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const { fieldsets } = mockProps!;
                    const { legend } = fieldsets![0]!;

                    const fieldsetElement = within(form).getByRole("group", {
                        name: legend,
                    });

                    const fieldsetFullElement =
                        within(fieldsetElement).getByLabelText("full-element-text");
                    expect(fieldsetFullElement).toBeInTheDocument();
                });
            });
        });

        describe("That should, if the form is 'open'...", () => {
            test("Render any additional errors from the resolver", async () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: { examples: { text: { root: { message: "Additional error" } } } },
                }));
                const onSubmitSpy = vi.fn();
                await renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                        additionalErrorPaths: ["examples.text.root"],
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                const editCancelButton = within(form).getByRole("button", {
                    name: "Edit",
                });
                await act(async () => userEvent.click(editCancelButton));

                await act(async () => fireEvent.submit(form));

                expect(resolverSpy).toHaveBeenCalled();

                const additionalErrorElement = within(form).getByText("Additional error");
                expect(additionalErrorElement).toBeInTheDocument();
            });

            describe("Contain a submit button...", () => {
                test("With text content equal to the value of the 'submitButtonText' prop", async () => {
                    await renderFunc({
                        propsOverride: {
                            submitButtonText: "Save changes",
                        } as unknown as TFormBuilder<MockFormData>,
                    });

                    const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const editCancelButton = within(form).getByRole("button", {
                        name: "Edit",
                    });
                    await act(async () => userEvent.click(editCancelButton));

                    const submitButton = within(form).getByRole("button", {
                        name: "Save changes",
                    });
                    expect(submitButton).toBeInTheDocument();
                });

                test("Or with text content equal to 'Submit' if the 'submitButtonText' prop is undefined", async () => {
                    await renderFunc();

                    const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                    const editCancelButton = within(form).getByRole("button", {
                        name: "Edit",
                    });
                    await act(async () => userEvent.click(editCancelButton));

                    const submitButton = within(form).getByRole("button", {
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
                    errors: { number: { message: "Invalid value" } },
                }));
                const onSubmitSpy = vi.fn();
                renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                expect(resolverSpy).not.toHaveBeenCalled();

                await act(async () => fireEvent.submit(form));

                expect(resolverSpy).toHaveBeenCalled();
            });

            test("If the submission is unsuccessful, not invoke the callback function passed to the 'onSubmit' prop", async () => {
                const resolverSpy = vi.fn(() => ({
                    values: {},
                    errors: { number: { message: "Invalid value" } },
                }));
                const onSubmitSpy = vi.fn();
                renderFunc({
                    propsOverride: {
                        resolver: resolverSpy,
                        onSubmit: onSubmitSpy,
                    } as unknown as TFormBuilder<MockFormData>,
                });

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                expect(onSubmitSpy).not.toHaveBeenCalled();

                await act(async () => fireEvent.submit(form));

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

                const form = screen.getByRole("form", { name: mockProps.ariaLabel });

                expect(onSubmitSpy).not.toHaveBeenCalled();

                await act(async () => fireEvent.submit(form));

                expect(onSubmitSpy).toHaveBeenCalled();
                expect(resolverSpy).toHaveBeenCalled();
            });
        });
    });
});
