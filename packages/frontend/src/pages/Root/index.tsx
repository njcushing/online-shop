import { createContext, useState, useEffect, useRef, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { mockGetCart } from "@/api/cart";
import { FuncResponseObject } from "@/api/types";
import * as useAsync from "@/hooks/useAsync";
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
        forceClose: (state: boolean, id: string) => void;
    };
}

const defaultRootContext: IRootContext = {
    headerInfo: { active: false, open: true, height: 0, forceClose: () => {} },
};

export interface IUserContext {
    cart: FuncResponseObject<PopulatedCartItemData[]> & { awaiting: boolean };
}

const defaultUserContext: IUserContext = {
    cart: { data: [], status: 200, message: "Success", awaiting: false },
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
    const { response, awaiting } = useAsync.GET(mockGetCart, [{}], { attemptOnMount: true });
    useEffect(() => setCart({ ...response, awaiting }), [response, awaiting]);

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
