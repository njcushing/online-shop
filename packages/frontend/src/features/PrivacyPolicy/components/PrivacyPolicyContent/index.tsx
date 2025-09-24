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

const yourRights = `
**CAFREE** stores limited personal data (e.g., user details, watchlist, order history, subscriptions and cart data) in an encrypted cookie on your own device. This cookie is transmitted to our server only for the purpose of decrypting and reading its contents when you use the site. The data is never persisted on the server or shared with any third parties.

You have the following rights under applicable data protection laws (such as the UK GDPR and EU GDPR):

- **Right of access** - You can view the data stored about you directly in your browser's cookie storage.
- **Right to rectification** - You may update or change this information at any time through the site's forms, which will update the cookie contents.
- **Right to erasure** - You can delete your data at any time using the 'clear data' option in the user settings page on this site or by clearing your browser's cookies.
- **Right to withdraw consent** - If you previously consented to data being stored and wish to withdraw it, you can do so at any time, and the cookie will no longer be set.
- **Right to object / restrict processing** - You can restrict processing by opting out in the consent banner or disabling cookies in your browser.
- **Right to data portability** - You may export or delete the data stored in your browser's cookies using your browser tools. Since no personal data is stored on our servers or in any backend database, we cannot directly transmit your data to another controller.
- **Complaints** - If you believe your rights are not being respected, you have the right to lodge a complaint with your local Data Protection Authority.

Please note:
- No automated decision-making or profiling takes place.
- No personal data is stored by the site owner outside of the cookie on your device.
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
                    Last updated: <strong>24th September 2025</strong>
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

                        <Accordion.Panel {...defaultAccordionPanelProps}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{yourRights}</ReactMarkdown>
                        </Accordion.Panel>
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
