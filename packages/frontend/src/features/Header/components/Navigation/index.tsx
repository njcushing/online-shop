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
import { Logo } from "@/features/Logo";
import { CartDrawer } from "@/features/Cart/components/CartDrawer";
import { mockCart } from "@/utils/products/cart";
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
    const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

    return (
        <nav className={styles["navigation"]}>
            <Burger
                lineSize={2}
                size="32px"
                opened={navDrawerOpen}
                onClick={() => {
                    setNavDrawerOpen(!navDrawerOpen);
                }}
                aria-label="Toggle navigation"
                hiddenFrom="lg"
                className={styles["burger"]}
            ></Burger>

            <Logo />

            <div className={styles["other-links"]}>
                <ActionIcon variant="transparent" color="gray" aria-label="Search">
                    <MagnifyingGlass weight="bold" size={48} color="black" />
                </ActionIcon>
                <ActionIcon variant="transparent" color="gray" aria-label="User">
                    <User weight="bold" size={48} color="black" />
                </ActionIcon>
                <div className={styles["cart-button-container"]}>
                    <ActionIcon
                        variant="transparent"
                        color="gray"
                        aria-label="Cart"
                        onClick={() => setCartDrawerOpen(!cartDrawerOpen)}
                    >
                        <ShoppingCartSimple weight="bold" size={48} color="black" />
                    </ActionIcon>
                    {mockCart.length > 0 && (
                        <span className={styles["cart-items-quantity"]}>{mockCart.length}</span>
                    )}
                </div>
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
                            <div className={styles["underscore"]}></div>
                        </Link>
                    );
                })}
            </div>

            <Drawer
                opened={navDrawerOpen}
                onClose={() => setNavDrawerOpen(false)}
                title={<Logo onClick={() => setNavDrawerOpen(false)} />}
                classNames={{
                    root: styles["drawer-root"],
                    content: styles["drawer-content"],
                    header: styles["drawer-header"],
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
                            onClick={() => setNavDrawerOpen(false)}
                            style={{ flexShrink: 0 }}
                            key={`navlink-category-${name}`}
                        />
                    );
                })}
            </Drawer>

            <CartDrawer opened={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
        </nav>
    );
}
