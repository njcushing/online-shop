import {
    howToPlaceOrderMarkdown,
    howToCancelOrderMarkdown,
    wrongItemsDeliveredMarkdown,
    missingOrDamagedItemsMarkdown,
} from "@/pages/Delivery";

const deliveryInformationPageLinkMarkdown = `For more information, please see our [Delivery Information](/delivery) page.`;

export const sectionInfo: {
    sectionTitle: string;
    questionData: { value: string; title: string; markdown: string }[];
}[] = [
    {
        sectionTitle: "Returns & Refunds Policy",
        questionData: [
            {
                value: "can-i-return-items",
                title: "Can I return my items?",
                markdown: `
You have 28 days after the date at which you place an order to return items purchased as part of
that order to us. Any returned items must be in perfect condition and in the original packaging, and
you must pay any shipping expenses incurred. Upon receipt of your items back at our warehouse, a
full refund will be paid back to your original payment method - the money may take between 3-5
working days to return to your account.

This applies for both full priced and sale items ordered online.
                `,
            },
            {
                value: "refund-timeframe",
                title: "How long do I have to wait for my refund to be processed?",
                markdown: `
After confirming your refund, it will typically take between 3-5 working days to be returned to your
account. However, please not that the timeframe for the refund to be processed may vary depending
on your bank or payment provider. If you haven't received your refund after 5 working days, please
contact us so we can investigate the issue further.
                `,
            },
            {
                value: "what-if-i-return-items-late",
                title: "What can I do if I want to return my items after 28 days?",
                markdown: `
Unfortunately, if you wish to return your items after 28 days have elapsed since your order was
placed, we cannot refund you for those items. The exception is if those items have arrived damaged
or have gone missing in transit - if this is the case, please contact us immediately so we may
attempt to rectify the issue.
                `,
            },
            {
                value: "replacement-items",
                title: "What if I would prefer a replacement item instead of a refund?",
                markdown: `
If item(s) that have been delivered to you are damaged, and you wish to receive a replacement in
lieu of a refund for the product, please contact us within 48 hours after the time of delivery with
proof of both purchase and the damage to the item(s). You will not incur any additional shipping
costs when replacement products sent to you in this manner.

We do not offer replacements for items that are not damaged.
                `,
            },
        ],
    },
    {
        sectionTitle: "Ordering & Delivery",
        questionData: [
            {
                value: "how-to-place-order",
                title: "How do I place an order?",
                markdown: `${howToPlaceOrderMarkdown} \n ${deliveryInformationPageLinkMarkdown}`,
            },
            {
                value: "how-to-cancel-order",
                title: "How do I cancel an order?",
                markdown: `${howToCancelOrderMarkdown} \n ${deliveryInformationPageLinkMarkdown}`,
            },
            {
                value: "wrong-items-delivered",
                title: "I've been sent the wrong item(s) - what are my options?",
                markdown: `${wrongItemsDeliveredMarkdown} \n ${deliveryInformationPageLinkMarkdown}`,
            },
            {
                value: "missing-or-damaged-items",
                title: "My item(s) are missing or damaged - what now?",
                markdown: `${missingOrDamagedItemsMarkdown} \n ${deliveryInformationPageLinkMarkdown}`,
            },
        ],
    },
];
