import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/pages/Root";
import { useMatches, ActionIcon, Burger, BurgerProps } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { MagnifyingGlass, User, ShoppingCartSimple, IconProps } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { categories } from "@/utils/products/categories";
import { Logo } from "@/features/Logo";
import { CartDrawer } from "@/features/Cart/components/CartDrawer";
import { SearchBar } from "../SearchBar";
import styles from "./index.module.css";
import { NavDrawer } from "./components/NavDrawer";

export type Category = {
    name: string;
    path: string;
    icon: React.ReactNode;
};

export type TNavigation = {
    opened?: boolean;
};

export function Navigation({ opened = false }: TNavigation) {
    const { cart } = useContext(UserContext);
    const { data: cartData } = cart;

    const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
    const [searchBarOpen, setSearchBarOpen] = useState<boolean>(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

    const [searchBarButtonRef, setSearchBarButtonRef] = useState<HTMLButtonElement | null>(null);
    const [searchBarRef, setSearchBarRef] = useState<HTMLInputElement | null>(null);

    const { burgerSize, iconSize } = useMatches<{
        burgerSize: BurgerProps["size"];
        iconSize: IconProps["size"];
    }>({
        base: { burgerSize: "28px", iconSize: "24px" },
        xs: { burgerSize: "32px", iconSize: "26px" },
    });

    useEffect(() => {
        if (navDrawerOpen) {
            setSearchBarOpen(false);
            setCartDrawerOpen(false);
        }
    }, [navDrawerOpen]);

    useEffect(() => {
        if (searchBarOpen) {
            setNavDrawerOpen(false);
            setCartDrawerOpen(false);
        }
    }, [searchBarOpen]);

    useEffect(() => {
        if (cartDrawerOpen) {
            setNavDrawerOpen(false);
            setSearchBarOpen(false);
        }
    }, [cartDrawerOpen]);

    useEffect(() => {
        if (!opened) {
            setNavDrawerOpen(false);
            setSearchBarOpen(false);
            setCartDrawerOpen(false);
        }
    }, [opened]);

    useClickOutside(() => setSearchBarOpen(false), null, [searchBarButtonRef, searchBarRef]);

    return (
        <>
            <nav className={styles["navigation"]}>
                <Burger
                    lineSize={2}
                    size={burgerSize}
                    opened={navDrawerOpen}
                    onClick={() => {
                        if (opened) setNavDrawerOpen(!navDrawerOpen);
                    }}
                    aria-label="Toggle navigation"
                    hiddenFrom="lg"
                    className={styles["burger"]}
                ></Burger>

                <div className={styles["logo-container"]}>
                    <Logo />
                </div>

                <div className={styles["other-links"]}>
                    <ActionIcon
                        variant="transparent"
                        color="gray"
                        aria-label="Search"
                        onClick={() => {
                            if (opened) setSearchBarOpen(!searchBarOpen);
                        }}
                        ref={setSearchBarButtonRef}
                    >
                        <MagnifyingGlass size={iconSize} color="black" />
                    </ActionIcon>
                    <ActionIcon variant="transparent" color="gray" aria-label="User">
                        <User size={iconSize} color="black" />
                    </ActionIcon>
                    <div className={styles["cart-button-container"]}>
                        <ActionIcon
                            variant="transparent"
                            color="gray"
                            aria-label="Cart"
                            onClick={() => {
                                if (opened) setCartDrawerOpen(!cartDrawerOpen);
                            }}
                        >
                            <ShoppingCartSimple size={iconSize} color="black" />
                        </ActionIcon>
                        {cartData && cartData.length > 0 && (
                            <span className={styles["cart-items-quantity"]}>{cartData.length}</span>
                        )}
                    </div>
                </div>

                <div className={`${styles["categories"]} mantine-visible-from-lg`}>
                    {categories.map((category) => {
                        const { name, slug } = category;
                        return (
                            <Link
                                to={`/c/${slug}`}
                                className={styles["option"]}
                                key={`navbar-category-${name}`}
                            >
                                {name}
                                <div className={styles["underscore"]}></div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <NavDrawer opened={navDrawerOpen} onClose={() => setNavDrawerOpen(false)} />
            <CartDrawer opened={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
            <SearchBar opened={searchBarOpen} ref={setSearchBarRef} />
        </>
    );
}
