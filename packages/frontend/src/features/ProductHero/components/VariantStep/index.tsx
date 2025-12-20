import { useContext, useCallback, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import styles from "./index.module.css";

export type TVariantStep = {
    attribute: GetProductBySlugResponseDto["attributes"][number];
};

export function VariantStep({ attribute }: TVariantStep) {
    const { name, type, values } = attribute;

    const { selectedAttributeParams, setSelectedAttributeParams } = useContext(ProductContext);

    const onClick = useCallback(
        (code: string) => {
            const newSelectedAttributeParams = { ...selectedAttributeParams };
            newSelectedAttributeParams[name] = code;
            setSelectedAttributeParams(newSelectedAttributeParams);
        },
        [name, selectedAttributeParams, setSelectedAttributeParams],
    );

    const items = useMemo(() => {
        return values.map((v) => {
            const { code, name: valueName, value } = v;

            const isSelected =
                name in selectedAttributeParams && selectedAttributeParams[name] === code;

            switch (type) {
                case "color": {
                    return (
                        <button
                            type="button"
                            onClick={() => onClick && onClick(code)}
                            className={styles["variant-step-color"]}
                            data-selected={isSelected}
                            tabIndex={isSelected ? -1 : 0}
                            disabled={isSelected}
                            key={`variant-options-${name}-${code}`}
                        >
                            <span
                                className={styles["variant-step-color-box"]}
                                style={{ backgroundColor: value }}
                            ></span>
                            {valueName}
                        </button>
                    );
                }
                default:
                    return null;
            }
        });
    }, [values, name, type, selectedAttributeParams, onClick]);

    return (
        <div className={styles["variant-step"]} key={`variant-options-${name}`}>
            <p className={styles["variant-step-title"]}>{attribute.title}</p>
            <div className={styles["variant-step-options"]}>{items}</div>
        </div>
    );
}
