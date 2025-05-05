import { createContext, useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { mockGetCart } from "@/api/cart";
import { FuncResponseObject } from "@/api/types";
import { Product as ProductDataType, ProductVariant } from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";
import * as useAsync from "@/hooks/useAsync";
import { v4 as uuid } from "uuid";
import { Home } from "../Home";
import { Category } from "../Category";
import { Product } from "../Product";
import { ErrorPage } from "../ErrorPage";
import styles from "./index.module.css";

const createDefaultProductData = (): RecursivePartial<ProductDataType> => ({
    name: { full: "Product Name" },
    images: { thumb: { src: "", alt: "" } },
    variantOptionOrder: ["option"],
    allowance: 100,
});

const createDefaultProductVariantData = (): RecursivePartial<ProductVariant> => ({
    id: uuid(),
    name: "Variant Name",
    price: { base: 1000, current: 1000 },
    options: { option: "value" },
    stock: 100,
});

const defaultCartData: RecursivePartial<PopulatedCartItemData>[] = Array.from({ length: 5 }).map(
    () => ({
        product: createDefaultProductData(),
        variant: createDefaultProductVariantData(),
        quantity: 1,
    }),
);

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

    defaultData: {
        cart: RecursivePartial<PopulatedCartItemData>[];
    };
}

const defaultUserContext: IUserContext = {
    cart: { data: [], status: 200, message: "Success", awaiting: false },

    defaultData: {
        cart: defaultCartData,
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

export function Root() {
    const [headerInfo, setHeaderInfo] = useState<IRootContext["headerInfo"]>(
        defaultRootContext.headerInfo,
    );

    const [cart, setCart] = useState<IUserContext["cart"]>(defaultUserContext.cart);
    const { response, awaiting } = useAsync.GET(mockGetCart, [{}], { attemptOnMount: true });
    useEffect(() => setCart({ ...response, awaiting }), [response, awaiting]);

    return (
        <RootContext.Provider value={useMemo(() => ({ headerInfo }), [headerInfo])}>
            <UserContext.Provider
                value={useMemo(
                    () => ({ cart, defaultData: defaultUserContext.defaultData }),
                    [cart],
                )}
            >
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
