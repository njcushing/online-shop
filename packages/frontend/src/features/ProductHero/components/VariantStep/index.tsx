import React, { useContext, useCallback, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { variantOptions, ProductVariantOption } from "@/utils/products/product";
import { sortSet } from "@/utils/sortSet";
import styles from "./index.module.css";

export type TVariantStep = {
    id: string;
    values: Set<string>;
    selected: string;
    preventSort?: boolean;
};

const checkOptionType = <T extends ProductVariantOption["type"]>(
    optionData: ProductVariantOption | undefined,
    type: T,
): optionData is Extract<ProductVariantOption, { type: T }> => {
    return optionData ? optionData.type === type : false;
};

const sortValues = (values: Set<string>, optionData: ProductVariantOption): Set<string> => {
    const valueIds = new Map(optionData.values.map((item, i) => [item.id, i]));
    const specifiedIds = new Set<string>();
    const unspecifiedIds = new Set<string>();

    values.forEach((value) => (valueIds.has(value) ? specifiedIds : unspecifiedIds).add(value));

    const sortedSpecifiedIds = Array.from(specifiedIds).sort(
        (a, b) => valueIds.get(a)! - valueIds.get(b)!,
    );

    return new Set([...sortedSpecifiedIds, ...sortSet(unspecifiedIds)]);
};

export function VariantStep({ id, values, selected, preventSort }: TVariantStep) {
    const { selectedVariantOptions, setSelectedVariantOptions } = useContext(ProductContext);

    const optionData = variantOptions.find((o) => o.id === id);

    const onClick = useCallback(
        (value: string) => {
            const newselectedVariantOptions = {
                ...selectedVariantOptions,
            };
            newselectedVariantOptions[id] = value;
            setSelectedVariantOptions(newselectedVariantOptions);
        },
        [id, selectedVariantOptions, setSelectedVariantOptions],
    );

    const itemClassName = useMemo(() => {
        if (checkOptionType(optionData, "dot")) return "product-hero-step-dot-button";
        return "product-hero-step-text-button";
    }, [optionData]);

    const itemButtonContent = useCallback(
        (valueData: ProductVariantOption["values"][number] | undefined) => {
            if (valueData) {
                if (checkOptionType(optionData, "dot")) {
                    const dot =
                        (valueData as (typeof optionData)["values"][number]).dot ??
                        "rgba(0, 0, 0, 0.2)";

                    return (
                        <span
                            className={styles["product-hero-step-dot"]}
                            style={{ backgroundColor: dot }}
                        ></span>
                    );
                }
            }
            return null;
        },
        [optionData],
    );

    const items = useMemo(() => {
        const sortedValues = !optionData || preventSort ? values : sortValues(values, optionData);
        return [...sortedValues.values()].map((value) => {
            const valueData = optionData?.values.find((v) => v.id === value);
            const { id: valueId, name } = valueData || { id: value, name: value };

            const isSelected = selected === valueId;

            return (
                <button
                    type="button"
                    onClick={() => onClick && onClick(valueId)}
                    className={styles[itemClassName]}
                    data-selected={isSelected}
                    tabIndex={isSelected ? -1 : 0}
                    disabled={isSelected}
                    key={`variant-options-${id}-${name}`}
                >
                    {itemButtonContent(valueData)}
                    {name}
                </button>
            );
        });
    }, [id, values, selected, preventSort, onClick, optionData, itemClassName, itemButtonContent]);

    return (
        <div className={styles["product-hero-step"]} key={`variant-options-${id}`}>
            <p className={styles["product-hero-step-title"]}>{optionData?.title || id}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
