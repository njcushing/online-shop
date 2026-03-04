import { useContext, useState, useEffect, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Accordion, AccordionPanelProps, Divider } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetSettingsResponseDto } from "@/api/settings/GET";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

const introduction = `
You can place online orders with either Standard Delivery or Express
Delivery. We do not currently offer Nominated Day Delivery (delivered on a
day of your choosing) for any of our products.

To view the status of any of your active orders, [sign in](/login) to your account.
`;

const standardDelivery = `
Our Standard Delivery option is **free** for all addresses in the United Kingdom.

We aim to ship all orders within 48 hours of time of purchase; this is guaranteed if the order is
placed before 5pm.
`;

const defaultAccordionPanelProps: AccordionPanelProps = {
    style: { opacity: 1 }, // Override default opacity transition
    className: styles["markdown"],
};

export function Delivery() {
    const { settings } = useContext(RootContext);

    const [settingsData, setSettingsData] = useState<GetSettingsResponseDto | null>(null);

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "settings", context: settings }],
    });

    useEffect(() => {
        if (!awaitingAny && data.settings) setSettingsData(data.settings);
    }, [data.settings, awaitingAny]);

    useEffect(() => {
        document.title = `Delivery | ${siteConfig.title}`;
    }, []);

    const expressDeliveryMarkdown = useMemo(() => {
        if (!settingsData) return "";

        return `
Our Express Delivery option costs **£${settingsData.baseExpressDeliveryCost}** for all addresses in
the United Kingdom.

If your cart contains at least **£${settingsData.freeExpressDeliveryThreshold}** worth of products,
the Express Delivery shipping option will be available for free.

We aim to ship all orders within 48 hours of time of purchase; this is guaranteed if the order is
placed before 5pm.
`;
    }, [settingsData]);

    if (!settingsData) return null;

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}>
                    <h1 className={styles["title"]}>Delivery Information</h1>

                    <p className={styles["last-updated"]}>
                        Last updated: <strong>4th March 2026</strong>
                    </p>

                    <span className={`${styles["introduction"]} ${styles["markdown"]}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{introduction}</ReactMarkdown>
                    </span>

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

                        <Accordion.Item value="standard-delivery">
                            <Accordion.Control>Standard Delivery</Accordion.Control>

                            <Accordion.Panel {...defaultAccordionPanelProps}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {standardDelivery}
                                </ReactMarkdown>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="express-delivery">
                            <Accordion.Control>Express Delivery</Accordion.Control>

                            <Accordion.Panel {...defaultAccordionPanelProps}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {expressDeliveryMarkdown}
                                </ReactMarkdown>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
