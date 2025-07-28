import { screen, render, userEvent, fireEvent } from "@test-utils";
import _ from "lodash";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
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

    describe("Should render a 'Clear input' button", () => {
        test("If the Input component's value is truthy", async () => {
            renderFunc();

            const InputComponent = screen.getByRole("textbox");

            await act(async () => fireEvent.change(InputComponent, { target: { value: "test" } }));

            const clearInputButton = screen.getByRole("button");
            expect(clearInputButton).toBeInTheDocument();
        });

        test("Unless the Input component's value is falsy", async () => {
            renderFunc();

            const InputComponent = screen.getByRole("textbox");

            await act(async () => fireEvent.change(InputComponent, { target: { value: "" } }));

            const clearInputButton = screen.queryByRole("button");
            expect(clearInputButton).not.toBeInTheDocument();
        });

        test("That should, on click, set the Input component's value to an empty string", async () => {
            renderFunc();

            const InputComponent = screen.getByRole("textbox") as HTMLInputElement;

            await act(async () => fireEvent.change(InputComponent, { target: { value: "test" } }));

            expect(InputComponent.value).toBe("test");

            const clearInputButton = screen.getByRole("button");

            await act(async () => userEvent.click(clearInputButton));

            expect(InputComponent.value).toBe("");
        });
    });
});
