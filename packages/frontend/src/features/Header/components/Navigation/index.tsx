import { ActionIcon } from "@mantine/core";
import { MagnifyingGlass, User, ShoppingCartSimple } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Logo } from "./components/Logo";
import styles from "./index.module.css";

export function Navigation() {
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
                <Link to="/c/coffee" className={styles["option"]}>
                    Coffee
                </Link>
                <Link to="/c/equipment" className={styles["option"]}>
                    Equipment
                </Link>
                <Link to="/c/accessories" className={styles["option"]}>
                    Accessories
                </Link>
                <Link to="/c/gifts_subscriptions" className={styles["option"]}>
                    Gifts & Subscriptions
                </Link>
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
