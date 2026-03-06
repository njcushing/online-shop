import { useContext, useState, useEffect, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Accordion, AccordionPanelProps, Divider } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetSettingsResponseDto } from "@/api/settings/GET";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

const introductionMarkdown = `
You can place online orders with either Standard Delivery or Express
Delivery. We do not currently offer Nominated Day Delivery (delivered on a
day of your choosing) for any of our products.

To view the status of any of your active orders, [sign in](/login) to your account.
`;

export const howToPlaceOrderMarkdown = `
Placing an order on our website is simple and straightforward. To place an order, simply add the
desired items to your cart and proceed to checkout. During the checkout process, you will be
prompted to enter your delivery address and select a delivery option (either Standard Delivery or
Express Delivery). After providing the necessary information and confirming your order, the 'Order
History' page in your account will be updated with the new order and its current status.
`;

const standardDeliveryMarkdown = `
Our Standard Delivery option is **free** for all addresses in the United Kingdom.

We aim to ship all orders within 48 hours of time of purchase; this is guaranteed if the order is
placed before 5pm.
`;

export const howToCancelOrderMarkdown = `
If you wish to cancel an order, you must do so before your item has been shipped - there will be an
option to cancel your order on the 'Order History' page in your account. If your item has already
been shipped, you will need to wait until you have received the item and then follow our returns
process by contacting us immediately.
`;

const changeDeliveryAddressMarkdown = `
We do not allow changes to delivery addresses after an order has been placed. You can still cancel
your order and place a new one with the correct delivery address, as long as your item has not yet
been shipped. If your item is delivered to the wrong address, please contact us immediately so we
can attempt to resolve the issue.
`;

const deliveryToMultipleAddressesMarkdown = `
We currently only deliver to one address per order. If you would like to have items delivered to
multiple addresses, you will need to place separate orders for each address.
`;

const itemsDeliveredSeparatelyMarkdown = `
We will always aim to deliver all items in your order together, however this may not always be
possible. If your order contains multiple items, they may be shipped separately and delivered at
different times - this mostly occurs when certain items in your order are unavailable at the time
of purchase, such as pre-order items.
`;

const unableToTakeDeliveryMarkdown = `
If you are unable to take delivery of your item(s) at the time of delivery, there's no need to
worry. Your courier will aim to leave your package in a safe place at your address. If this is not
possible, we will inform you via email at what time delivery was attempted, and the courier will
attempt to deliver your item(s) on the next working day. Your courier will make a maximum of 3
delivery attempts, after which your item(s) will be returned to us and you will be refunded.
`;

export const wrongItemsDeliveredMarkdown = `
If you have been sent the wrong item(s), please contact us within a reasonable period of time. You
will likely be requested to return the incorrect item(s) to us and the correct item(s) will be
shipped at no additional cost to you. If this is not possible, and you are eligible for a refund or
replacement, these options will be discussed with you at the point of contact.
`;

export const missingOrDamagedItemsMarkdown = `
If you have been sent any damaged item(s), please contact us within a reasonable period of time. You
will likely be asked to provide proof of any damage (e.g. photos) and the damaged item(s) may be
requested to be returned to us. Replacement item(s) will be shipped at no additional cost to you.
Similarly, for any missing item(s), please contact us immediately so we may attempt to resolve the
issue and ensure your item(s) are shipped to you as soon as possible. If we are unable to resolve
the issue, and you are eligible for a refund, these options will be discussed with you at the point
of contact.
`;

const internationalOrdersMarkdown = `
We currently do not offer delivery to addresses outside of the United Kingdom.
`;

const orderingFromOverseasMarkdown = `
Yes, you can place an order from outside of the United Kingdom, as long as you place the order using
a valid delivery address within the UK.
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

    const accordionData = useMemo<{ value: string; title: string; markdown: string }[]>(() => {
        return [
            {
                value: "how-to-place-order",
                title: "How do I place an order?",
                markdown: howToPlaceOrderMarkdown,
            },
            {
                value: "standard-delivery",
                title: "Standard Delivery",
                markdown: standardDeliveryMarkdown,
            },
            {
                value: "express-delivery",
                title: "Express Delivery",
                markdown: expressDeliveryMarkdown,
            },
            {
                value: "how-to-cancel-order",
                title: "How do I cancel an order?",
                markdown: howToCancelOrderMarkdown,
            },
            {
                value: "delivery-to-multiple-addresses",
                title: "Can my items be delivered to multiple addresses?",
                markdown: deliveryToMultipleAddressesMarkdown,
            },
            {
                value: "items-delivered-separately",
                title: "Are my item(s) guaranteed to be delivered together?",
                markdown: itemsDeliveredSeparatelyMarkdown,
            },
            {
                value: "unable-to-take-delivery",
                title: "What if I'm away from home at the time of delivery?",
                markdown: unableToTakeDeliveryMarkdown,
            },
            {
                value: "change-delivery-address",
                title: "Can I change the delivery address for a placed order?",
                markdown: changeDeliveryAddressMarkdown,
            },
            {
                value: "wrong-items-delivered",
                title: "I've been sent the wrong item(s) - what are my options?",
                markdown: wrongItemsDeliveredMarkdown,
            },
            {
                value: "missing-or-damaged-items",
                title: "My item(s) are missing or damaged - what now?",
                markdown: missingOrDamagedItemsMarkdown,
            },
            {
                value: "international-orders",
                title: "Can I place orders to addresses outside of the UK?",
                markdown: internationalOrdersMarkdown,
            },
            {
                value: "ordering-from-overseas",
                title: "Can I place an order from outside of the UK?",
                markdown: orderingFromOverseasMarkdown,
            },
        ];
    }, [expressDeliveryMarkdown]);

    if (!settingsData) return null;

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}>
                    <h1 className={styles["title"]}>Delivery Information</h1>

                    <p className={styles["last-updated"]}>
                        Last updated: <strong>5th March 2026</strong>
                    </p>

                    <span className={`${styles["introduction"]} ${styles["markdown"]}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {introductionMarkdown}
                        </ReactMarkdown>
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

                        {accordionData.map(({ value, title, markdown }) => (
                            <Accordion.Item value={value} key={title}>
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
