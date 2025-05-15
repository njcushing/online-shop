import { useState, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import styles from "./index.module.css";

const baseVal = 0;

export type TQuantity = {
    defaultValue?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
    onChange?: (value: string) => unknown;
    onQuantityChange?: (value: number) => unknown;
    size?: "s" | "m" | "l";
};

const isInteger = (value: unknown): value is number => {
    if (typeof value === "number" && Number.isInteger(value)) {
        return true;
    }
    if (typeof value === "string" && value.trim() !== "" && Number.isInteger(Number(value))) {
        return true;
    }
    return false;
};

const deriveValue = (value: unknown, min: number | undefined, max: number | undefined): number => {
    if (!isInteger(value)) return deriveValue(baseVal, min, max);
    let val = Number(value) as number;
    if (isInteger(min)) val = Math.max(min, val);
    if (isInteger(max)) val = Math.min(max, val);
    return val;
};

export function Quantity({
    defaultValue,
    min,
    max,
    disabled,
    onChange,
    onQuantityChange,
    size = "m",
}: TQuantity) {
    const defaultValueToUse = useMemo<number>(() => {
        if (isInteger(defaultValue)) return defaultValue;
        return deriveValue(baseVal, min, max);
    }, [defaultValue, min, max]);

    const [currentValue, setCurrentValue] = useState<string>(defaultValueToUse.toString());
    const [quantity, setQuantity] = useState<number>(defaultValueToUse);

    useEffect(() => {
        const derivedNew = deriveValue(currentValue, min, max);
        if (derivedNew !== quantity) setQuantity(derivedNew);
    }, [currentValue, min, max, quantity]);

    useEffect(() => {
        if (onChange) onChange(currentValue);
    }, [onChange, currentValue]);

    useEffect(() => {
        if (onQuantityChange) onQuantityChange(quantity);
    }, [onQuantityChange, quantity]);

    const inputId = useMemo(() => uuid(), []);

    return (
        <div
            className={styles["quantity-input-container"]}
            aria-disabled={disabled}
            data-size={size}
        >
            <button
                type="button"
                aria-label="Reduce quantity"
                aria-controls={inputId}
                disabled={disabled || quantity === min}
                onClick={() => {
                    const derivedCurrent = deriveValue(currentValue, min, max);
                    if (typeof derivedCurrent === "undefined") {
                        setCurrentValue(defaultValueToUse.toString());
                    } else {
                        setCurrentValue((derivedCurrent - 1).toString());
                    }
                }}
                className={styles["decrement-button"]}
            >
                <svg width="100%" height="100%" viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            <input
                type="text"
                inputMode="numeric"
                role="spinbutton"
                aria-label="Quantity"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={quantity}
                id={inputId}
                value={currentValue}
                disabled={disabled}
                onBlur={(e) => {
                    setCurrentValue(deriveValue(quantity, min, max).toString());
                    e.preventDefault();
                }}
                onInput={(e) => {
                    let { value } = e.currentTarget;

                    // Normalize all types of dashes to standard hyphen-minus
                    value = value.replace(/[–—−]/g, "-");

                    const hasLeadingMinus = value.startsWith("-");

                    // Strip non-digit characters and dashes
                    value = value.replace(/[^0-9]/g, "");

                    // Add leading minus back if applicable
                    if (hasLeadingMinus) value = `-${value}`;

                    setCurrentValue(value);
                }}
                min={min}
                max={max}
                step={1}
                className={styles["quantity-input"]}
            />

            <button
                type="button"
                aria-label="Increase quantity"
                aria-controls={inputId}
                disabled={disabled || quantity === max}
                onClick={() => {
                    const derivedCurrent = deriveValue(currentValue, min, max);
                    if (typeof derivedCurrent === "undefined") {
                        setCurrentValue(defaultValueToUse.toString());
                    } else {
                        setCurrentValue((derivedCurrent + 1).toString());
                    }
                }}
                className={styles["increment-button"]}
            >
                <svg width="100%" height="100%" viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}
