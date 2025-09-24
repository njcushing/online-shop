import { Divider, Accordion, AccordionPanelProps } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./index.module.css";

const introduction = `
**CAFREE** is a **mock e-commerce** site
created solely as a portfolio project. None of the products shown on
this site are real and no real transactions take place on this site.

This privacy policy explains how any personal data you choose to
provide may be stored and used. While the site is for demonstration
purposes only, it is still important to be transparent about data
handling.

This privacy policy is subject to change at any time; the publish
date for its most recent version is displayed at the top of this
page.
`;

const defaultAccordionPanelProps: AccordionPanelProps = {
    style: { opacity: 1 }, // Override default opacity transition
    className: styles["markdown"],
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
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {introduction}
                            </ReactMarkdown>
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
