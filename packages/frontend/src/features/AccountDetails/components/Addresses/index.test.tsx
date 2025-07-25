import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { Addresses } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockUserContext: RecursivePartial<IUserContext> = {
    accountDetails: {
        data: {
            addresses: {
                delivery: {
                    line1: "Delivery Address Line 1",
                    line2: "Delivery Address Line 2",
                    townCity: "Delivery Address Town/City",
                    county: "Delivery Address County",
                    postcode: "Delivery Address Postcode",
                },
                billing: {
                    line1: "Billing Address Line 1",
                    line2: "Billing Address Line 2",
                    townCity: "Billing Address Town/City",
                    county: "Billing Address County",
                    postcode: "Billing Address Postcode",
                },
            },
        },
        status: 200,
        message: "Success",
        awaiting: false,
    },

    defaultData: {
        accountDetails: {
            addresses: {
                delivery: {
                    line1: "dDelivery Address Line 1",
                    line2: "dDelivery Address Line 2",
                    townCity: "dDelivery Address Town/City",
                    county: "dDelivery Address County",
                    postcode: "dDelivery Address Postcode",
                },
                billing: {
                    line1: "dBilling Address Line 1",
                    line2: "dBilling Address Line 2",
                    townCity: "dBilling Address Town/City",
                    county: "dBilling Address County",
                    postcode: "dBilling Address Postcode",
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
                <Addresses />
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

describe("The Addresses component...", () => {
    test("Should render a heading element with text content equal to: 'Addresses'", () => {
        renderFunc();

        const headingElement = screen.getByRole("heading", { name: "Addresses" });
        expect(headingElement).toBeInTheDocument();
    });

    describe("Should render a FormBuilder component for the user's delivery address", () => {
        test("That should contain a fieldset with a legend of 'Delivery Address'", () => {
            renderFunc();

            const fieldsetLegendElement = screen.getByRole("group", { name: "Delivery Address" });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        describe("That should be passed an element to that fieldset's 'fullElement' field...", () => {
            test("Containing elements with text content equal to the various lines in the user's delivery address", () => {
                renderFunc();

                const { delivery } = mockUserContext.accountDetails!.data!.addresses!;
                const { line1, line2, townCity, county, postcode } = delivery!;

                expect(screen.getByText(line1!)).toBeInTheDocument();
                expect(screen.getByText(line2!)).toBeInTheDocument();
                expect(screen.getByText(townCity!)).toBeInTheDocument();
                expect(screen.getByText(county!)).toBeInTheDocument();
                expect(screen.getByText(postcode!)).toBeInTheDocument();
            });

            test("Or text content equal to: 'No address set' if the user's delivery address is null/undefined", () => {
                renderFunc({
                    UserContextOverride: {
                        accountDetails: { data: { addresses: { delivery: null } } },
                    } as unknown as IUserContext,
                });

                const fullElement = screen.getByText("No address set");
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to the UserContext's default data if the UserContext's 'accountDetails.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { accountDetails: { awaiting: true } } as IUserContext,
                });

                const { delivery } = mockUserContext.defaultData!.accountDetails!.addresses!;
                const { line1, line2, townCity, county, postcode } = delivery!;

                expect(screen.getByText(line1!)).toBeInTheDocument();
                expect(screen.getByText(line2!)).toBeInTheDocument();
                expect(screen.getByText(townCity!)).toBeInTheDocument();
                expect(screen.getByText(county!)).toBeInTheDocument();
                expect(screen.getByText(postcode!)).toBeInTheDocument();
            });

            test("That should not be visible if the UserContext's 'accountDetails.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { accountDetails: { awaiting: true } } as IUserContext,
                });

                const { delivery } = mockUserContext.defaultData!.accountDetails!.addresses!;
                const { line1, line2, townCity, county, postcode } = delivery!;

                // queryByText *does not* exclude hidden elements - must manually check visibility
                expect(screen.queryByText(line1!)).not.toBeVisible();
                expect(screen.queryByText(line2!)).not.toBeVisible();
                expect(screen.queryByText(townCity!)).not.toBeVisible();
                expect(screen.queryByText(county!)).not.toBeVisible();
                expect(screen.queryByText(postcode!)).not.toBeVisible();
            });
        });
    });

    describe("Should render a FormBuilder component for the user's billing address", () => {
        test("That should contain a fieldset with a legend of 'Billing Address'", () => {
            renderFunc();

            const fieldsetLegendElement = screen.getByRole("group", { name: "Billing Address" });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        describe("That should be passed an element to that fieldset's 'fullElement' field...", () => {
            test("Containing elements with text content equal to the various lines in the user's billing address", () => {
                renderFunc();

                const { billing } = mockUserContext.accountDetails!.data!.addresses!;
                const { line1, line2, townCity, county, postcode } = billing!;

                expect(screen.getByText(line1!)).toBeInTheDocument();
                expect(screen.getByText(line2!)).toBeInTheDocument();
                expect(screen.getByText(townCity!)).toBeInTheDocument();
                expect(screen.getByText(county!)).toBeInTheDocument();
                expect(screen.getByText(postcode!)).toBeInTheDocument();
            });

            test("Or text content equal to: 'No address set' if the user's billing address is null/undefined", () => {
                renderFunc({
                    UserContextOverride: {
                        accountDetails: { data: { addresses: { billing: null } } },
                    } as unknown as IUserContext,
                });

                const fullElement = screen.getByText("No address set");
                expect(fullElement).toBeInTheDocument();
            });

            test("Or text content equal to the UserContext's default data if the UserContext's 'accountDetails.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { accountDetails: { awaiting: true } } as IUserContext,
                });

                const { billing } = mockUserContext.defaultData!.accountDetails!.addresses!;
                const { line1, line2, townCity, county, postcode } = billing!;

                expect(screen.getByText(line1!)).toBeInTheDocument();
                expect(screen.getByText(line2!)).toBeInTheDocument();
                expect(screen.getByText(townCity!)).toBeInTheDocument();
                expect(screen.getByText(county!)).toBeInTheDocument();
                expect(screen.getByText(postcode!)).toBeInTheDocument();
            });

            test("That should not be visible if the UserContext's 'accountDetails.awaiting' field is 'true'", () => {
                renderFunc({
                    UserContextOverride: { accountDetails: { awaiting: true } } as IUserContext,
                });

                const { billing } = mockUserContext.defaultData!.accountDetails!.addresses!;
                const { line1, line2, townCity, county, postcode } = billing!;

                // queryByText *does not* exclude hidden elements - must manually check visibility
                expect(screen.queryByText(line1!)).not.toBeVisible();
                expect(screen.queryByText(line2!)).not.toBeVisible();
                expect(screen.queryByText(townCity!)).not.toBeVisible();
                expect(screen.queryByText(county!)).not.toBeVisible();
                expect(screen.queryByText(postcode!)).not.toBeVisible();
            });
        });
    });

    describe("Should still render without throwing...", () => {
        test("If the UserContext's 'accountDetails.data' field is null/undefined", () => {
            renderFunc({
                UserContextOverride: { accountDetails: { data: null } } as IUserContext,
            });

            const headingElement = screen.getByRole("heading", { name: "Addresses" });
            expect(headingElement).toBeInTheDocument();
        });
    });
});
