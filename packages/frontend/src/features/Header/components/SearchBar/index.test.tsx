import { screen, render } from "@test-utils";
import _ from "lodash";
import { RecursivePartial } from "@/utils/types";
import { SearchBar, TSearchBar } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TSearchBar> = {
    opened: true,
};

type renderFuncArgs = {
    propsOverride?: TSearchBar;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { propsOverride } = args;

    const mergedProps = _.merge(_.cloneDeep(structuredClone(mockProps)), propsOverride);

    const component = <SearchBar {...mergedProps} />;

    const { rerender } = render(component);

    return {
        rerender,
        component,
    };
};

describe("The SearchBar component...", () => {
    describe("Should render a Mantine Input component...", () => {
        test("With a placeholder equal to 'Search for a product'", () => {
            renderFunc();

            const InputComponent = screen.getByRole("textbox");
            expect(InputComponent).toBeInTheDocument();
            expect(InputComponent.getAttribute("placeholder")).toBe("Search for a product");
        });

        test("Unless the 'opened' prop is set to 'false'", () => {
            renderFunc({ propsOverride: { opened: false } });

            const InputComponent = screen.queryByRole("textbox");
            expect(InputComponent).not.toBeInTheDocument();
        });
    });
});
