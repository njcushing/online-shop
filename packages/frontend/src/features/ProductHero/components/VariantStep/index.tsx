import { useContext, useCallback, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { Checkbox } from "@mantine/core";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import styles from "./index.module.css";

export type TVariantStep = {
    attribute: GetProductBySlugResponseDto["attributes"][number];
};

export function VariantStep({ attribute }: TVariantStep) {
    const { name, title, type, values } = attribute;

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
        switch (type) {
            case "text":
            case "numeric":
            case "date":
            case "select": {
                return values.map((v) => {
                    const { code, name: valueName } = v;

                    const isSelected =
                        name in selectedAttributeParams && selectedAttributeParams[name] === code;

                    return (
                        <button
                            type="button"
                            onClick={() => onClick && onClick(code)}
                            className={styles["variant-step-text"]}
                            data-selected={isSelected}
                            tabIndex={isSelected ? -1 : 0}
                            disabled={isSelected}
                            key={`variant-options-${name}-${code}`}
                        >
                            {valueName}
                        </button>
                    );
                });
            }
            case "color": {
                return values.map((v) => {
                    const { code, name: valueName, value } = v;

                    const isSelected =
                        name in selectedAttributeParams && selectedAttributeParams[name] === code;

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
                });
            }
            default:
                return null;
        }
    }, [values, name, type, selectedAttributeParams, onClick]);

    const content = useMemo(() => {
        if (type === "boolean") {
            const isSelected =
                name in selectedAttributeParams && selectedAttributeParams[name] === "true";

            return (
                <Checkbox
                    label={<p className={styles["variant-step-title"]}>{name}</p>}
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
    }, [name, title, type, selectedAttributeParams, onClick, items]);

    return (
        <div className={styles["variant-step"]} key={`variant-options-${name}`}>
            {content}
        </div>
    );
}
