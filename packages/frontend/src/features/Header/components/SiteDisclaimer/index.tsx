import { useState } from "react";
import { Collapse } from "@mantine/core";
import styles from "./index.module.css";

export function SiteDisclaimer() {
    const [open, setOpen] = useState<boolean>(true);
    const [closing, setClosing] = useState<boolean>(false);

    if (!open) return null;

    return (
        <Collapse in={!closing} animateOpacity={false} onTransitionEnd={() => setOpen(false)}>
            <div className={styles["site-disclaimer"]}>
                <div className={styles["site-disclaimer-inner"]}>
                    <p className={styles["site-disclaimer-message"]}>
                        This site is a portfolio project; any and all information, products and
                        transactions are NOT real
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            setClosing(true);
                            e.currentTarget.blur();
                        }}
                        className={styles["site-disclaimer-close-button"]}
                    >
                        ✖
                    </button>
                </div>
            </div>
        </Collapse>
    );
}
