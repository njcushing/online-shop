import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { PersonalInformation } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockUserContext: RecursivePartial<IUserContext> = {
    user: {
        response: {
            data: {
                profile: {
                    personal: {
                        firstName: "First",
                        lastName: "Last",
                        phone: "00000000000",
                        dob: {
                            day: 1,
                            month: 1,
                            year: 1970,
                        },
                        email: "email@address.com",
                    },
                },
            } as IUserContext["user"]["response"]["data"],
            status: 200,
            message: "Success",
        },
        awaiting: false,
    },

    defaultData: {
        user: {
            profile: {
                personal: {
                    firstName: "dFirst",
                    lastName: "dLast",
                    phone: "00000000001",
                    dob: {
                        day: 2,
                        month: 2,
                        year: 1971,
                    },
                    email: "dEmail@address.com",
                },
            },
        },
    },
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
                <PersonalInformation />
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

vi.mock("@/features/AccountDetails/components/FormBuilder", () => ({
    FormBuilder: vi.fn(
        (props: unknown & { fieldsets: { legend: string; fullElement?: JSX.Element }[] }) => {
            const { fieldsets } = props;

            return (
                <div aria-label="FormBuilder component">
                    {fieldsets.map((fieldset) => {
                        const { legend, fullElement } = fieldset;

                        return (
                            <fieldset key={legend}>
                                <legend>{legend}</legend>
                                {fullElement}
                            </fieldset>
                        );
                    })}
                </div>
            );
        },
    ),
}));

describe("The PersonalInformation component...", () => {
    test("Should render a heading element with text content equal to: 'Personal Information'", () => {
        renderFunc();

        const headingElement = screen.getByRole("heading", { name: "Personal Information" });
        expect(headingElement).toBeInTheDocument();
    });

    describe("Should render a FormBuilder component for the user's name(s)", () => {
        test("That should contain a fieldset with a legend of 'Name'", () => {
            renderFunc();

            const fieldsetLegendElement = screen.getByRole("group", { name: "Name" });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        describe("That should be passed an element to that fieldset's 'fullElement' field...", () => {
            test("With text content equal to the user's first and last names", () => {
                renderFunc();

                const { firstName, lastName } =
                    mockUserContext.user!.response!.data!.profile!.personal!;

                const fullElement = screen.getByText(`${firstName} ${lastName}`);
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to: 'Provide a name' if the user's first or last names are null/undefined", () => {
                renderFunc({
                    UserContextOverride: {
                        user: {
                            response: {
                                data: {
                                    profile: { personal: { firstName: null, lastName: null } },
                                },
                            },
                        },
                    } as unknown as IUserContext,
                });

                const fullElement = screen.getByText("Provide a name");
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to the UserContext's default data if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const { firstName, lastName } =
                    mockUserContext.defaultData!.user!.profile!.personal!;

                const fullElement = screen.getByText(`${firstName} ${lastName}`);
                expect(fullElement).toBeInTheDocument();
            });

            test("That should not be visible if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const { firstName, lastName } =
                    mockUserContext.defaultData!.user!.profile!.personal!;

                // queryByText *does not* exclude hidden elements - must manually check visibility
                const fullElement = screen.queryByText(`${firstName} ${lastName}`);
                expect(fullElement).not.toBeVisible();
            });
        });
    });

    describe("Should render a FormBuilder component for the user's phone number", () => {
        test("That should contain a fieldset with a legend of 'Phone number'", () => {
            renderFunc();

            const fieldsetLegendElement = screen.getByRole("group", { name: "Phone number" });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        describe("That should be passed an element to that fieldset's 'fullElement' field...", () => {
            test("With text content equal to the user's phone number", () => {
                renderFunc();

                const { phone } = mockUserContext.user!.response!.data!.profile!.personal!;

                const fullElement = screen.getByText(phone!);
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to: 'Provide a phone number' if the user's phone number is null/undefined", () => {
                renderFunc({
                    UserContextOverride: {
                        user: { response: { data: { profile: { personal: { phone: null } } } } },
                    } as unknown as IUserContext,
                });

                const fullElement = screen.getByText("Provide a phone number");
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to the UserContext's default data if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const { phone } = mockUserContext.defaultData!.user!.profile!.personal!;

                const fullElement = screen.getByText(phone!);
                expect(fullElement).toBeInTheDocument();
            });

            test("That should not be visible if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const { phone } = mockUserContext.defaultData!.user!.profile!.personal!;

                // queryByText *does not* exclude hidden elements - must manually check visibility
                const fullElement = screen.queryByText(phone!);
                expect(fullElement).not.toBeVisible();
            });
        });
    });

    describe("Should render a FormBuilder component for the user's date of birth", () => {
        test("That should contain a fieldset with a legend of 'Date of birth'", () => {
            renderFunc();

            const fieldsetLegendElement = screen.getByRole("group", { name: "Date of birth" });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        describe("That should be passed an element to that fieldset's 'fullElement' field...", () => {
            test("With text content equal to the user's date of birth in the format: e.g. - January 1, 1970", () => {
                renderFunc();

                const fullElement = screen.getByText("January 1, 1970");
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to the UserContext's default data if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const fullElement = screen.getByText("February 2, 1971");
                expect(fullElement).not.toBeVisible();
            });

            test("That should not be visible if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                // queryByText *does not* exclude hidden elements - must manually check visibility
                const fullElement = screen.queryByText("February 2, 1971");
                expect(fullElement).not.toBeVisible();
            });
        });
    });

    describe("Should render a FormBuilder component for the user's email address", () => {
        test("That should contain a fieldset with a legend of 'Email'", () => {
            renderFunc();

            const fieldsetLegendElement = screen.getByRole("group", { name: "Email" });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        describe("That should be passed an element to that fieldset's 'fullElement' field...", () => {
            test("With text content equal to the user's email address", () => {
                renderFunc();

                const { email } = mockUserContext.user!.response!.data!.profile!.personal!;

                const fullElement = screen.getByText(email!);
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to: 'Provide an email address' if the user's email is null/undefined", () => {
                renderFunc({
                    UserContextOverride: {
                        user: { response: { data: { profile: { personal: { email: null } } } } },
                    } as unknown as IUserContext,
                });

                const fullElement = screen.getByText("Provide an email address");
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to the UserContext's default data if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const { email } = mockUserContext.defaultData!.user!.profile!.personal!;

                const fullElement = screen.getByText(email!);
                expect(fullElement).toBeInTheDocument();
            });

            test("That should not be visible if the UserContext's 'user.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { user: { awaiting: true } } as IUserContext,
                });

                const { email } = mockUserContext.defaultData!.user!.profile!.personal!;

                // queryByText *does not* exclude hidden elements - must manually check visibility
                const fullElement = screen.queryByText(email!);
                expect(fullElement).not.toBeVisible();
            });
        });
    });

    describe("Should still render without throwing...", () => {
        test("If the UserContext's 'user.response.data' field is null/undefined", () => {
            renderFunc({
                UserContextOverride: {
                    user: { response: { data: null } },
                } as IUserContext,
            });

            const headingElement = screen.getByRole("heading", { name: "Personal Information" });
            expect(headingElement).toBeInTheDocument();
        });
    });
});
