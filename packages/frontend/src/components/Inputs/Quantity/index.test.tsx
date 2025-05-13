import { vi } from "vitest";
import { act } from "react";
import { screen, render, fireEvent, userEvent } from "@test-utils";
import { Quantity } from ".";

describe("The Quantity component...", () => {
    describe("Should render an <input> element...", () => {
        test("With a 'type' attribute equal to 'number'", () => {
            render(<Quantity />);

            const input = screen.getByRole("spinbutton");
            expect(input).toBeInTheDocument();
            expect(input.getAttribute("type")).toBe("number");
        });

        test("With an initial value equal to the value of the 'defaultValue' prop", () => {
            render(<Quantity defaultValue={3} />);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;
            expect(input.value).toBe("3");
        });

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
            expect(callback).toHaveBeenCalledWith(3);

            const input = screen.getByRole("spinbutton") as HTMLInputElement;

            await act(async () => userEvent.type(input, "0"));

            expect(callback).toHaveBeenCalledWith(30);
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
    });

    describe("Should render an 'increment' <button> element...", () => {
        test("With a 'type' attribute equal to 'button'", () => {
            render(<Quantity />);

            const incrementButton = screen.getByRole("button", { name: "Increase quantity" });
            expect(incrementButton).toBeInTheDocument();
            expect(incrementButton.getAttribute("type")).toBe("button");
        });

        test("That, when clicked, should decrement the value of the input by 1", async () => {
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
    });
});
