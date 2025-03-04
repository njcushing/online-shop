import { useState } from "react";
import { ActionIcon, Burger, Drawer } from "@mantine/core";
import { MagnifyingGlass, User, ShoppingCartSimple } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Logo } from "./components/Logo";
import styles from "./index.module.css";

export type Category = {
    name: string;
    path: string;
};

const categories = [
    { name: "Coffee", path: "/c/coffee" },
    { name: "Tea", path: "/c/tea" },
    { name: "Equipment", path: "/c/equipment" },
    { name: "Accessories", path: "/c/accessories" },
    { name: "Gifts & Subscriptions", path: "/c/gifts_accessories" },
];

export function Navigation() {
    const [burgerToggled, setBurgerToggled] = useState<boolean>(false);

    return (
        <nav className={styles["navigation"]}>
            <Burger
                lineSize={2}
                size="32px"
                opened={burgerToggled}
                onClick={() => {
                    setBurgerToggled(!burgerToggled);
                }}
                aria-label="Toggle navigation"
                hiddenFrom="lg"
                className={styles["burger"]}
            ></Burger>

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
                {categories.map((category) => {
                    const { name, path } = category;
                    return (
                        <Link
                            to={path}
                            className={styles["option"]}
                            key={`navbar-category-${name}`}
                        >
                            {name}
                        </Link>
                    );
                })}
            </div>

            <Drawer
                opened={burgerToggled}
                onClose={() => setBurgerToggled(false)}
                title={<Logo />}
                className={styles["drawer"]}
            >
                {categories.map((category) => {
                    const { name, path } = category;
                    return (
                        <Link
                            to={path}
                            className={styles["drawer-option"]}
                            key={`navbar-category-${name}`}
                        >
                            {name}
                        </Link>
                    );
                })}
            </Drawer>
        </nav>
    );
}
