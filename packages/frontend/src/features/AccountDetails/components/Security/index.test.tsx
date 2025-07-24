import { vi } from "vitest";
import { screen, render, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IUserContext, UserContext } from "@/pages/Root";
import { Security } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

const mockUserContext: RecursivePartial<IUserContext> = {
    accountDetails: {
        data: {},
        status: 200,
        message: "Success",
        awaiting: false,
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
                <Security />
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

describe("The Security component...", () => {
    test("Should render a heading element with text content equal to: 'Security'", () => {
        renderFunc();

        const headingElement = screen.getByRole("heading", { name: "Security" });
        expect(headingElement).toBeInTheDocument();
    });

    describe("Should render a FormBuilder component", () => {
        test("As expected", () => {
            renderFunc();

            const FormBuilderComponent = screen.getByLabelText("FormBuilder component");
            expect(FormBuilderComponent).toBeInTheDocument();
        });

        test("That should contain a fieldset with a legend of 'Password'", () => {
            renderFunc();

            const FormBuilderComponent = screen.getByLabelText("FormBuilder component");

            const fieldsetLegendElement = within(FormBuilderComponent).getByRole("group", {
                name: "Password",
            });
            expect(fieldsetLegendElement).toBeInTheDocument();
        });

        test("That should contain an element with text content equal to: 'Update your password'", () => {
            renderFunc();

            const FormBuilderComponent = screen.getByLabelText("FormBuilder component");

            const fullElement = within(FormBuilderComponent).getByText("Update your password");
            expect(fullElement).toBeInTheDocument();
        });
    });
});
