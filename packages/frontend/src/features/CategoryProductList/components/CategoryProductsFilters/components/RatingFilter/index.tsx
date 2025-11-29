import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Radio, Rating } from "@mantine/core";
import styles from "./index.module.css";

const isNumeric = (str: string): boolean => {
    if (typeof str !== "string") return false;
    return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
};

export type TRatingFilter = {
    awaiting?: boolean;
    onChange?: (rating: number | null) => void;
};

export function RatingFilter({ awaiting = false, onChange }: TRatingFilter) {
    const [searchParams] = useSearchParams();

    const [selected, setSelected] = useState<number>(
        (() => {
            if (searchParams.has("Rating") && searchParams.get("Rating")) {
                const rating = searchParams.get("Rating")!;
                if (isNumeric(rating)) return Number(rating);
            }
            return 1;
        })(),
    );
    useEffect(() => {
        if (onChange) onChange(selected > 1 ? selected : null);
    }, [onChange, selected]);

    const createRatingOption = useCallback(
        (tier: number, supplementaryText: string) => {
            return (
                <Radio
                    value={tier}
                    label={
                        <div className={styles["radio-label-left"]}>
                            <Rating
                                classNames={{ starSymbol: styles["Rating-star-symbol"] }}
                                readOnly
                                count={5}
                                fractions={1}
                                value={tier}
                                color="gold"
                                size="md"
                            />
                            <p>{supplementaryText}</p>
                        </div>
                    }
                    onChange={() => setSelected(tier)}
                    checked={selected === tier}
                    disabled={awaiting}
                    classNames={{
                        root: styles["radio-root"],
                        body: styles["radio-body"],
                        radio: styles["radio"],
                        label: styles["radio-label"],
                    }}
                    key={tier}
                />
            );
        },
        [awaiting, selected],
    );

    return (
        <span className={styles["filter-rating"]} data-disabled={awaiting}>
            {createRatingOption(5, "& only")}
            {createRatingOption(4, "& above")}
            {createRatingOption(3, "& above")}
            {createRatingOption(2, "& above")}
            {createRatingOption(1, "& above")}
        </span>
    );
}
