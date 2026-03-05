import { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Accordion, AccordionPanelProps, Divider } from "@mantine/core";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

const defaultAccordionPanelProps: AccordionPanelProps = {
    style: { opacity: 1 }, // Override default opacity transition
    className: styles["markdown"],
};

export function FAQs() {
    useEffect(() => {
        document.title = `Frequently Asked Questions | ${siteConfig.title}`;
    }, []);

    const accordionData = useMemo<{ value: string; title: string; markdown: string }[]>(() => {
        return [];
    }, []);

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}>
                    <h1 className={styles["title"]}>Frequently Asked Questions</h1>

                    <p className={styles["last-updated"]}>
                        Last updated: <strong>5th March 2026</strong>
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

                        {accordionData.map(({ title, markdown }) => (
                            <Accordion.Item value={title} key={title}>
                                <Accordion.Control>{title}</Accordion.Control>

                                <Accordion.Panel {...defaultAccordionPanelProps}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdown}
                                    </ReactMarkdown>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
