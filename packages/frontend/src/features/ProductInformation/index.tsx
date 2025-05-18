import { useContext, useMemo } from "react";
import { IProductContext, ProductContext } from "@/pages/Product";
import { useMatches, Accordion, Table, Skeleton, SkeletonProps } from "@mantine/core";
import { ProductReviews } from "@/features/ProductReviews";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { settings } from "@settings";
import styles from "./index.module.css";

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function ProductInformation() {
    const tableColumnCount = useMatches({ base: 1, lg: 2 });

    const { product, variant, defaultData } = useContext(ProductContext);
    const { data, awaiting } = product;
    const { description } =
        data || (defaultData.product as NonNullable<IProductContext["product"]["data"]>);
    const { sku, details, releaseDate } =
        variant || (defaultData.variant as NonNullable<IProductContext["variant"]>);

    const segments = useMemo(() => {
        return [
            {
                value: "Description",
                content: awaiting ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Skeleton visible height="1rem" classNames={SkeletonClassNames}></Skeleton>
                        <Skeleton visible height="1rem" classNames={SkeletonClassNames}></Skeleton>
                        <Skeleton visible height="1rem" classNames={SkeletonClassNames}></Skeleton>
                        <Skeleton visible height="1rem" classNames={SkeletonClassNames}></Skeleton>
                        <Skeleton visible height="1rem" classNames={SkeletonClassNames}></Skeleton>
                    </div>
                ) : (
                    <div className={styles["markdown-container"]}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                    </div>
                ),
            },
            {
                value: "Product Details",
                content: (() => {
                    const rows = [
                        { name: "SKU", value: sku },
                        ...details,
                        {
                            name: "Release Date",
                            value: releaseDate ? dayjs(releaseDate).format("MMMM D, YYYY") : "null",
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
                        <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                            <Table
                                variant="vertical"
                                layout="fixed"
                                withRowBorders
                                classNames={{
                                    table: styles["details-table"],
                                    tbody: styles["details-table-tbody"],
                                    tr: styles["details-table-tr"],
                                    th: styles["details-table-th"],
                                }}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${adjustedTableColumnCount}, 1fr)`,
                                    alignItems: "start",
                                    gap: "8px",

                                    visibility: awaiting ? "hidden" : "initial",
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
                content: (
                    <div className={styles["delivery-information"]}>
                        <div className={styles["delivery-information-segment"]}>
                            <p className={styles["delivery-information-segment-title"]}>
                                Standard Delivery
                            </p>
                            <div className={styles["delivery-information-segment-information"]}>
                                <span>
                                    Free delivery on all orders of at least £
                                    <strong>
                                        {
                                            +parseFloat(
                                                `${settings.freeDeliveryThreshold / 100}`,
                                            ).toFixed(2)
                                        }
                                        .
                                    </strong>
                                </span>
                                <span>
                                    We aim to ship all orders within 48h of time of purchase; this
                                    is guaranteed if the order is placed before 5pm.
                                </span>
                            </div>
                        </div>
                        <div className={styles["delivery-information-segment"]}>
                            <p className={styles["delivery-information-segment-title"]}>
                                Express Delivery (£
                                {+parseFloat(`${settings.expressDeliveryCost / 100}`).toFixed(2)})
                            </p>
                            <div className={styles["delivery-information-segment-information"]}>
                                <span>
                                    Guaranteed next-day delivery on all orders if placed before 5pm.
                                </span>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                value: "Customer Reviews",
                content: <ProductReviews />,
            },
        ];
    }, [tableColumnCount, awaiting, description, sku, details, releaseDate]);

    return (
        <section className={styles["product-information"]}>
            <div className={styles["product-information-width-controller"]}>
                <Accordion
                    defaultValue="Description"
                    classNames={{
                        item: styles["accordion-item"],
                        control: styles["accordion-control"],
                        content: styles["accordion-content"],
                    }}
                >
                    {segments.map((segment) => {
                        const { value, content } = segment;
                        return (
                            <Accordion.Item key={value} value={value}>
                                <Accordion.Control
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
