import { useState, useEffect, useCallback, useMemo } from "react";
import { Accordion, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { RatingFilter } from "./components/RatingFilter";
import { StringFilter } from "./components/StringFilter";
import { NumericFilter } from "./components/NumericFilter";
import { ColorFilter } from "./components/ColorFilter";
import { SelectFilter } from "./components/SelectFilter";
import styles from "./index.module.css";

export type TCategoryProductsFilters = {
    filters: GetCategoryBySlugResponseDto["filters"];
    awaiting?: boolean;
};

export function CategoryProductsFilters({ filters, awaiting = false }: TCategoryProductsFilters) {
    const filterElements = useCallback(
        (filter: GetCategoryBySlugResponseDto["filters"][number]) => {
            const { type } = filter;

            switch (type) {
                case "string":
                    return <StringFilter data={filter} awaiting={awaiting} />;
                case "numeric":
                    return <NumericFilter data={filter} awaiting={awaiting} />;
                case "boolean":
                    return null;
                case "color":
                    return <ColorFilter data={filter} awaiting={awaiting} />;
                case "date":
                    return null;
                case "select":
                    return <SelectFilter data={filter} awaiting={awaiting} />;
                default:
                    return null;
            }
        },
        [awaiting],
    );

    const filterContainer = useCallback(
        (filterName: string, content: React.ReactNode) => {
            return (
                <Accordion.Item value={filterName} key={filterName}>
                    <Accordion.Control disabled={awaiting} opacity={1}>
                        <Skeleton visible={awaiting} width="min-content">
                            <p style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                {filterName}
                            </p>
                        </Skeleton>
                    </Accordion.Control>

                    <Accordion.Panel
                        style={{ opacity: 1 }} // Override default opacity transition
                    >
                        {content}
                    </Accordion.Panel>
                </Accordion.Item>
            );
        },
        [awaiting],
    );

    const otherFilters = useMemo(() => {
        return filterContainer("Rating", <RatingFilter awaiting={awaiting} />);
    }, [awaiting, filterContainer]);

    const generatedFilters = useMemo(() => {
        return filters.map((filter) => {
            const { name: filterName } = filter;

            return filterContainer(filterName, filterElements(filter));
        });
    }, [filters, filterElements, filterContainer]);

    const [accordionValues, setAccordionValues] = useState<Set<string>>(
        new Set(["Rating", ...filters.map((filter) => filter.name)]),
    );
    useEffect(() => {
        setAccordionValues(new Set(["Rating", ...filters.map((filter) => filter.name)]));
    }, [filters]);

    return (
        <div className={styles["category-products-filters"]}>
            <p className={styles["title"]}>Filter by</p>
            <Accordion
                multiple
                value={[...accordionValues]}
                /**
                 * Have to take manual control of setting open panels as it doesn't automatically open
                 * them when the category data is fetched
                 */
                onChange={(values) => setAccordionValues(new Set(values))}
                classNames={{
                    control: styles["Accordion-control"],
                    label: styles["Accordion-label"],
                    content: styles["Accordion-content"],
                }}
            >
                {otherFilters}
                {generatedFilters}
            </Accordion>
        </div>
    );
}
