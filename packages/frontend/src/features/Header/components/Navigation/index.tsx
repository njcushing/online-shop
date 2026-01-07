import { useContext, useEffect, useState } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { useMatches, ActionIcon, Burger, BurgerProps, Skeleton } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { MagnifyingGlass, User, ShoppingCartSimple, IconProps } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { buildCategoriesTree, skeletonCategories } from "@/utils/products/categories";
import { Logo } from "@/features/Logo";
import { CartDrawer } from "@/features/Cart/components/CartDrawer";
import { Cart } from "@/utils/products/cart";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { SearchBar } from "../SearchBar";
import { NavDrawer } from "./components/NavDrawer";
import styles from "./index.module.css";

export type TNavigation = {
    opened?: boolean;
    reduced?: boolean;
};

export function Navigation({ opened = false, reduced }: TNavigation) {
    const { categories } = useContext(RootContext);
    const { cart, defaultData } = useContext(UserContext);

    let categoriesData = null;
    let cartData = defaultData.cart as Cart;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "categories", context: categories },
            { name: "cart", context: cart },
        ],
    });

    if (!awaitingAny) {
        if (data.categories) categoriesData = data.categories;
        if (data.cart) cartData = data.cart;
    }

    const [displaySkeletons, setDisplaySkeletons] = useState(true);
    useEffect(() => setDisplaySkeletons(awaitingAny), [awaitingAny]);

    const navigate = useNavigate();

    const [categoryTree, setCategoryTree] = useState<ReturnType<typeof buildCategoriesTree>>([]);
    useEffect(() => {
        if (awaitingAny) setCategoryTree(skeletonCategories);
        else setCategoryTree(buildCategoriesTree(categoriesData || []));
    }, [awaitingAny, categoriesData]);

    const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
    const [searchBarOpen, setSearchBarOpen] = useState<boolean>(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

    const [searchBarButtonRef, setSearchBarButtonRef] = useState<HTMLButtonElement | null>(null);
    const [searchBarRef, setSearchBarRef] = useState<HTMLInputElement | null>(null);

    const { burgerSize, iconSize } = useMatches<{
        burgerSize: BurgerProps["size"];
        iconSize: IconProps["size"];
    }>(
        {
            base: { burgerSize: "28px", iconSize: "24px" },
            xs: { burgerSize: "32px", iconSize: "26px" },
        },
        { getInitialValueInEffect: false },
    );

    useEffect(() => {
        if (reduced) {
            setNavDrawerOpen(false);
            setSearchBarOpen(false);
            setCartDrawerOpen(false);
        }
    }, [reduced]);

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
            <nav className={styles["navigation"]} data-reduced={reduced}>
                {!reduced && (
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
                )}

                <div className={styles["logo-container"]}>
                    <Logo />
                </div>

                {!reduced && (
                    <>
                        <div className={styles["other-links"]}>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                aria-label="Search"
                                onClick={() => {
                                    if (opened) setSearchBarOpen(!searchBarOpen);
                                }}
                                classNames={{ root: styles["action-icon-root"] }}
                                ref={setSearchBarButtonRef}
                            >
                                <MagnifyingGlass size={iconSize} color="black" />
                            </ActionIcon>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                aria-label="User"
                                onClick={() => navigate("/account")}
                                classNames={{ root: styles["action-icon-root"] }}
                            >
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
                                    classNames={{ root: styles["action-icon-root"] }}
                                >
                                    <ShoppingCartSimple size={iconSize} color="black" />
                                </ActionIcon>
                                {!awaitingAny && cartData.items.length > 0 && (
                                    <span className={styles["cart-items-quantity"]}>
                                        {cartData.items.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={`${styles["categories"]} mantine-visible-from-lg`}>
                            {categoryTree.map((category) => {
                                const { name, slug } = category;
                                const path = `/c/${slug}`;
                                return (
                                    <Skeleton
                                        visible={displaySkeletons}
                                        width="min-content"
                                        key={`navbar-category-${name}`}
                                    >
                                        <button
                                            type="button"
                                            className={styles["option"]}
                                            onClick={() => navigate(path)}
                                            style={{
                                                visibility: displaySkeletons ? "hidden" : "initial",
                                            }}
                                        >
                                            {name}
                                            <div className={styles["underscore"]}></div>
                                        </button>
                                    </Skeleton>
                                );
                            })}
                        </div>
                    </>
                )}
            </nav>

            {!reduced && (
                <>
                    <NavDrawer opened={navDrawerOpen} onClose={() => setNavDrawerOpen(false)} />
                    <CartDrawer opened={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
                    <SearchBar opened={searchBarOpen} ref={setSearchBarRef} />
                </>
            )}
        </>
    );
}
