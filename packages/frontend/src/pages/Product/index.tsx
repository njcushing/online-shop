import { createContext, useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { Product as ProductDataType } from "@/utils/products/product";
import { mockGetProductDataFromSlug } from "@/api/product";
import styles from "./index.module.css";

export interface IProductContext {
    product: { data: ProductDataType | null; awaiting: boolean; status: number; message: string };
}

const defaultProductContext: IProductContext = {
    product: { data: null, awaiting: false, status: 200, message: "Success" },
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

export function Product() {
    const params = useParams();
    const { productSlug } = params;

    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );

    const getProductDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        const fetchCart = async (slug: string) => {
            // Simulate API request delay
            await new Promise((resolve) => {
                getProductDataTimeoutRef.current = setTimeout(resolve, 1000);
            });

            getProductDataTimeoutRef.current = null;

            const response = {
                data: mockGetProductDataFromSlug(slug),
                awaiting: false,
                status: 200,
                message: "Success",
            };

            setProduct(response);
        };

        if (productSlug) {
            fetchCart(productSlug);
        } else {
            if (getProductDataTimeoutRef.current) {
                clearTimeout(getProductDataTimeoutRef.current);
                getProductDataTimeoutRef.current = null;
            }
            setProduct(defaultProductContext.product);
        }

        return () => {
            if (getProductDataTimeoutRef.current) {
                clearTimeout(getProductDataTimeoutRef.current);
            }
        };
    }, [productSlug]);

    return (
        <ProductContext.Provider value={useMemo(() => ({ product }), [product])}>
            <div className={styles["page"]}>
                <ProductHero />
                <ProductInformation />
            </div>
        </ProductContext.Provider>
    );
}
