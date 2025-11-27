import { useContext, useState, useEffect, useCallback } from "react";
import { CategoryContext } from "@/pages/Category";
import { Accordion, Skeleton } from "@mantine/core";
import { skeletonCategory } from "@/utils/products/categories";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { customStatusCodes } from "@/api/types";
import { StringFilter } from "./components/StringFilter";
import { NumericFilter } from "./components/NumericFilter";
import { ColorFilter } from "./components/ColorFilter";
import { SelectFilter } from "./components/SelectFilter";
import styles from "./index.module.css";

export function CategoryProductsFilters() {
    const { categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "category", context: categoryData }],
    });

    if (!contextAwaitingAny) {
        if (data.category) category = data.category;
    }

    const awaitingAny =
        contextAwaitingAny || categoryData.response.status === customStatusCodes.unattempted;

    const { filters } = category;

    const filterElements = useCallback(
        (filter: GetCategoryBySlugResponseDto["filters"][number]) => {
            const { type } = filter;

            switch (type) {
                case "string":
                    return <StringFilter data={filter} awaiting={awaitingAny} />;
                case "numeric":
                    return <NumericFilter data={filter} awaiting={awaitingAny} />;
                case "boolean":
                    return null;
                case "color":
                    return <ColorFilter data={filter} awaiting={awaitingAny} />;
                case "date":
                    return null;
                case "select":
                    return <SelectFilter data={filter} awaiting={awaitingAny} />;
                default:
                    return null;
            }
        },
        [awaitingAny],
    );

    const [accordionValues, setAccordionValues] = useState<Set<string>>(
        new Set(filters.map((filter) => filter.name)),
    );
    useEffect(() => {
        setAccordionValues(new Set(filters.map((filter) => filter.name)));
    }, [filters]);

    return (
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
            {filters.map((filter) => {
                const { name: filterName } = filter;

                return (
                    <Accordion.Item value={filterName} key={filterName}>
                        <Accordion.Control disabled={awaitingAny} opacity={1}>
                            <Skeleton visible={awaitingAny} width="min-content">
                                <p style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                                    {filterName}
                                </p>
                            </Skeleton>
                        </Accordion.Control>

                        <Accordion.Panel
                            style={{ opacity: 1 }} // Override default opacity transition
                        >
                            {filterElements(filter)}
                        </Accordion.Panel>
                    </Accordion.Item>
                );
            })}
        </Accordion>
    );
}
