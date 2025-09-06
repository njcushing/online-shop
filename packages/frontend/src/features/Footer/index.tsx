import { useLocation, Link } from "react-router-dom";
import { Box, Divider } from "@mantine/core";
import { Logo } from "../Logo";
import styles from "./index.module.css";

export function Footer() {
    const location = useLocation();
    const reduced = location.pathname === "/cart" || location.pathname === "/checkout";

    let layout = "normal";
    if (reduced) layout = "reduced";

    if (layout === "normal") {
        return (
            <footer className={styles["footer"]} data-layout={layout}>
                <div className={styles["footer-width-controller"]}>
                    <div className={styles["column-1"]}>
                        <Logo size="lg" />
                        <Box visibleFrom="sm">
                            <p className={styles["copyright-message"]}>© njcushing 2025</p>
                        </Box>
                    </div>

                    <Divider size="sm" orientation="vertical" color="black" visibleFrom="sm" />
                    <Divider size="sm" orientation="horizontal" color="black" hiddenFrom="sm" />

                    <div className={styles["sections-container"]}>
                        <div className={styles["section"]}>
                            <h3 className={styles["section-heading"]}>Legal</h3>
                            <Link to="/" className={styles["link"]}>
                                Terms & Conditions
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                Privacy Policy
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                Rewards
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                Delivery
                            </Link>
                        </div>

                        <div className={styles["section"]}>
                            <h3 className={styles["section-heading"]}>Help</h3>
                            <Link to="/" className={styles["link"]}>
                                FAQs
                            </Link>
                        </div>

                        <div className={styles["section"]}>
                            <h3 className={styles["section-heading"]}>Contact</h3>
                            <Link to="/" className={styles["link"]}>
                                Email
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                Address
                            </Link>
                        </div>

                        <div className={styles["section"]}>
                            <h3 className={styles["section-heading"]}>Socials</h3>
                            <Link to="/" className={styles["link"]}>
                                Instagram
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                X
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                Facebook
                            </Link>
                            <Link to="/" className={styles["link"]}>
                                GitHub
                            </Link>
                        </div>
                    </div>

                    <Divider size="sm" orientation="horizontal" color="black" hiddenFrom="sm" />

                    <Box hiddenFrom="sm">
                        <p className={styles["copyright-message"]}>© njcushing 2025</p>
                    </Box>
                </div>
            </footer>
        );
    }

    return (
        <footer className={styles["footer"]} data-layout={layout}>
            <div className={styles["footer-width-controller"]}>
                <div className={styles["logo-container"]}>
                    <Logo size="md" />
                </div>
                <div className={styles["section"]}>
                    <Link to="/" className={styles["link"]}>
                        Help
                    </Link>
                    <Divider size="sm" orientation="vertical" color="black" />
                    <Link to="/" className={styles["link"]}>
                        Terms & Conditions
                    </Link>
                    <Divider size="sm" orientation="vertical" color="black" />
                    <Link to="/" className={styles["link"]}>
                        Privacy Policy
                    </Link>
                </div>
                <p className={styles["copyright-message"]}>© njcushing 2025</p>
            </div>
        </footer>
    );
}
