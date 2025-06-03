import { Button } from "@mantine/core";
import styles from "./index.module.css";

export type TOAuthButton = {
    leftSection?: React.ReactNode;
    children?: React.ReactNode;
};

const defaultProps = {
    variant: "outline",
    color: "black",
    radius: 9999,
    classNames: {
        inner: styles["oauth-button-inner"],
        label: styles["oauth-button-label"],
    },
};

export function OAuthButton({ leftSection, children }: TOAuthButton) {
    return (
        <Button component="a" role="link" {...defaultProps} leftSection={leftSection}>
            {children}
        </Button>
    );
}
