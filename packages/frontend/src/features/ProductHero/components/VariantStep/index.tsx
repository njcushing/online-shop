import { variantOptions, ProductVariantOption } from "@/utils/products/product";
import { useMemo } from "react";
import styles from "./index.module.css";

export type TVariantStep = {
    id: string;
    values: Set<string>;
    onClick?: (value: string) => unknown;
};

const checkOptionType = <T extends ProductVariantOption["type"]>(
    option: ProductVariantOption,
    type: T,
): option is Extract<ProductVariantOption, { type: T }> => {
    return option.type === type;
};

export function VariantStep({ id, values, onClick }: TVariantStep) {
    const optionData = variantOptions.find((o) => o.id === id);

    const items = useMemo(() => {
        if (optionData && checkOptionType(optionData, "dot")) {
            return [...optionData.values].map((value) => {
                return (
                    <button
                        type="button"
                        onClick={() => onClick && onClick(value.id)}
                        className={styles["product-hero-step-dot-button"]}
                        key={`variant-options-${id}-${value.name}`}
                    >
                        <span
                            className={styles["product-hero-step-dot"]}
                            style={{ backgroundColor: value.dot }}
                        ></span>
                        {value.name}
                    </button>
                );
            });
        }
        return null;
    }, [id, onClick, optionData]);

    return (
        <div className={styles["product-hero-step"]} key={`variant-options-${id}`}>
            <p className={styles["product-hero-step-title"]}>{optionData?.title || id}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
