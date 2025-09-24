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
                    Last updated: <strong>23rd September 2025</strong>
                </p>

                <Accordion
                    multiple
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

                        <Accordion.Panel {...defaultAccordionPanelProps}>
                            <p>
                                <strong>CAFREE</strong> is a <strong>mock e-commerce</strong> site
                                created solely as a portfolio project. None of the products shown on
                                this site are real and no real transactions take place on this site.
                            </p>

                            <p>
                                This privacy policy explains how any personal data you choose to
                                provide may be stored and used. While the site is for demonstration
                                purposes only, it is still important to be transparent about data
                                handling.
                            </p>

                            <p>
                                This privacy policy is subject to change at any time; the publish
                                date for its most recent version is displayed at the top of this
                                page.
                            </p>
                        </Accordion.Panel>
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
