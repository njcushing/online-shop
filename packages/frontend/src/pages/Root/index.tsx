import { createContext, useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { generateSkeletonCart, PopulatedCartItemData } from "@/utils/products/cart";
import {
    mockGetAccountDetails,
    mockGetCart,
    mockGetOrders,
    mockGetSubscriptions,
    mockGetWatchlist,
} from "@/api/mocks";
import { RecursivePartial } from "@/utils/types";
import * as useAsync from "@/hooks/useAsync";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import { generateSkeletonOrderList, PopulatedOrderData } from "@/utils/products/orders";
import {
    generateSkeletonSubscriptionList,
    PopulatedSubscriptionData,
} from "@/utils/products/subscriptions";
import { AccountDetails, defaultAccountDetails } from "@/utils/schemas/account";
import { DeepRequired } from "react-hook-form";
import { Home } from "../Home";
import { Category } from "../Category";
import { Product } from "../Product";
import { Account, Routes as AccountRoutes } from "../Account";
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
    {
        path: "account",
        element: <Account />,
        children: AccountRoutes,
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
    cart: useAsync.UseAsyncReturnType;
    watchlist: useAsync.UseAsyncReturnType;
    orders: useAsync.UseAsyncReturnType;
    subscriptions: useAsync.UseAsyncReturnType;
    accountDetails: useAsync.UseAsyncReturnType;

    defaultData: {
        cart: RecursivePartial<PopulatedCartItemData>[];
        accountDetails: DeepRequired<AccountDetails>;
        orders: RecursivePartial<PopulatedOrderData>[];
        subscriptions: RecursivePartial<PopulatedSubscriptionData>[];
    };
}

const defaultUserContext: IUserContext = {
    cart: createQueryContextObject(),
    watchlist: createQueryContextObject(),
    orders: createQueryContextObject(),
    subscriptions: createQueryContextObject(),
    accountDetails: createQueryContextObject(),

    defaultData: {
        cart: generateSkeletonCart(),
        accountDetails: defaultAccountDetails,
        orders: generateSkeletonOrderList(),
        subscriptions: generateSkeletonSubscriptionList(),
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
    const getCartReturn = useAsync.GET(mockGetCart, [{}], { attemptOnMount: true });
    useEffect(() => setCart(getCartReturn), [getCartReturn]);

    const [watchlist, setWatchlist] = useState<IUserContext["watchlist"]>(
        defaultUserContext.watchlist,
    );
    const getWatchlistReturn = useAsync.GET(mockGetWatchlist, [{}], { attemptOnMount: true });
    useEffect(() => setWatchlist(getWatchlistReturn), [getWatchlistReturn]);

    const [orders, setOrders] = useState<IUserContext["orders"]>(defaultUserContext.orders);
    const getOrdersReturn = useAsync.GET(mockGetOrders, [{}], { attemptOnMount: true });
    useEffect(() => setOrders(getOrdersReturn), [getOrdersReturn]);

    const [subscriptions, setSubscriptions] = useState<IUserContext["subscriptions"]>(
        defaultUserContext.subscriptions,
    );
    const subscriptionsReturn = useAsync.GET(mockGetSubscriptions, [{}], { attemptOnMount: true });
    useEffect(() => setSubscriptions(subscriptionsReturn), [subscriptionsReturn]);

    const [accountDetails, setAccountDetails] = useState<IUserContext["accountDetails"]>(
        defaultUserContext.accountDetails,
    );
    const accountDetailsReturn = useAsync.GET(mockGetAccountDetails, [{}], {
        attemptOnMount: true,
    });
    useEffect(() => setAccountDetails(accountDetailsReturn), [accountDetailsReturn]);

    return (
        <RootContext.Provider value={useMemo(() => ({ headerInfo }), [headerInfo])}>
            <UserContext.Provider
                value={useMemo(
                    () => ({
                        cart,
                        watchlist,
                        orders,
                        subscriptions,
                        accountDetails,

                        defaultData: defaultUserContext.defaultData,
                    }),
                    [cart, watchlist, orders, subscriptions, accountDetails],
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
