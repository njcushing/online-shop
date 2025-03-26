import { createContext, useMemo, useState } from "react";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { Product as ProductDataType } from "@/utils/products/product";
import styles from "./index.module.css";

export interface IProductContext {
    product: { data: ProductDataType | null; awaiting: boolean; status: number; message: string };
}

const defaultProductContext: IProductContext = {
    product: { data: null, awaiting: false, status: 200, message: "Success" },
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

export function Product() {
    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );

    return (
        <ProductContext.Provider value={useMemo(() => ({ product }), [product])}>
            <div className={styles["page"]}>
                <ProductHero />
                <ProductInformation />
            </div>
        </ProductContext.Provider>
    );
}
