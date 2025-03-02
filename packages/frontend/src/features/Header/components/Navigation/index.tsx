import { useState } from "react";
import { Anchor, Burger, Menu, ActionIcon } from "@mantine/core";
import { MagnifyingGlass, User, ShoppingCartSimple } from "@phosphor-icons/react";
import { Logo } from "./components/Logo";
import styles from "./index.module.css";

export function Navigation() {
    const [burgerToggled, setBurgerToggled] = useState<boolean>(false);

    return (
        <nav className={styles["navigation"]}>
            <Logo />
            <div className={styles["other-links"]}>
                <ActionIcon variant="transparent" color="gray" aria-label="Search">
                    <MagnifyingGlass size={48} color="black" />
                </ActionIcon>
                <ActionIcon variant="transparent" color="gray" aria-label="User">
                    <User size={48} color="black" />
                </ActionIcon>
                <ActionIcon variant="transparent" color="gray" aria-label="Cart">
                    <ShoppingCartSimple size={48} color="black" />
                </ActionIcon>
            </div>
            <div className={styles["categories"]}>
                <Anchor className={styles["option"]}>Coffee</Anchor>
                <Anchor className={styles["option"]}>Equipment</Anchor>
                <Anchor className={styles["option"]}>Accessories</Anchor>
                <Anchor className={styles["option"]}>Gifts & Subscriptions</Anchor>
            </div>
        </nav>
    );
}

/*
    <Menu position="bottom-end" withArrow onClose={() => setBurgerToggled(false)}>
        <Menu.Target>
            <Burger
                lineSize={2}
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
*/
