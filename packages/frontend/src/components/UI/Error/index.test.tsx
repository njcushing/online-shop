import { screen, render } from "@test-utils";
import { act } from "react";
import _ from "lodash";
import { RecursivePartial } from "@/utils/types";
import { Error, TError } from ".";

// Mock dependencies

const mockProps: RecursivePartial<TError> = {
    message: "Test error message",
    classNames: {
        container: "container-class-name",
        message: "message-class-name",
    },
};

type renderFuncArgs = {
    propsOverride?: TError;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return (
            <div data-testid="error-container">
                <Error {...mergedProps} />
            </div>
        );
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

describe("The Error component...", () => {
    test("Should render an element with text content equal to the value of the 'message' prop", () => {
        renderFunc();

        const errorMessage = screen.getByText(mockProps.message!);
        expect(errorMessage).toBeInTheDocument();
    });

    test("Should return null if the 'message' prop's length is 0", () => {
        renderFunc({ propsOverride: { message: "" } });

        const errorContainer = screen.getByTestId("error-container");
        expect(errorContainer).toBeEmptyDOMElement();
    });
});
