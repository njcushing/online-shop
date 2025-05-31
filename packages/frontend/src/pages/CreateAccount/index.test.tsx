import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import { act } from "react";
import { CreateAccount } from ".";

// Mock dependencies
const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockUseNavigate,
    };
});

vi.mock("@/features/AccountCreationForm", () => ({
    AccountCreationForm: ({ onSuccess }: { onSuccess: () => unknown }) => (
        <button
            type="button"
            aria-label="AccountCreationForm component"
            onClick={onSuccess}
        ></button>
    ),
}));

vi.mock("@/features/SetPersonalInformationForm", () => ({
    SetPersonalInformationForm: ({ onSuccess }: { onSuccess: () => unknown }) => (
        <button
            type="button"
            aria-label="SetPersonalInformationForm component"
            onClick={onSuccess}
        ></button>
    ),
}));

describe("The CreateAccount component...", () => {
    test("Should render the AccountCreationForm component if the 'defaultStage' prop is set to '0'", () => {
        render(<CreateAccount defaultStage={0} />);

        const AccountCreationFormComponent = screen.getByLabelText("AccountCreationForm component");
        expect(AccountCreationFormComponent).toBeInTheDocument();
    });

    test("Which should be the default value for the prop", () => {
        render(<CreateAccount />);

        const AccountCreationFormComponent = screen.getByLabelText("AccountCreationForm component");
        expect(AccountCreationFormComponent).toBeInTheDocument();
    });

    test("Until the AccountCreationForm's 'onSuccess' callback function prop is called", async () => {
        render(<CreateAccount />);

        const AccountCreationFormComponent = screen.getByLabelText("AccountCreationForm component");

        await act(async () => userEvent.click(AccountCreationFormComponent));

        expect(screen.queryByLabelText("AccountCreationForm component")).not.toBeInTheDocument();
    });

    test("At which point, the SetPersonalInformationForm component should be rendered", async () => {
        render(<CreateAccount />);

        const AccountCreationFormComponent = screen.getByLabelText("AccountCreationForm component");

        await act(async () => userEvent.click(AccountCreationFormComponent));

        const SetPersonalInformationFormComponent = screen.getByLabelText(
            "SetPersonalInformationForm component",
        );
        expect(SetPersonalInformationFormComponent).toBeInTheDocument();
    });

    test("Should render the SetPersonalInformationForm component if the 'defaultStage' prop is set to '1'", () => {
        render(<CreateAccount defaultStage={1} />);

        const SetPersonalInformationFormComponent = screen.getByLabelText(
            "SetPersonalInformationForm component",
        );
        expect(SetPersonalInformationFormComponent).toBeInTheDocument();
    });

    test("Should navigate to '/' when the SetPersonalInformationForm's 'onSuccess' callback function prop is called", async () => {
        render(<CreateAccount defaultStage={1} />);

        const SetPersonalInformationFormComponent = screen.getByLabelText(
            "SetPersonalInformationForm component",
        );

        await userEvent.click(SetPersonalInformationFormComponent);

        expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });

    test("Should render neither the AccountCreationForm component or SetPersonalInformationForm component if the 'defaultStage' prop isn't set to '0' or '1'", async () => {
        // @ts-expect-error - Disabling type checking for component prop in unit test
        render(<CreateAccount defaultStage={2} />);

        const AccountCreationFormComponent = screen.queryByLabelText(
            "AccountCreationForm component",
        );
        expect(AccountCreationFormComponent).not.toBeInTheDocument();

        const SetPersonalInformationFormComponent = screen.queryByLabelText(
            "SetPersonalInformationForm component",
        );
        expect(SetPersonalInformationFormComponent).not.toBeInTheDocument();
    });
});
