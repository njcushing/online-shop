import { useState } from "react";
import { ActionIcon, Burger, Drawer } from "@mantine/core";
import { MagnifyingGlass, User, ShoppingCartSimple } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
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

            <div className={`${styles["categories"]} mantine-visible-from-lg`}>
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

            <div className={`${styles["burger"]} mantine-hidden-from-lg`}>
                <Burger
                    lineSize={2}
                    size="32px"
                    opened={burgerToggled}
                    onClick={() => {
                        setBurgerToggled(!burgerToggled);
                    }}
                    aria-label="Toggle navigation"
                ></Burger>
            </div>

            <Drawer
                opened={burgerToggled}
                onClose={() => setBurgerToggled(false)}
                className={styles["drawer"]}
            ></Drawer>
        </nav>
    );
}
