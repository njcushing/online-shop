import { variantOptions, ProductVariantOption } from "@/utils/products/product";
import { sortSet } from "@/utils/sortSet";
import React, { useCallback, useMemo } from "react";
import styles from "./index.module.css";

export type TVariantStep = {
    id: string;
    values: Set<string>;
    selected: string;
    onClick?: (value: string) => unknown;
};

const checkOptionType = <T extends ProductVariantOption["type"]>(
    option: ProductVariantOption,
    type: T,
): option is Extract<ProductVariantOption, { type: T }> => {
    return option.type === type;
};

export function VariantStep({ id, values, selected, onClick }: TVariantStep) {
    const optionData = variantOptions.find((o) => o.id === id);

    const createGenericTextButton = useCallback(
        (value: string): React.ReactNode => {
            return (
                <button
                    type="button"
                    onClick={() => onClick && onClick(value)}
                    className={styles["product-hero-step-text-button"]}
                    data-selected={selected === value}
                    key={`variant-options-${id}-${value}`}
                >
                    {value}
                </button>
            );
        },
        [id, selected, onClick],
    );

    const items = useMemo(() => {
        if (optionData && checkOptionType(optionData, "dot")) {
            return [...values.values()].map((value) => {
                const valueData = optionData.values.find((v) => v.id === value);
                const {
                    id: valueId,
                    name,
                    dot,
                } = valueData || { id: value, name: value, dot: "rgba(0, 0, 0, 0.2)" };
                return (
                    <button
                        type="button"
                        onClick={() => onClick && onClick(valueId)}
                        className={styles["product-hero-step-dot-button"]}
                        data-selected={selected === valueId}
                        key={`variant-options-${id}-${name}`}
                    >
                        <span
                            className={styles["product-hero-step-dot"]}
                            style={{ backgroundColor: dot || "black" }}
                        ></span>
                        {name}
                    </button>
                );
            });
        }
        return [...sortSet(values).values()].map((value) => createGenericTextButton(value));
    }, [id, values, selected, onClick, optionData, createGenericTextButton]);

    return (
        <div className={styles["product-hero-step"]} key={`variant-options-${id}`}>
            <p className={styles["product-hero-step-title"]}>{optionData?.title || id}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
