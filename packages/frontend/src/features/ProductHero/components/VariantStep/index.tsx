import { useContext, useCallback, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { extractAttributesOrdered } from "@/utils/products/product";
import styles from "./index.module.css";

export type TVariantStep = {
    attribute: ReturnType<typeof extractAttributesOrdered>[number];
};

export function VariantStep({ attribute }: TVariantStep) {
    const { info, values } = attribute;

    const { selectedAttributeParams, setSelectedAttributeParams } = useContext(ProductContext);

    const onClick = useCallback(
        (code: string) => {
            const newSelectedAttributeParams = { ...selectedAttributeParams };
            newSelectedAttributeParams[info.name] = code;
            setSelectedAttributeParams(newSelectedAttributeParams);
        },
        [info.name, selectedAttributeParams, setSelectedAttributeParams],
    );

    const items = useMemo(() => {
        return values.map((value) => {
            const { code, name } = value;

            const isSelected =
                info.name in selectedAttributeParams && selectedAttributeParams[info.name] === code;

            return (
                <button
                    type="button"
                    onClick={() => onClick && onClick(code)}
                    className={styles["product-hero-step-dot-button"]}
                    data-selected={isSelected}
                    tabIndex={isSelected ? -1 : 0}
                    disabled={isSelected}
                    key={`variant-options-${info.name}-${code}`}
                >
                    <span
                        className={styles["product-hero-step-dot"]}
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                    ></span>
                    {name}
                </button>
            );
        });
    }, [info.name, values, selectedAttributeParams, onClick]);

    return (
        <div className={styles["product-hero-step"]} key={`variant-options-${info.name}`}>
            <p className={styles["product-hero-step-title"]}>{info.title}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
