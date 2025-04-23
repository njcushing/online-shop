import { createContext, useState, useEffect, useRef, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { mockGetCart } from "@/api/cart";
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

export interface IRootContext {
    headerInfo: {
        active: boolean;
        open: boolean;
        height: number;
        forceClose: (state: boolean) => void;
    };
}

const defaultRootContext: IRootContext = {
    headerInfo: { active: false, open: true, height: 0, forceClose: () => {} },
};

export interface IUserContext {
    cart: { data: PopulatedCartItemData[]; awaiting: boolean; status: number; message: string };
}

const defaultUserContext: IUserContext = {
    cart: { data: [], awaiting: false, status: 200, message: "Success" },
};

export interface IHeaderContext {
    setHeaderInfo: React.Dispatch<React.SetStateAction<IRootContext["headerInfo"]>>;
}

const defaultHeaderContext: IHeaderContext = {
    setHeaderInfo: () => {},
};

export const RootContext = createContext<IRootContext>(defaultRootContext);

export const UserContext = createContext<IUserContext>(defaultUserContext);

export const HeaderContext = createContext<IHeaderContext>(defaultHeaderContext);

export function Root() {
    const [headerInfo, setHeaderInfo] = useState<IRootContext["headerInfo"]>(
        defaultRootContext.headerInfo,
    );

    const [cart, setCart] = useState<IUserContext["cart"]>(defaultUserContext.cart);

    const getCartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        const fetchCart = async () => {
            // Simulate API request delay
            await new Promise((resolve) => {
                getCartTimeoutRef.current = setTimeout(resolve, 1000);
            });

            getCartTimeoutRef.current = null;

            const response = {
                data: mockGetCart(),
                awaiting: false,
                status: 200,
                message: "Success",
            };

            setCart(response);
        };

        fetchCart();
        setCart((curr) => ({ ...curr, awaiting: true }));

        return () => {
            if (getCartTimeoutRef.current) clearTimeout(getCartTimeoutRef.current);
        };
    }, []);

    return (
        <RootContext.Provider value={useMemo(() => ({ headerInfo }), [headerInfo])}>
            <UserContext.Provider value={useMemo(() => ({ cart }), [cart])}>
                <div className={styles["page"]}>
                    <HeaderContext.Provider
                        value={useMemo(() => ({ setHeaderInfo }), [setHeaderInfo])}
                    >
                        <Header />
                    </HeaderContext.Provider>
                    <Outlet />
                    <Footer />
                </div>
            </UserContext.Provider>
        </RootContext.Provider>
    );
}
