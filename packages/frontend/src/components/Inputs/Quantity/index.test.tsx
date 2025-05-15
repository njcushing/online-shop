import { vi } from "vitest";
import { act } from "react";
import { screen, render, fireEvent, userEvent } from "@test-utils";
import { Quantity } from ".";

describe("The Quantity component...", () => {
    describe("Should render an <input> element...", () => {
        test("With a 'role' attribute equal to 'spinbutton'", () => {
            render(<Quantity />);

            const input = screen.getByRole("spinbutton");
            expect(input).toBeInTheDocument();
        });

        test("With a 'type' attribute equal to 'text'", () => {
            render(<Quantity />);

            const input = screen.getByRole("spinbutton");
            expect(input).toBeInTheDocument();
            expect(input.getAttribute("type")).toBe("text");
        });

        test("With an initial value equal to the value of the 'defaultValue' prop", () => {
            render(<Quantity defaultValue={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;
            expect(input.value).toBe("3");
        });

        test("Which should allow a single leading minus symbol", async () => {
            render(<Quantity defaultValue={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;
            expect(input.value).toBe("3");

            await act(async () => userEvent.type(input, "-"));

            expect(input.value).toBe("3");

            await act(async () => userEvent.clear(input));
            await act(async () => userEvent.type(input, "-"));

            expect(input.value).toBe("-");

            await act(async () => userEvent.type(input, "1"));

            expect(input.value).toBe("-1");

            await act(async () => userEvent.type(input, "-"));

            expect(input.value).toBe("-1");
        });

        test("Which should, on blur, set the input's value to the current value of the internal quantity state", async () => {
            render(<Quantity defaultValue={3} min={1} max={10} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            expect(input.value).toBe("3");

            await act(async () => userEvent.clear(input));
            await act(async () => userEvent.type(input, "0"));
            await act(async () => fireEvent.blur(input));

            expect(input.value).toBe("1");
        });
    });

    describe("Should render a 'decrement' <button> element...", () => {
        test("With a 'type' attribute equal to 'button'", () => {
            render(<Quantity />);

            const decrementButton = screen.getByRole("button", { name: "Reduce quantity" });
            expect(decrementButton).toBeInTheDocument();
            expect(decrementButton.getAttribute("type")).toBe("button");
        });

        test("That, when clicked, should decrement the value of the input by 1", async () => {
            render(<Quantity defaultValue={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            const decrementButton = screen.getByRole("button", { name: "Reduce quantity" });

            await act(() => fireEvent.click(decrementButton));

            expect(input.value).toBe("2");
        });

        test("Unless the value will fall below the value of the 'min' prop", async () => {
            render(<Quantity defaultValue={3} min={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            const decrementButton = screen.getByRole("button", { name: "Reduce quantity" });

            await act(() => fireEvent.click(decrementButton));

            expect(input.value).toBe("3");
        });

        test("That should be disabled when the value of the 'disabled' prop is 'true'", async () => {
            render(<Quantity disabled />);

            const decrementButton = screen.getByRole("button", { name: "Reduce quantity" });
            expect(decrementButton).toBeDisabled();
        });

        test("Or if the current value of the input is equal to the value of the 'min' prop", async () => {
            render(<Quantity defaultValue={3} min={3} />);

            const decrementButton = screen.getByRole("button", { name: "Reduce quantity" });
            expect(decrementButton).toBeDisabled();
        });
    });

    describe("Should render an 'increment' <button> element...", () => {
        test("With a 'type' attribute equal to 'button'", () => {
            render(<Quantity />);

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });
            expect(incrementButton).toBeInTheDocument();
            expect(incrementButton.getAttribute("type")).toBe("button");
        });

        test("That, when clicked, should increment the value of the input by 1", async () => {
            render(<Quantity defaultValue={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });

            await act(() => fireEvent.click(incrementButton));

            expect(input.value).toBe("4");
        });

        test("Unless the value will exceed the value of the 'max' prop", async () => {
            render(<Quantity defaultValue={3} max={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });

            await act(() => fireEvent.click(incrementButton));

            expect(input.value).toBe("3");
        });

        test("That should be disabled when the value of the 'disabled' prop is 'true'", async () => {
            render(<Quantity disabled />);

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });
            expect(incrementButton).toBeDisabled();
        });

        test("Or if the current value of the input is equal to the value of the 'max' prop", async () => {
            render(<Quantity defaultValue={3} max={3} />);

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });
            expect(incrementButton).toBeDisabled();
        });
    });

    describe("Should take an 'onChange' callback function prop...", () => {
        test("That, when changed, should call the callback function passed to the 'onChange' prop", async () => {
            const callback = vi.fn();

            render(<Quantity defaultValue={3} onChange={callback} />);

            // Called on mount/initial render
            expect(callback).toHaveBeenCalledTimes(1);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            await act(async () => userEvent.type(input, "0"));

            expect(callback).toHaveBeenCalledTimes(2);
        });

        test("Passing the new value as an argument", async () => {
            const callback = vi.fn();

            render(<Quantity defaultValue={3} onChange={callback} />);

            // Called on mount/initial render
            expect(callback).toHaveBeenCalledWith("3");

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            await act(async () => userEvent.type(input, "0"));

            expect(callback).toHaveBeenCalledWith("30");
        });
    });

    describe("Should take an 'onQuantityChange' callback function prop...", () => {
        test("That should be invoked whenever the internal quantity state is changed", async () => {
            const callback = vi.fn();

            render(<Quantity defaultValue={1} onQuantityChange={callback} />);

            // Called on mount/initial render
            expect(callback).toHaveBeenCalledTimes(1);

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });

            await act(() => fireEvent.click(incrementButton));

            expect(callback).toHaveBeenCalledTimes(2);
        });

        test("With the current quantity state value being passed as an argument", async () => {
            const callback = vi.fn();

            render(<Quantity defaultValue={1} onQuantityChange={callback} />);

            // Called on mount/initial render
            expect(callback).toHaveBeenCalledWith(1);

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });

            await act(() => fireEvent.click(incrementButton));

            expect(callback).toHaveBeenCalledWith(2);
        });
    });

    /*

    test("manually entering a number and blurring updates value", () => {
        render(<Quantity defaultValue={2} />);
        const input = screen.getByLabelText("Quantity") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "10" } });
        fireEvent.blur(input);
        expect(input.value).toBe("10");
    });

    test("manually entering invalid value resets to min or 0 on blur", () => {
        render(<Quantity defaultValue={2} min={1} />);
        const input = screen.getByLabelText("Quantity") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.blur(input);
        expect(input.value).toBe("1");
    });

    test("clamps manually entered value to max on blur", () => {
        render(<Quantity defaultValue={1} min={1} max={5} />);
        const input = screen.getByLabelText("Quantity") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "100" } });
        fireEvent.blur(input);
        expect(input.value).toBe("5");
    });

    test("calls onChange when quantity changes", () => {
        const onChange = vi.fn();
        render(<Quantity defaultValue={2} onChange={onChange} />);
        const increment = screen.getByLabelText("Increase quantity");
        fireEvent.click(increment);
        expect(onChange).toHaveBeenCalledWith(3);
    });

    */
});
