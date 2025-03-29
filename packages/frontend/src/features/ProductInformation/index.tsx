import { Accordion, Table } from "@mantine/core";
import { freeDeliveryThreshold, expressDeliveryCost } from "@/utils/products/cart";
import styles from "./index.module.css";

const segments = [
    {
        value: "Description",
        content: "",
    },
    {
        value: "Product Details",
        content: (
            <Table
                variant="vertical"
                layout="fixed"
                withTableBorder
                classNames={{
                    table: styles["details-table"],
                    th: styles["details-table-th"],
                }}
            >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th>Example Row 1</Table.Th>
                        <Table.Td>Example Row 1 Content</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Example Row 2</Table.Th>
                        <Table.Td>Example Row 2 Content</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Example Row 3</Table.Th>
                        <Table.Td>Example Row 3 Content</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Example Row 4</Table.Th>
                        <Table.Td>Example Row 4 Content</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Example Row 5</Table.Th>
                        <Table.Td>Example Row 5 Content</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        ),
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
                                {+parseFloat(`${freeDeliveryThreshold / 100}`).toFixed(2)}.
                            </strong>
                        </span>
                        <span>
                            We aim to ship all orders within 48h of time of purchase; this is
                            guaranteed if the order is placed before 5pm.
                        </span>
                    </div>
                </div>
                <div className={styles["delivery-information-segment"]}>
                    <p className={styles["delivery-information-segment-title"]}>
                        Express Delivery (£{+parseFloat(`${expressDeliveryCost / 100}`).toFixed(2)})
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
        content: "",
    },
];

export function ProductInformation() {
    return (
        <section className={styles["product-information"]}>
            <div className={styles["product-information-width-controller"]}>
                <Accordion
                    defaultValue="Description"
                    classNames={{
                        root: styles["accordion-root"],
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
                                <Accordion.Panel className={styles["accordion-panel"]}>
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
