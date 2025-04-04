import { createContext, useState, useEffect, useRef, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { mockGetPopulatedCartItemData } from "@/api/cart";
import { Home } from "../Home";
import { Category } from "../Category";
import { Product } from "../Product";
import { ErrorPage } from "../ErrorPage";
import styles from "./index.module.css";

export const Routes = [
    {
        path: "",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "c/*",
        element: <Category />,
        errorElement: <ErrorPage />,
    },
    {
        path: "p/:productSlug",
        element: <Product />,
        errorElement: <ErrorPage />,
    },
];

export interface IUserContext {
    cart: { data: PopulatedCartItemData[]; awaiting: boolean; status: number; message: string };
}

const defaultUserContext: IUserContext = {
    cart: { data: [], awaiting: false, status: 200, message: "Success" },
};

export const UserContext = createContext<IUserContext>(defaultUserContext);

export function Root() {
    const [cart, setCart] = useState<IUserContext["cart"]>(defaultUserContext.cart);

    const getPopulatedCartDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        const fetchCart = async () => {
            // Simulate API request delay
            await new Promise((resolve) => {
                getPopulatedCartDataTimeoutRef.current = setTimeout(resolve, 1000);
            });

            getPopulatedCartDataTimeoutRef.current = null;

            const response = {
                data: mockGetPopulatedCartItemData(),
                awaiting: false,
                status: 200,
                message: "Success",
            };

            setCart(response);
        };

        fetchCart();
        setCart((curr) => ({ ...curr, awaiting: true }));

        return () => {
            if (getPopulatedCartDataTimeoutRef.current) {
                clearTimeout(getPopulatedCartDataTimeoutRef.current);
            }
        };
    }, []);

    return (
        <UserContext.Provider
            value={useMemo(
                () => ({
                    cart,
                }),
                [cart],
            )}
        >
            <div className={styles["page"]}>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </UserContext.Provider>
    );
}
