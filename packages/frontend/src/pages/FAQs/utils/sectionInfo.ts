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
    {
        sectionTitle: "Product Information",
        questionData: [
            {
                value: "when-will-product-be-restocked",
                title: "When will an out-of-stock product be restocked?",
                markdown: `
When a product is out-of-stock, we are often unable to provide an accurate restock date. However, if
we are aware of when the product will be restocked, we will update the product's page with the
appropriate information.
                `,
            },
            {
                value: "subscriptions-not-available-for-all-products",
                title: "Why are subscriptions available for some products but not others?",
                markdown: `
We don't always run a subscription offer for every product, and the products on which subscriptions
are available may change over time. If you're subscribed to a product and the subscription offer
for that product is later removed, you don't have to worry about your subscription being cancelled -
you will continue to receive your product as normal, and at the same interval specified in your
subscription.

We tend only to run subscriptions on our consumable products like coffee and tea, and not on our
products that are generally single-purchase, such as mugs, espresso machines, accessories and gift
cards.
                `,
            },
            {
                value: "subscription-discounts-and-product-price-increase",
                title: "Will my subscription discount still apply if the product's price increases?",
                markdown: `
Yes. If you've subscribed to a product with a specified discount percentage, this discount will
continue to apply to your subscription orders even if the product's price increases. We will inform
you via email of any price increases to products that you are subscribed to, and you will have the
option to cancel your subscription if you no longer wish to receive the product at the new price.
                `,
            },
            {
                value: "promotion-not-working",
                title: "Why isn't my promotion code working?",
                markdown: `
There are numerous reasons a promotional code isn't working:

- The code requires a minimum spend that your order hasn't met
- The code requires a certain product to be in your cart that you haven't added
- The code is exclusively for new customers, and you have previously placed an order with us
- The code has expired
- The code is otherwise invalid (not yet active, doesn't exist, etc.)

If you believe your code should be working, please contact us with the code you're attempting to use
and we will investigate the issue further.
                `,
            },
        ],
    },
    {
        sectionTitle: "Coffee & Tea",
        questionData: [
            {
                value: "why-decaffeination",
                title: "Why does Cafree decaffeinate all its coffee and tea?",
                markdown: `
At Cafree, we chose to decaffeinate our products because we believe that while caffeine can be a
wonderful stimulant, it isn't always kind to our bodies and routines, and for many people, even
smaller doses of caffeine can cause jitters, anxiety, disrupted sleep, and/or acid reflux.

Decaffeination also opens the door to balance: you can enjoy your favourite cups in the evening, and
not have to limit your enjoyment of coffee and tea to just a few cups. For those who are sensitive
to caffeine, managing intake for health reasons, or simply trying to be more mindful about how they
feel throughout the day, decaf offers a way to enjoy your favourite drinks without compromise.

Just as importantly, we don't believe caffeine should be the defining feature of a great drink.
Flavour, origin, craft, and care matter more. We pride ourselves on our ability to decaffeinate
efficiently without sacrificing any of the best qualities of our coffee and tea.
                `,
            },
            {
                value: "how-coffee-is-decaffeinated",
                title: "What decaffeination process does Cafree use?",
                markdown: `
We decaffeinate our coffee and tea by passing high-pressure, liquid carbon dioxide through the
beans and leaves. This natural solvent effectively binds with the caffeine, removing it without
touching the other flavour compounds. No chemical solvents are used in the process; our chosen
method of extraction is significantly better for the environment than other similar methods, and is
the best way to preserve the natural flavours and aromas you expect in every cup.
                `,
            },
            {
                value: "coffee-ground-disposal",
                title: "How should I dispose of my coffee grounds?",
                markdown: `
The best and most environmentally-conscious way to dispose of your used coffee grounds is to compost
them or use them as fertiliser in your garden. If you're unable to do that, just throw them in the
bin!
                `,
            },
            {
                value: "coffee-pod-compatibility",
                title: "What machines are Cafree coffee pods compatible with?",
                markdown: `
Our coffee pods are compatible with all our own espresso machines, in addition to original-style
Nespresso® machines. However, our coffee pods are **not** compatible with Nespresso® Vertuo, Dolce
Gusto, Lavazza, and Tassimo machines.

Our coffee pods are made from a compostable material, and as such, we recommend immediately removing
them from any machine you use them in after making your coffee. If they're left in the machine after
use for an extended period of time, there is a risk they can absorb too much moisture and expand,
potentially becoming stuck in the machine.

If you have any uncertainty about whether our coffee pods are compatible with your machine, please
contact us and we would be happy to advise you further.
                `,
            },
        ],
    },
];
