import { useContext, useCallback, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { Checkbox } from "@mantine/core";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import styles from "./index.module.css";

export type TVariantStep = {
    attribute: GetProductBySlugResponseDto["attributes"][number];
};

export function VariantStep({ attribute }: TVariantStep) {
    const { code, title, type, values } = attribute;

    const { selectedAttributeParams, setSelectedAttributeParams } = useContext(ProductContext);

    const onClick = useCallback(
        (valueCode: string) => {
            const newSelectedAttributeParams = new Map(selectedAttributeParams);
            newSelectedAttributeParams.set(code, valueCode);
            setSelectedAttributeParams(newSelectedAttributeParams);
        },
        [code, selectedAttributeParams, setSelectedAttributeParams],
    );

    const items = useMemo(() => {
        switch (type) {
            case "text":
            case "numeric":
            case "date":
            case "select": {
                return values.map((v) => {
                    const { code: valueCode, name: valueName } = v;

                    const isSelected =
                        selectedAttributeParams.has(code) &&
                        selectedAttributeParams.get(code) === valueCode;

                    return (
                        <button
                            type="button"
                            onClick={() => onClick && onClick(valueCode)}
                            className={styles["variant-step-text"]}
                            data-selected={isSelected}
                            tabIndex={isSelected ? -1 : 0}
                            disabled={isSelected}
                            key={`variant-options-${code}-${valueCode}`}
                        >
                            {valueName}
                        </button>
                    );
                });
            }
            case "color": {
                return values.map((v) => {
                    const { code: valueCode, name: valueName, value } = v;

                    const isSelected =
                        selectedAttributeParams.has(code) &&
                        selectedAttributeParams.get(code) === valueCode;

                    return (
                        <button
                            type="button"
                            onClick={() => onClick && onClick(valueCode)}
                            className={styles["variant-step-color"]}
                            data-selected={isSelected}
                            tabIndex={isSelected ? -1 : 0}
                            disabled={isSelected}
                            key={`variant-options-${code}-${valueCode}`}
                        >
                            <span
                                className={styles["variant-step-color-box"]}
                                style={{ backgroundColor: value }}
                            ></span>
                            {valueName}
                        </button>
                    );
                });
            }
            default:
                return null;
        }
    }, [values, code, type, selectedAttributeParams, onClick]);

    const content = useMemo(() => {
        if (type === "boolean") {
            const isSelected =
                code in selectedAttributeParams && selectedAttributeParams.get(code) === "true";

            return (
                <Checkbox
                    label={<p className={styles["variant-step-title"]}>{code}</p>}
                    onChange={() => onClick && onClick(isSelected ? "false" : "true")}
                    checked={isSelected}
                    data-selected={isSelected}
                    className={styles["variant-step-boolean"]}
                    classNames={{
                        root: styles["checkbox-root"],
                        body: styles["checkbox-body"],
                        input: styles["checkbox-input"],
                        label: styles["checkbox-label"],
                    }}
                />
            );
        }

        return (
            <>
                <p className={styles["variant-step-title"]}>{title}</p>
                <div className={styles["variant-step-options"]}>{items}</div>
            </>
        );
    }, [code, title, type, selectedAttributeParams, onClick, items]);

    return (
        <div className={styles["variant-step"]} key={`variant-options-${code}`}>
            {content}
        </div>
    );
}
