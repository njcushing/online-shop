import { Accordion } from "@mantine/core";
import styles from "./index.module.css";

const segments = [
    {
        value: "Description",
        text: "",
    },
    {
        value: "Product Details",
        text: "",
    },
    {
        value: "Delivery Information",
        text: "",
    },
    {
        value: "Customer Reviews",
        text: "",
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
                    }}
                >
                    {segments.map((segment) => {
                        const { value, text } = segment;
                        return (
                            <Accordion.Item key={value} value={value}>
                                <Accordion.Control
                                    classNames={{ label: styles["accordion-label"] }}
                                >
                                    {value}
                                </Accordion.Control>
                                <Accordion.Panel className={styles["accordion-panel"]}>
                                    {text}
                                </Accordion.Panel>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            </div>
        </section>
    );
}
