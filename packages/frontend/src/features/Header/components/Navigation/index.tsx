import React, { useState } from "react";
import { ActionIcon, Burger, Drawer, NavLink } from "@mantine/core";
import {
    MagnifyingGlass,
    User,
    ShoppingCartSimple,
    CoffeeBean,
    Leaf,
    Coffee,
    Gear,
    Gift,
    CaretRight,
    IconProps,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Logo } from "./components/Logo";
import styles from "./index.module.css";

export type Category = {
    name: string;
    path: string;
    icon: React.ReactNode;
};

const iconProps: IconProps = {
    weight: "fill",
    size: 24,
};

const categories: Category[] = [
    { name: "Coffee", path: "/c/coffee", icon: <CoffeeBean {...iconProps} /> },
    { name: "Tea", path: "/c/tea", icon: <Leaf {...iconProps} /> },
    { name: "Equipment", path: "/c/equipment", icon: <Gear {...iconProps} /> },
    { name: "Accessories", path: "/c/accessories", icon: <Coffee {...iconProps} /> },
    {
        name: "Gifts & Subscriptions",
        path: "/c/gifts-subscriptions",
        icon: <Gift {...iconProps} />,
    },
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
                title={<Logo onClick={() => setBurgerToggled(false)} />}
                classNames={{
                    root: styles["drawer-root"],
                    content: styles["drawer-content"],
                    body: styles["drawer-body"],
                }}
            >
                {categories.map((category) => {
                    const { name, path, icon } = category;
                    return (
                        <NavLink
                            component={Link}
                            to={path}
                            label={name}
                            leftSection={icon}
                            rightSection={<CaretRight size={24} />}
                            onClick={() => setBurgerToggled(false)}
                            style={{ flexShrink: 0 }}
                            key={`navlink-category-${name}`}
                        />
                    );
                })}
            </Drawer>
        </nav>
    );
}
