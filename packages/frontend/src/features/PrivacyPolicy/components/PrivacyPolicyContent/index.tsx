import { Divider, Accordion, AccordionPanelProps } from "@mantine/core";
import styles from "./index.module.css";

const defaultAccordionPanelProps: AccordionPanelProps = {
    style: { opacity: 1 }, // Override default opacity transition
};

export function PrivacyPolicyContent() {
    return (
        <section className={styles["privacy-policy-content"]}>
            <div className={styles["privacy-policy-content-width-controller"]}>
                <h1 className={styles["header"]}>Privacy & Cookie Policy</h1>

                <p className={styles["last-updated"]}>
                    Last updated: <strong>September 2025</strong>
                </p>

                <Accordion
                    classNames={{
                        root: styles["accordion-root"],
                        item: styles["accordion-item"],
                        control: styles["accordion-control"],
                        content: styles["accordion-content"],
                        label: styles["accordion-label"],
                        panel: styles["accordion-panel"],
                    }}
                >
                    <Divider className={styles["divider"]} />

                    <Accordion.Item value="introduction">
                        <Accordion.Control>Introduction</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="your-rights">
                        <Accordion.Control>Your Rights</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="cookie-policy">
                        <Accordion.Control>Cookie Policy</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="data-collection-and-usage">
                        <Accordion.Control>Data Collection and Usage</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="data-storage">
                        <Accordion.Control>Data Storage</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="data-security">
                        <Accordion.Control>Data Security</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="getting-in-touch">
                        <Accordion.Control>Getting in Touch</Accordion.Control>

                        <Accordion.Panel {...defaultAccordionPanelProps}></Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </div>
        </section>
    );
}
