import { useContext, useMemo, useState } from "react";
import { RootContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { useMatches, Accordion, Table, Skeleton } from "@mantine/core";
import { ProductReviews } from "@/features/ProductReviews";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { Product, ProductVariant } from "@/utils/products/product";
import styles from "./index.module.css";

export type TProductInformation = {
    defaultOpenTab?:
        | "Description"
        | "Product Details"
        | "Delivery Information"
        | "Customer Reviews";
};

export function ProductInformation({ defaultOpenTab = "Description" }: TProductInformation) {
    const tableColumnCount = useMatches({ base: 1, lg: 2 });

    const { settings } = useContext(RootContext);
    const { product, variant, defaultData } = useContext(ProductContext);

    const { response: settingsResponse, awaiting: settingsAwaiting } = settings;
    const { response: productResponse, awaiting: productAwaiting } = product;

    const { success: settingsSuccess } = settingsResponse;
    const { success: productSuccess } = productResponse;

    const awaitingAny = settingsAwaiting || productAwaiting;

    let settingsData = null;
    let productData = defaultData.product as Product;
    let variantData = defaultData.variant as ProductVariant;

    if (!awaitingAny) {
        if (!settingsSuccess) throw new Error(settingsResponse.message);
        if (!productSuccess) throw new Error(productResponse.message);
        if (!variant) throw new Error("Product variant not found");

        settingsData = settingsResponse.data;
        productData = productResponse.data;
        variantData = variant;
    }

    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const segments = useMemo(() => {
        return [
            {
                value: "Description",
                content: (() => {
                    if (awaitingAny) {
                        return (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {Array.from({ length: 5 }).map(() => {
                                    return <Skeleton visible height="1rem" key={uuid()}></Skeleton>;
                                })}
                            </div>
                        );
                    }

                    if (!productSuccess) return null;

                    const { description } = productData;

                    return (
                        <div className={styles["markdown-container"]}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                        </div>
                    );
                })(),
            },
            {
                value: "Product Details",
                content: (() => {
                    if (!awaitingAny && !productSuccess) return null;

                    const { sku, details, releaseDate } = variantData;

                    const rows = [
                        { name: "SKU", value: sku },
                        ...details,
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
                })(),
            },
            {
                value: "Delivery Information",
                content: (() => {
                    if (!awaitingAny && !settingsSuccess) return null;
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
                                            Free delivery on all orders of at least £
                                            <strong>
                                                {
                                                    +parseFloat(
                                                        `${settingsData.freeExpressDeliveryThreshold / 100}`,
                                                    ).toFixed(2)
                                                }
                                                .
                                            </strong>
                                        </span>
                                    </Skeleton>
                                    <Skeleton visible={awaitingAny}>
                                        <span
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        >
                                            We aim to ship all orders within 48h of time of
                                            purchase; this is guaranteed if the order is placed
                                            before 5pm.
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
                                        {
                                            +parseFloat(
                                                `${settingsData.baseExpressDeliveryCost / 100}`,
                                            ).toFixed(2)
                                        }
                                        )
                                    </p>
                                </Skeleton>
                                <div className={styles["delivery-information-segment-information"]}>
                                    <Skeleton visible={awaitingAny}>
                                        <span
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        >
                                            Guaranteed next-day delivery on all orders if placed
                                            before 5pm.
                                        </span>
                                    </Skeleton>
                                </div>
                            </div>
                        </div>
                    );
                })(),
            },
            {
                value: "Customer Reviews",
                content: <ProductReviews containerIsTransitioning={isTransitioning} />,
            },
        ];
    }, [
        tableColumnCount,
        awaitingAny,
        settingsSuccess,
        settingsData,
        productSuccess,
        productData,
        variantData,
        isTransitioning,
    ]);

    return (
        <section className={styles["product-information"]}>
            <div className={styles["product-information-width-controller"]}>
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
            </div>
        </section>
    );
}
