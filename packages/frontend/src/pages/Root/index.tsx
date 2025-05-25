import { createContext, useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { generateSkeletonCart, PopulatedCartItemData } from "@/utils/products/cart";
import { mockGetCart } from "@/api/cart";
import { FuncResponseObject } from "@/api/types";
import { RecursivePartial } from "@/utils/types";
import * as useAsync from "@/hooks/useAsync";
import { UserWatchlist } from "@/utils/products/watchlist";
import { mockGetWatchlist } from "@/api/watchlist";
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
        path: "p/:productId/:productSlug",
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
    watchlist: FuncResponseObject<UserWatchlist> & { awaiting: boolean };

    defaultData: {
        cart: RecursivePartial<PopulatedCartItemData>[];
    };
}

const defaultUserContext: IUserContext = {
    cart: { data: [], status: 200, message: "Success", awaiting: false },
    watchlist: { data: [], status: 200, message: "Success", awaiting: false },

    defaultData: {
        cart: generateSkeletonCart(),
    },
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

export type TRoot = {
    children?: React.ReactNode;
};

export function Root({ children }: TRoot) {
    const [headerInfo, setHeaderInfo] = useState<IRootContext["headerInfo"]>(
        defaultRootContext.headerInfo,
    );

    const [cart, setCart] = useState<IUserContext["cart"]>(defaultUserContext.cart);
    const { response: cartResponse, awaiting: awaitingCartData } = useAsync.GET(mockGetCart, [{}], {
        attemptOnMount: true,
    });
    useEffect(
        () => setCart({ ...cartResponse, awaiting: awaitingCartData }),
        [cartResponse, awaitingCartData],
    );

    const [watchlist, setWatchlist] = useState<IUserContext["watchlist"]>(
        defaultUserContext.watchlist,
    );
    const { response: watchlistResponse, awaiting: awaitingWatchlistData } = useAsync.GET(
        mockGetWatchlist,
        [{}],
        { attemptOnMount: true },
    );
    useEffect(
        () => setWatchlist({ ...watchlistResponse, awaiting: awaitingWatchlistData }),
        [watchlistResponse, awaitingWatchlistData],
    );

    return (
        <RootContext.Provider value={useMemo(() => ({ headerInfo }), [headerInfo])}>
            <UserContext.Provider
                value={useMemo(
                    () => ({ cart, watchlist, defaultData: defaultUserContext.defaultData }),
                    [cart, watchlist],
                )}
            >
                <div className={styles["page"]}>
                    <HeaderContext.Provider
                        value={useMemo(() => ({ setHeaderInfo }), [setHeaderInfo])}
                    >
                        <Header />
                        {children}
                    </HeaderContext.Provider>
                    <Outlet />
                    <Footer />
                </div>
            </UserContext.Provider>
        </RootContext.Provider>
    );
}
