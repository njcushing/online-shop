import { useContext, useState, useEffect, useCallback } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { Radio, Rating } from "@mantine/core";
import { isNumeric } from "@/utils/isNumeric";
import styles from "./index.module.css";

export type TRatingFilter = {
    awaiting?: boolean;
};

export function RatingFilter({ awaiting = false }: TRatingFilter) {
    const { filterSelections, setFilterSelections } = useContext(CategoryProductListContext);

    const getSelected = useCallback(() => {
        const rating = filterSelections.get("Rating");
        if (!rating || rating.type !== "select" || !isNumeric(rating.value)) return 1;
        return Number(rating.value);
    }, [filterSelections]);
    const [selected, setSelected] = useState<number>(getSelected());
    useEffect(() => setSelected(getSelected()), [getSelected]);

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
                    onChange={() => {
                        setFilterSelections((curr) => {
                            const newSelections = new Map(curr);
                            const validValue = tier > 1;
                            if (!validValue) {
                                if (newSelections.has("Rating")) newSelections.delete("Rating");
                            } else
                                newSelections.set("Rating", {
                                    type: "select",
                                    value: `${tier}`,
                                });
                            return newSelections;
                        });
                    }}
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
        [awaiting, setFilterSelections, selected],
    );

    return (
        <span className={styles["filter-rating"]} data-disabled={awaiting}>
            {createRatingOption(5, "only")}
            {createRatingOption(4, "& above")}
            {createRatingOption(3, "& above")}
            {createRatingOption(2, "& above")}
            {createRatingOption(1, "& above")}
        </span>
    );
}
