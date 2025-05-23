import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import { Login } from ".";

// Mock dependencies
const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockUseNavigate,
    };
});

vi.mock("@/features/LoginForm", () => ({
    LoginForm: ({ onSuccess }: { onSuccess: () => unknown }) => (
        <button type="button" aria-label="LoginForm component" onClick={onSuccess}></button>
    ),
}));

describe("The Login component...", () => {
    test("Should render the LoginForm component", () => {
        render(<Login />);

        const LoginFormComponent = screen.getByLabelText("LoginForm component");
        expect(LoginFormComponent).toBeInTheDocument();
    });

    test("Should navigate to '/' when the LoginForm's 'onSuccess' callback function prop is called", async () => {
        render(<Login />);

        const LoginFormComponent = screen.getByLabelText("LoginForm component");

        await userEvent.click(LoginFormComponent);

        expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });
});
