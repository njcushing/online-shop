import { createContext, useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { generateSkeletonCart, PopulatedCart } from "@/utils/products/cart";
import { mockGetUser, mockGetCart, mockGetOrders, mockGetSubscriptions } from "@/api/mocks";
import { RecursivePartial } from "@/utils/types";
import * as useAsync from "@/hooks/useAsync";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import { generateSkeletonOrderList, PopulatedOrderData } from "@/utils/products/orders";
import {
    generateSkeletonSubscriptionList,
    PopulatedSubscriptionData,
} from "@/utils/products/subscriptions";
import { User, defaultUser } from "@/utils/schemas/user";
import { Home } from "../Home";
import { Category } from "../Category";
import { Product } from "../Product";
import { Account, Routes as AccountRoutes } from "../Account";
import { ErrorPage } from "../ErrorPage";
import styles from "./index.module.css";
import { Checkout } from "../Checkout";

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
        path: "checkout",
        element: <Checkout />,
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
    user: useAsync.InferUseAsyncReturnTypeFromFunction<typeof mockGetUser>;
    cart: useAsync.InferUseAsyncReturnTypeFromFunction<typeof mockGetCart>;
    orders: useAsync.InferUseAsyncReturnTypeFromFunction<typeof mockGetOrders>;
    subscriptions: useAsync.InferUseAsyncReturnTypeFromFunction<typeof mockGetSubscriptions>;

    defaultData: {
        user: User;
        cart: RecursivePartial<PopulatedCart>;
        orders: RecursivePartial<PopulatedOrderData>[];
        subscriptions: RecursivePartial<PopulatedSubscriptionData>[];
    };
}

const defaultUserContext: IUserContext = {
    user: createQueryContextObject({ awaiting: true }),
    cart: createQueryContextObject({ awaiting: true }),
    orders: createQueryContextObject(),
    subscriptions: createQueryContextObject(),

    defaultData: {
        user: defaultUser,
        cart: generateSkeletonCart(),
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

    const [user, setUser] = useState<IUserContext["user"]>(defaultUserContext.user);
    const userReturn = useAsync.GET(mockGetUser, [{}], { attemptOnMount: true });
    useEffect(() => setUser(userReturn), [userReturn]);

    const [cart, setCart] = useState<IUserContext["cart"]>(defaultUserContext.cart);
    const getCartReturn = useAsync.GET(mockGetCart, [{}], { attemptOnMount: true });
    useEffect(() => setCart(getCartReturn), [getCartReturn]);

    const [orders, setOrders] = useState<IUserContext["orders"]>(defaultUserContext.orders);
    const getOrdersReturn = useAsync.GET(mockGetOrders, [{}], { attemptOnMount: false });
    useEffect(() => setOrders(getOrdersReturn), [getOrdersReturn]);

    const [subscriptions, setSubscriptions] = useState<IUserContext["subscriptions"]>(
        defaultUserContext.subscriptions,
    );
    const subscriptionsReturn = useAsync.GET(mockGetSubscriptions, [{}], { attemptOnMount: false });
    useEffect(() => setSubscriptions(subscriptionsReturn), [subscriptionsReturn]);

    return (
        <RootContext.Provider value={useMemo(() => ({ headerInfo }), [headerInfo])}>
            <UserContext.Provider
                value={useMemo(
                    () => ({
                        user,
                        cart,
                        orders,
                        subscriptions,

                        defaultData: defaultUserContext.defaultData,
                    }),
                    [user, cart, orders, subscriptions],
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
