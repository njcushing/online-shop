import { useContext, useState, useEffect, useCallback } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { Radio, Rating } from "@mantine/core";
import styles from "./index.module.css";

const isNumeric = (str: string): boolean => {
    if (typeof str !== "string") return false;
    return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
};

export type TRatingFilter = {
    awaiting?: boolean;
};

export function RatingFilter({ awaiting = false }: TRatingFilter) {
    const { filterSelections, setFilterSelections } = useContext(CategoryProductListContext);

    const [selected, setSelected] = useState<number>(
        (() => {
            const rating = filterSelections.get("Rating");
            if (rating && typeof rating === "string" && isNumeric(rating)) {
                return Number(rating);
            }
            return 1;
        })(),
    );
    useEffect(() => {
        setFilterSelections((curr) => {
            const newSelections = new Map(curr);
            const validValue = selected > 1;
            if (!validValue) {
                if (newSelections.has("Rating")) newSelections.delete("Rating");
            } else newSelections.set("Rating", `${selected}`);
            return newSelections;
        });
    }, [setFilterSelections, selected]);

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
