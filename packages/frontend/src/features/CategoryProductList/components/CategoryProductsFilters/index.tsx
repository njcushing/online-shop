import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
    Accordion,
    Divider,
    Skeleton,
    FocusTrap,
    RemoveScroll,
    Button,
    Collapse,
} from "@mantine/core";
import { RootContext } from "@/pages/Root";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { List, X } from "@phosphor-icons/react";
import { RatingFilter } from "./components/RatingFilter";
import { PriceFilter } from "./components/PriceFilter";
import { StringFilter } from "./components/StringFilter";
import { NumericFilter } from "./components/NumericFilter";
import { ColorFilter } from "./components/ColorFilter";
import { SelectFilter } from "./components/SelectFilter";
import styles from "./index.module.css";

export type TCategoryProductsFilters = {
    layout?: "dropdown" | "visible";
    filters: GetCategoryBySlugResponseDto["filters"];
    awaiting?: boolean;
};

export function CategoryProductsFilters({
    layout = "visible",
    filters,
    awaiting = false,
}: TCategoryProductsFilters) {
    const { headerInfo } = useContext(RootContext);

    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        if (layout === "dropdown" && open) window.scrollTo(0, 0);
    }, [layout, open]);

    const filterElements = useCallback(
        (filter: GetCategoryBySlugResponseDto["filters"][number]) => {
            const { type } = filter;

            switch (type) {
                case "text":
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
                        <Skeleton visible={awaiting}>
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
        return (
            <>
                {filterContainer("Rating", <RatingFilter awaiting={awaiting} />)}
                {filterContainer("Price", <PriceFilter awaiting={awaiting} />)}
            </>
        );
    }, [awaiting, filterContainer]);

    const generatedFilters = useMemo(() => {
        return filters.map((filter) => {
            const { name: filterName } = filter;

            return filterContainer(filterName, filterElements(filter));
        });
    }, [filters, filterElements, filterContainer]);

    const [accordionValues, setAccordionValues] = useState<Set<string>>(new Set());
    useEffect(() => {
        setAccordionValues(new Set(["Rating", "Price", ...filters.map((filter) => filter.name)]));
    }, [awaiting, filters]);

    const content = useMemo(() => {
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
                    root: styles["Accordion-root"],
                    item: styles["Accordion-item"],
                    control: styles["Accordion-control"],
                    label: styles["Accordion-label"],
                    content: styles["Accordion-content"],
                }}
            >
                {otherFilters}
                {generatedFilters}
            </Accordion>
        );
    }, [otherFilters, generatedFilters, accordionValues]);

    if (layout === "visible") {
        return (
            <div
                // Don't test element positioning
                /* v8 ignore start */

                className={styles["category-products-filters"]}
                data-shifted={headerInfo.open}
                style={(() => {
                    if (headerInfo.open) {
                        return {
                            top: `calc(max(${0}px, ${headerInfo.height}px))`,
                            maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)`,
                        };
                    }
                    return { top: "0px", maxHeight: "calc(var(--vh, 1vh) * 100)" };
                })()}

                /* v8 ignore stop */
            >
                <Skeleton visible={awaiting} width="min-content" style={{ marginBottom: "8px" }}>
                    <p
                        className={styles["title"]}
                        style={{ visibility: awaiting ? "hidden" : "initial", textWrap: "nowrap" }}
                    >
                        Filters
                    </p>
                </Skeleton>

                <Divider className={styles["Divider"]} />

                {content}
            </div>
        );
    }

    return (
        <>
            <div
                // Don't test element positioning
                /* v8 ignore start */

                className={styles["category-products-filters"]}
                data-shifted={headerInfo.open}
                data-layout={layout}
                data-active={open}
                style={(() => {
                    if (headerInfo.open) {
                        return {
                            top: `calc(max(${0}px, ${headerInfo.height}px))`,
                            maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)`,
                        };
                    }
                    return { top: "0px", maxHeight: "calc(var(--vh, 1vh) * 100)" };
                })()}

                /* v8 ignore stop */
            >
                <FocusTrap active={open}>
                    <RemoveScroll inert removeScrollBar enabled={open}>
                        <div
                            className={styles["Collapse-container"]}
                            style={{
                                maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)`,
                            }}
                        >
                            <div>
                                <Button
                                    onClick={() => setOpen(!open)}
                                    disabled={awaiting}
                                    classNames={{
                                        root: styles["Button-root"],
                                        label: styles["Button-label"],
                                    }}
                                >
                                    {open ? (
                                        <>
                                            <span>Filters</span>
                                            <X size={17} />
                                        </>
                                    ) : (
                                        <>
                                            <List size={17} weight="bold" />
                                            <span>Filters</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Divider />

                            <Collapse
                                in={open}
                                animateOpacity={false}
                                transitionDuration={0}
                                className={styles["Collapse"]}
                            >
                                {content}
                            </Collapse>
                        </div>
                    </RemoveScroll>
                </FocusTrap>
            </div>

            {open && <div className={styles["overlay"]}></div>}
        </>
    );
}
