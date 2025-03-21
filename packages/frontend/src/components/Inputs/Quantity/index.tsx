import { useState, useEffect } from "react";
import styles from "./index.module.css";

export type TQuantity = {
    min?: number;
    max?: number;
    disabled?: boolean;
    onChange?: (value: number | null) => unknown;
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

export function Quantity({ min, max, disabled, onChange }: TQuantity) {
    const [quantity, setQuantity] = useState<number | null>(isInteger(min) ? min : 0);

    useEffect(() => {
        if (onChange) onChange(quantity);
    }, [onChange, quantity]);

    return (
        <div className={styles["quantity-input-container"]} aria-disabled={disabled}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (isInteger(quantity)) {
                        setQuantity(isInteger(min) ? Math.max(min, quantity - 1) : quantity - 1);
                    } else {
                        setQuantity(isInteger(min) ? min : 0);
                    }
                }}
                className={styles["decrement-button"]}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            <input
                type="number"
                value={quantity === null ? "" : quantity}
                disabled={disabled}
                onBlur={(e) => {
                    const value = e.currentTarget.value.trim();
                    if (!isInteger(value)) {
                        setQuantity(min || 0);
                    } else {
                        let newQuantity = Number(value);
                        if (min) newQuantity = Math.max(min, newQuantity);
                        if (max) newQuantity = Math.min(max, newQuantity);
                        setQuantity(newQuantity);
                    }
                    e.preventDefault();
                }}
                onChange={(e) => {
                    const { value } = e.currentTarget;
                    if (value === "" || /^\d+$/.test(value)) {
                        setQuantity(value === "" ? null : Number.parseInt(value, 10));
                    }
                }}
                onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                }}
                onPaste={(e) => {
                    if (!/^\d+$/.test(e.clipboardData.getData("text"))) {
                        e.preventDefault();
                    }
                }}
                min={min}
                max={max}
                step={1}
                className={styles["quantity-input"]}
            />

            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (isInteger(quantity)) {
                        setQuantity(isInteger(max) ? Math.min(max, quantity + 1) : quantity + 1);
                    } else {
                        setQuantity(isInteger(min) ? min : 0);
                    }
                }}
                className={styles["increment-button"]}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}
