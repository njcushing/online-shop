import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Accordion, AccordionPanelProps, Divider } from "@mantine/core";
import siteConfig from "@/siteConfig.json";
import { sectionInfo } from "./utils/sectionInfo";
import styles from "./index.module.css";

const defaultAccordionPanelProps: AccordionPanelProps = {
    style: { opacity: 1 }, // Override default opacity transition
    className: styles["markdown"],
};

export function FAQs() {
    useEffect(() => {
        document.title = `Frequently Asked Questions | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}>
                    <h1 className={styles["title"]}>Frequently Asked Questions</h1>

                    <p className={styles["last-updated"]}>
                        Last updated: <strong>6th March 2026</strong>
                    </p>

                    <div className={styles["section-grid"]}>
                        {sectionInfo.map(({ sectionTitle, questionData }) => {
                            return (
                                <div className={styles["section-container"]} key={sectionTitle}>
                                    <p className={styles["section-title"]}>{sectionTitle}</p>

                                    <Accordion
                                        multiple
                                        classNames={{
                                            root: styles["Accordion-root"],
                                            item: styles["Accordion-item"],
                                            control: styles["Accordion-control"],
                                            content: styles["Accordion-content"],
                                            label: styles["Accordion-label"],
                                            panel: styles["Accordion-panel"],
                                        }}
                                    >
                                        <Divider className={styles["divider"]} />

                                        {questionData.map(({ value, title, markdown }) => {
                                            return (
                                                <Accordion.Item value={value} key={title}>
                                                    <Accordion.Control>{title}</Accordion.Control>

                                                    <Accordion.Panel
                                                        {...defaultAccordionPanelProps}
                                                    >
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {markdown}
                                                        </ReactMarkdown>
                                                    </Accordion.Panel>
                                                </Accordion.Item>
                                            );
                                        })}
                                    </Accordion>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
