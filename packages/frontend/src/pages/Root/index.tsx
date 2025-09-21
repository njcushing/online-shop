import { createContext, useState, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ConsentBanner } from "@/features/ConsentBanner";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { generateSkeletonCart, PopulatedCart } from "@/utils/products/cart";
import { mockGetUser, mockGetCart, mockGetOrders, mockGetSubscriptions } from "@/api/mocks";
import { Consent } from "@/utils/schemas/consent";
import { RecursivePartial } from "@/utils/types";
import * as useAsync from "@/hooks/useAsync";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import { generateSkeletonOrderList, PopulatedOrderData } from "@/utils/products/orders";
import {
    generateSkeletonSubscriptionList,
    PopulatedSubscriptionData,
} from "@/utils/products/subscriptions";
import { User, defaultUser } from "@/utils/schemas/user";
import { CheckoutShippingOption } from "@/utils/schemas/checkout";
import { Home } from "../Home";
import { Category } from "../Category";
import { Product } from "../Product";
import { Cart } from "../Cart";
import { Checkout } from "../Checkout";
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
        path: "cart",
        element: <Cart />,
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
    shipping: {
        value: CheckoutShippingOption;
        setter: React.Dispatch<React.SetStateAction<CheckoutShippingOption>>;
    };

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
    shipping: { value: "express", setter: () => {} },

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
    const location = useLocation();
    const { pathname } = location;
    const HeaderDisableActivity = pathname === "/cart" || pathname === "/checkout";
    const HeaderFooterReduced = pathname === "/cart" || pathname === "/checkout";

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

    const [shipping, setShipping] = useState<CheckoutShippingOption>(
        defaultUserContext.shipping.value,
    );

    return (
        <RootContext.Provider value={useMemo(() => ({ headerInfo }), [headerInfo])}>
            <UserContext.Provider
                value={useMemo(
                    () => ({
                        user,
                        cart,
                        orders,
                        subscriptions,
                        shipping: { value: shipping, setter: setShipping },

                        defaultData: defaultUserContext.defaultData,
                    }),
                    [user, cart, orders, subscriptions, shipping],
                )}
            >
                <div className={styles["page"]}>
                    {!user.response.data?.consent.cookies && <ConsentBanner />}
                    <HeaderContext.Provider
                        value={useMemo(() => ({ setHeaderInfo }), [setHeaderInfo])}
                    >
                        <Header
                            disableActivity={HeaderDisableActivity}
                            reduced={HeaderFooterReduced}
                        />
                        {children}
                    </HeaderContext.Provider>
                    <Outlet />
                    <Footer reduced={HeaderFooterReduced} />
                </div>
            </UserContext.Provider>
        </RootContext.Provider>
    );
}
