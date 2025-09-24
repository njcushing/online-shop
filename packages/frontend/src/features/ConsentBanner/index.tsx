import { Link } from "react-router-dom";
import { Modal, Button } from "@mantine/core";
import styles from "./index.module.css";

export function ConsentBanner() {
    return (
        <Modal
            opened
            size="100%"
            withCloseButton={false}
            closeOnClickOutside={false}
            onClose={() => {}}
            classNames={{
                inner: styles["modal-inner"],
                content: styles["modal-content"],
                header: styles["modal-header"],
                body: styles["modal-body"],
                close: styles["modal-close"],
            }}
        >
            <h2 className={styles["header"]}>This site uses cookies</h2>

            <p>Cafree uses cookies to store session data in your browser. These cookies help:</p>

            <ul>
                <li>
                    Maintain your session (e.g., user details, watchlist, order history,
                    subscriptions and cart data) across page reloads.
                </li>
                <li>Auto-fill personal, shipping and payment information at checkout.</li>
            </ul>

            <p>
                <strong>Important:</strong> This is a mock e-commerce site for portfolio purposes
                only. No real transactions take place, and no personal data is sent to any server
                (beyond standard technical information such as your IP address in HTTP requests).
                Thus, there is no requirement to use real identifying information; you are free to
                use fake details.
            </p>

            <p>
                The site will still work without cookies, but your session data will not persist
                after reload.
            </p>

            <p>
                For more information, please read our{" "}
                <Link to="/privacy">Privacy & Cookie Policy</Link>
            </p>

            <div className={styles["buttons-container"]}>
                <Button
                    onClick={() => {}}
                    color="rgb(32, 32, 32)"
                    variant="filled"
                    className={styles["button"]}
                >
                    Accept cookies
                </Button>
                <Button
                    onClick={() => {}}
                    color="rgb(32, 32, 32)"
                    variant="filled"
                    className={styles["button"]}
                >
                    Reject cookies
                </Button>
            </div>
        </Modal>
    );
}
