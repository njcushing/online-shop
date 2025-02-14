import { useState } from "react";
import { Anchor, Burger, Menu } from "@mantine/core";
import styles from "./index.module.css";

export function Navigation() {
    const [burgerToggled, setBurgerToggled] = useState<boolean>(false);

    return (
        <nav className={styles["navigation"]}>
            <Anchor className={styles["option"]}>Option A</Anchor>
            <Anchor className={styles["option"]}>Option B</Anchor>
            <Anchor className={styles["option"]}>Option C</Anchor>
            <Anchor className={styles["option"]}>Option D</Anchor>
            <Anchor className={styles["option"]}>Option E</Anchor>
            <Menu position="bottom-end" withArrow onClose={() => setBurgerToggled(false)}>
                <Menu.Target>
                    <Burger
                        lineSize={6}
                        size="32px"
                        opened={burgerToggled}
                        onClick={() => {
                            setBurgerToggled(!burgerToggled);
                        }}
                        aria-label="Toggle navigation"
                    ></Burger>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <Anchor className={styles["option"]}>Option F</Anchor>
                    </Menu.Item>
                    <Menu.Item>
                        <Anchor className={styles["option"]}>Option G</Anchor>
                    </Menu.Item>
                    <Menu.Item>
                        <Anchor className={styles["option"]}>Option H</Anchor>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </nav>
    );
}
