import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { SetPersonalInformationForm, TSetPersonalInformationForm } from ".";

// Mock dependencies
const mockOnSuccess = vi.fn();
const mockProps: TSetPersonalInformationForm = {
    onSuccess: mockOnSuccess,
};

type renderFuncArgs = {
    propsOverride?: TSetPersonalInformationForm;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <SetPersonalInformationForm {...mergedProps} />;
    }

    function BrowserRouterWrapper({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        return (
            // Using BrowserRouter for Link component(s)
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component props={props} />
            </BrowserRouter>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<BrowserRouterWrapper props={propsOverride} />)
        : await act(() => render(<BrowserRouterWrapper props={propsOverride} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<BrowserRouterWrapper props={newArgs.propsOverride} />);
        },
        component: <BrowserRouterWrapper props={propsOverride} />,
    };
};

const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockUseNavigate,
    };
});

describe("The SetPersonalInformationForm component...", () => {
    afterEach(() => {
        mockOnSuccess.mockRestore();
    });

    test("Should render a text element informing the user of the current stage of the form", async () => {
        await renderFunc();

        const currentStageElement = screen.getByText("Stage 1 of 2");
        expect(currentStageElement).toBeInTheDocument();
    });

    describe("Should render a 'Next' button", () => {
        test("That, on click, should take the form to the next stage", async () => {
            await renderFunc();

            const nextButton = screen.getByRole("button", { name: "Next" });
            expect(nextButton).toBeInTheDocument();

            expect(screen.getByText("Stage 1 of 2")).toBeInTheDocument();

            await act(async () => userEvent.click(nextButton));

            expect(screen.getByText("Stage 2 of 2")).toBeInTheDocument();
        });

        test("Unless the user is on the final stage of the form", async () => {
            await renderFunc();

            const nextButton = screen.getByRole("button", { name: "Next" });
            expect(nextButton).toBeInTheDocument();

            expect(screen.getByText("Stage 1 of 2")).toBeInTheDocument();

            await act(async () => userEvent.click(nextButton));

            expect(screen.getByText("Stage 2 of 2")).toBeInTheDocument();

            expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
        });
    });

    describe("Should render a 'Previous stage' button", () => {
        test("That, on click, should take the form to the previous stage", async () => {
            await renderFunc();

            const nextButton = screen.getByRole("button", { name: "Next" });

            await act(async () => userEvent.click(nextButton));

            expect(screen.getByText("Stage 2 of 2")).toBeInTheDocument();

            const previousStageButton = screen.getByRole("button", { name: "Previous stage" });
            expect(previousStageButton).toBeInTheDocument();

            await act(async () => userEvent.click(previousStageButton));

            expect(screen.getByText("Stage 1 of 2")).toBeInTheDocument();
        });

        test("Unless the user is on the first stage of the form", async () => {
            await renderFunc();

            const previousStageButton = screen.queryByRole("button", { name: "Previous stage" });
            expect(previousStageButton).not.toBeInTheDocument();
        });
    });

    describe("During the first stage of the form...", () => {
        test("Should render a <heading> element with the text content: 'Tell us more about yourself", () => {
            renderFunc();

            const headingElement = screen.getByText("Tell us more about yourself");
            expect(headingElement).toBeInTheDocument();
        });

        describe("Should render a <form> element...", () => {
            test("With a 'text' <input> element for the user's first name", () => {
                renderFunc();

                const inputFirstName = screen.getByRole("textbox", { name: "First name" });
                expect(inputFirstName).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the user's last name", () => {
                renderFunc();

                const inputLastName = screen.getByRole("textbox", { name: "Last name" });
                expect(inputLastName).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the user's phone number", () => {
                renderFunc();

                const inputPhoneNumber = screen.getByRole("textbox", { name: "Phone number" });
                expect(inputPhoneNumber).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the day of the user's date of birth", () => {
                renderFunc();

                const inputDobDay = screen.getByRole("textbox", { name: "Day" });
                expect(inputDobDay).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the month of the user's date of birth", () => {
                renderFunc();

                const inputDobMonth = screen.getByRole("textbox", { name: "Month" });
                expect(inputDobMonth).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the year of the user's date of birth", () => {
                renderFunc();

                const inputDobYear = screen.getByRole("textbox", { name: "Year" });
                expect(inputDobYear).toBeInTheDocument();
            });
        });
    });

    describe("During the second stage of the form...", () => {
        beforeEach(async () => {
            await renderFunc();

            const nextButton = screen.getByRole("button", { name: "Next" });

            await act(async () => userEvent.click(nextButton));
        });

        test("Should render a <heading> element with the text content: 'Tell us more about yourself", () => {
            const headingElement = screen.getByText("What is your address");
            expect(headingElement).toBeInTheDocument();
        });

        describe("Should render a <form> element...", () => {
            test("With a 'text' <input> element for line 1 of the user's address", () => {
                const inputAddressLine1 = screen.getByRole("textbox", { name: "Line 1" });
                expect(inputAddressLine1).toBeInTheDocument();
            });

            test("With a 'text' <input> element for line 2 of the user's address", () => {
                const inputAddressLine2 = screen.getByRole("textbox", { name: "Line 2" });
                expect(inputAddressLine2).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the user's town or city", () => {
                const inputAddressTownOrCity = screen.getByRole("textbox", {
                    name: "Town or City",
                });
                expect(inputAddressTownOrCity).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the user's county", () => {
                const inputAddressCounty = screen.getByRole("textbox", { name: "County" });
                expect(inputAddressCounty).toBeInTheDocument();
            });

            test("With a 'text' <input> element for the user's postcode", () => {
                const inputAddressPostcode = screen.getByRole("textbox", { name: "Postcode" });
                expect(inputAddressPostcode).toBeInTheDocument();
            });

            test("With a 'Submit' button", () => {
                const submitButton = screen.getByRole("button", { name: "Submit" });
                expect(submitButton).toBeInTheDocument();
            });

            describe("That, on submission...", () => {
                describe("If successful...", async () => {
                    test("Should invoke the callback function passed to the 'onSuccess' prop", async () => {
                        const errorProneFields = [
                            { role: "textbox", name: "First name", validValue: "John" },
                            { role: "textbox", name: "Last name", validValue: "Smith" },
                            { role: "textbox", name: "Phone number", validValue: "+441234567890" },
                            { role: "textbox", name: "Day", validValue: "1" },
                            { role: "textbox", name: "Month", validValue: "1" },
                            { role: "textbox", name: "Year", validValue: "1999" },
                            { role: "textbox", name: "Line 1", validValue: "House number" },
                            { role: "textbox", name: "Line 2", validValue: "Street name" },
                            { role: "textbox", name: "Town or City", validValue: "Westminster" },
                            { role: "textbox", name: "County", validValue: "Greater London" },
                            { role: "textbox", name: "Postcode", validValue: "W1A 1AA" },
                        ];

                        for (let i = 0; i < errorProneFields.length; i++) {
                            const { role, name, validValue } = errorProneFields[i];
                            const field = screen.getByRole(role, { name });

                            // Need to adjust the value of each input one at a time
                            /* eslint-disable no-await-in-loop */

                            await act(async () => userEvent.type(field, validValue));

                            /* eslint-enable no-await-in-loop */
                        }

                        const submitButton = screen.getByRole("button", { name: "Submit" });

                        await act(async () => userEvent.click(submitButton));

                        expect(mockOnSuccess).toHaveBeenCalled();
                    });
                });

                describe("If unsuccessful...", async () => {
                    test("Should not invoke the callback function passed to the 'onSuccess' prop", async () => {
                        const inputAddressPostcode = screen.getByRole("textbox", {
                            name: "Postcode",
                        });
                        await act(async () =>
                            userEvent.type(inputAddressPostcode, "Invalid postcode"),
                        );

                        const submitButton = screen.getByRole("button", { name: "Submit" });

                        await act(async () => userEvent.click(submitButton));

                        expect(mockOnSuccess).not.toHaveBeenCalled();
                    });

                    test("Should display error messages for the invalid fields", async () => {
                        const errorProneFields = [
                            {
                                role: "textbox",
                                name: "Phone number",
                                invalidValue: "Invalid",
                                error: "Invalid UK phone number",
                            },
                            {
                                role: "textbox",
                                name: "Day",
                                invalidValue: "0",
                                error: "Please enter a valid day",
                            },
                            {
                                role: "textbox",
                                name: "Month",
                                invalidValue: "0",
                                error: "Please enter a valid month",
                            },
                            {
                                role: "textbox",
                                name: "Year",
                                invalidValue: "0",
                                error: "Date of birth must be after 1st January 1875",
                            },
                            {
                                role: "textbox",
                                name: "Postcode",
                                invalidValue: "Invalid",
                                error: "Invalid UK postcode",
                            },
                        ];

                        const submitButton = screen.getByRole("button", { name: "Submit" });

                        for (let i = 0; i < errorProneFields.length; i++) {
                            const { role, name, invalidValue, error } = errorProneFields[i];
                            const field = screen.getByRole(role, { name });

                            // Need to adjust the value of each input one at a time
                            /* eslint-disable no-await-in-loop */

                            await act(async () => userEvent.type(field, invalidValue));
                            await act(async () => userEvent.click(submitButton));

                            /* eslint-enable no-await-in-loop */

                            const errorElement = screen.getByText(error, { exact: false });
                            expect(errorElement).toBeInTheDocument();
                            expect(errorElement.role).toBe("alert");
                        }
                    });
                });
            });
        });
    });

    test("Should render a 'Skip for now' button", async () => {
        renderFunc();

        const skipForNowButton = screen.getByRole("button", { name: "Skip for now" });
        expect(skipForNowButton).toBeInTheDocument();

        mockUseNavigate.mockRestore();

        await act(async () => userEvent.click(skipForNowButton));

        expect(mockUseNavigate).toHaveBeenCalledWith("/");

        mockUseNavigate.mockRestore();
    });
});
