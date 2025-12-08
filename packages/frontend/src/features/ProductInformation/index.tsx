import { useContext, useEffect, useMemo, useState } from "react";
import { RootContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { useMatches, Accordion, Table, Skeleton } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetSettingsResponseDto } from "@/api/settings/GET";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import { ProductReviews } from "@/features/ProductReviews";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import styles from "./index.module.css";

export type TProductInformation = {
    defaultOpenTab?:
        | "Description"
        | "Product Details"
        | "Delivery Information"
        | "Customer Reviews";
};

export function ProductInformation({ defaultOpenTab = "Description" }: TProductInformation) {
    const tableColumnCount = useMatches({ base: 1, lg: 2 }, { getInitialValueInEffect: false });

    const { settings } = useContext(RootContext);
    const { product, variant, defaultData } = useContext(ProductContext);

    const [settingsData, setSettingsData] = useState<GetSettingsResponseDto | null>(null);
    const [productData, setProductData] = useState<GetProductBySlugResponseDto>(
        defaultData.product as GetProductBySlugResponseDto,
    );
    const [variantData, setVariantData] = useState<GetProductBySlugResponseDto["variants"][number]>(
        defaultData.variant as GetProductBySlugResponseDto["variants"][number],
    );

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "settings", context: settings },
            { name: "product", context: product },
        ],
    });

    useEffect(() => {
        if (!awaitingAny && data.settings) setSettingsData(data.settings);
    }, [data.settings, awaitingAny]);

    useEffect(() => {
        if (!awaitingAny && data.product) setProductData(data.product);
    }, [data.product, awaitingAny]);

    useEffect(() => {
        if (!awaitingAny && variant) setVariantData(variant);
    }, [variant, awaitingAny]);

    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const descriptionSegment = useMemo(() => {
        if (awaitingAny) {
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Array.from({ length: 5 }).map(() => {
                        return <Skeleton visible height="1rem" key={uuid()}></Skeleton>;
                    })}
                </div>
            );
        }

        if (!product.response.success) return null;

        const { description } = productData;

        return (
            <div className={styles["markdown-container"]}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
            </div>
        );
    }, [product.response.success, productData, awaitingAny]);

    const productDetailsSegment = useMemo(() => {
        if (!awaitingAny && !product.response.success) return null;

        const { categories, details: productDetails } = productData;
        const { sku, details: variantDetails, attributes, releaseDate } = variantData;

        const rows = [
            { name: "SKU", value: sku },
            ...productDetails,
            ...variantDetails,
            ...attributes.map((a) => ({ name: a.type.name, value: a.value.name })),
            { name: "Categories", value: categories.map((c) => c.name).join(", ") },
            {
                name: "Release Date",
                value: dayjs(releaseDate).format("MMMM D, YYYY"),
            },
        ];
        const adjustedTableColumnCount = Math.min(rows.length, tableColumnCount);
        const columns = [];
        const columnHeight = Math.ceil(rows.length / adjustedTableColumnCount);
        for (let i = 0; i < adjustedTableColumnCount; i++) {
            columns.push(
                rows.slice(
                    i * columnHeight,
                    Math.min(rows.length, i * columnHeight + columnHeight),
                ),
            );
        }

        return (
            <Skeleton visible={awaitingAny}>
                <Table
                    variant="vertical"
                    layout="fixed"
                    withRowBorders
                    classNames={{
                        table: styles["details-table"],
                        tbody: styles["details-table-tbody"],
                        tr: styles["details-table-tr"],
                        th: styles["details-table-th"],
                        td: styles["details-table-td"],
                    }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${adjustedTableColumnCount}, 1fr)`,
                        alignItems: "start",
                        gap: "8px",

                        visibility: awaitingAny ? "hidden" : "initial",
                    }}
                >
                    {columns.map((column) => {
                        return (
                            <Table.Tbody
                                style={{ width: "100%" }}
                                key={`${column.map((row) => row.name).join("-")}`}
                            >
                                {column.map((row) => {
                                    const { name, value } = row;
                                    return (
                                        <Table.Tr key={name}>
                                            <Table.Th>{name}</Table.Th>
                                            <Table.Td>{value}</Table.Td>
                                        </Table.Tr>
                                    );
                                })}
                            </Table.Tbody>
                        );
                    })}
                </Table>
            </Skeleton>
        );
    }, [tableColumnCount, product.response.success, productData, variantData, awaitingAny]);

    const deliveryInformationSegment = useMemo(() => {
        if (!awaitingAny && !settings.response.success) return null;
        if (!settingsData) return null;

        return (
            <div className={styles["delivery-information"]}>
                <div className={styles["delivery-information-segment"]}>
                    <Skeleton visible={awaitingAny}>
                        <p
                            className={styles["delivery-information-segment-title"]}
                            style={{
                                visibility: awaitingAny ? "hidden" : "initial",
                            }}
                        >
                            Standard Delivery
                        </p>
                    </Skeleton>
                    <div className={styles["delivery-information-segment-information"]}>
                        <Skeleton visible={awaitingAny}>
                            <span
                                style={{
                                    visibility: awaitingAny ? "hidden" : "initial",
                                }}
                            >
                                Free delivery on all orders of at least{" "}
                                <strong>£{settingsData.freeExpressDeliveryThreshold}.</strong>
                            </span>
                        </Skeleton>
                        <Skeleton visible={awaitingAny}>
                            <span
                                style={{
                                    visibility: awaitingAny ? "hidden" : "initial",
                                }}
                            >
                                We aim to ship all orders within 48h of time of purchase; this is
                                guaranteed if the order is placed before 5pm.
                            </span>
                        </Skeleton>
                    </div>
                </div>
                <div className={styles["delivery-information-segment"]}>
                    <Skeleton visible={awaitingAny}>
                        <p
                            className={styles["delivery-information-segment-title"]}
                            style={{
                                visibility: awaitingAny ? "hidden" : "initial",
                            }}
                        >
                            Express Delivery (£
                            {settingsData.baseExpressDeliveryCost})
                        </p>
                    </Skeleton>
                    <div className={styles["delivery-information-segment-information"]}>
                        <Skeleton visible={awaitingAny}>
                            <span
                                style={{
                                    visibility: awaitingAny ? "hidden" : "initial",
                                }}
                            >
                                Guaranteed next-day delivery on all orders if placed before 5pm.
                            </span>
                        </Skeleton>
                    </div>
                </div>
            </div>
        );
    }, [settings.response.success, settingsData, awaitingAny]);

    const customerReviewsSegment = useMemo(() => {
        return <ProductReviews containerIsTransitioning={isTransitioning} />;
    }, [isTransitioning]);

    const segments = useMemo(() => {
        return [
            { value: "Description", content: descriptionSegment },
            { value: "Product Details", content: productDetailsSegment },
            { value: "Delivery Information", content: deliveryInformationSegment },
            { value: "Customer Reviews", content: customerReviewsSegment },
        ];
    }, [
        descriptionSegment,
        productDetailsSegment,
        deliveryInformationSegment,
        customerReviewsSegment,
    ]);

    const accordion = useMemo(() => {
        return (
            <Accordion
                defaultValue={defaultOpenTab}
                classNames={{
                    item: styles["accordion-item"],
                    control: styles["accordion-control"],
                    content: styles["accordion-content"],
                }}
                onTransitionEnd={() => setIsTransitioning(false)}
            >
                {segments.map((segment) => {
                    const { value, content } = segment;
                    return (
                        <Accordion.Item key={value} value={value}>
                            <Accordion.Control
                                onClick={() => setIsTransitioning(true)}
                                classNames={{ label: styles["accordion-label"] }}
                            >
                                {value}
                            </Accordion.Control>
                            <Accordion.Panel
                                className={styles["accordion-panel"]}
                                style={{ opacity: 1 }} // Override default opacity transition
                            >
                                {content}
                            </Accordion.Panel>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        );
    }, [defaultOpenTab, segments]);

    return (
        <section className={styles["product-information"]}>
            <div className={styles["product-information-width-controller"]}>{accordion}</div>
        </section>
    );
}
