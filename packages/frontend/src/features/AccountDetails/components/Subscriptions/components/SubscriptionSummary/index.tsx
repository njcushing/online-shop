import { useContext, useState } from "react";
import { UserContext } from "@/pages/Root";
import { useMatches, Skeleton, Button, Modal } from "@mantine/core";
import { SubscriptionFrequency, PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import { SubscriptionProduct } from "../SubscriptionProduct";
import { SubscriptionDetails } from "../SubscriptionDetails";
import styles from "./index.module.css";

const subscriptionFrequencyMessage = (frequency: SubscriptionFrequency): string => {
    switch (frequency) {
        case "one_week":
            return "week";
        case "two_weeks":
            return "two weeks";
        case "one_month":
            return "month";
        case "three_months":
            return "three months";
        case "six_months":
            return "six months";
        case "one_year":
            return "year";
        default:
            return frequency;
    }
};

export type TSubscriptionSummary = {
    data: PopulatedSubscriptionData;
};

export function SubscriptionSummary({ data }: TSubscriptionSummary) {
    const { subscriptions } = useContext(UserContext);
    const { awaiting } = subscriptions;

    const { count, frequency, nextDate } = data;

    const wide = useMatches({ base: false, xs: true });

    const [cancellationModalOpen, setCancellationModalOpen] = useState<boolean>(false);

    return (
        <li className={styles["subscription-summary"]}>
            <div className={styles["top-bar"]}>
                <div className={styles["frequency"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            Delivery Frequency
                        </strong>
                    </Skeleton>

                    <Skeleton visible={awaiting} width="min-content">
                        <p
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`${count} unit${count !== 1 ? "s" : ""} every ${subscriptionFrequencyMessage(frequency)}`}</p>
                    </Skeleton>
                </div>

                {
                    // Don't test logic dependent on window dimensions - this code will never be
                    // accessible by default in unit tests using jsdom as an environment due to
                    // window width being 0px
                    /* v8 ignore start */

                    wide && (
                        <div className={styles["next-delivery-date-wide"]}>
                            <Skeleton visible={awaiting} width="min-content">
                                <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                    Next Delivery Date
                                </strong>
                            </Skeleton>

                            <Skeleton visible={awaiting} width="min-content">
                                <p
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >{`${dayjs(nextDate).format("MMMM D, YYYY")}`}</p>
                            </Skeleton>
                        </div>
                    )

                    /* v8 ignore stop */
                }
            </div>

            <div className={styles["content"]}>
                {!wide && (
                    <div className={styles["next-delivery-date-thin"]}>
                        <Skeleton visible={awaiting} width="min-content">
                            <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                Next Delivery Date:
                            </strong>
                        </Skeleton>

                        <Skeleton visible={awaiting} width="min-content">
                            <p style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                {`${dayjs(nextDate).format("MMMM D, YYYY")}`}
                            </p>
                        </Skeleton>
                    </div>
                )}

                <SubscriptionProduct data={data} />

                <div className={styles["options"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <Button
                            color="rgb(241, 202, 168)"
                            variant="filled"
                            radius={9999}
                            className={styles["button"]}
                            disabled={awaiting}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            Change delivery schedule
                        </Button>
                    </Skeleton>

                    <Skeleton visible={awaiting} width="min-content">
                        <Button
                            onClick={() => {
                                if (!awaiting) setCancellationModalOpen(true);
                            }}
                            color="rgb(241, 202, 168)"
                            variant="filled"
                            radius={9999}
                            className={styles["button"]}
                            disabled={awaiting}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            Cancel subscription
                        </Button>
                    </Skeleton>
                </div>
            </div>

            <SubscriptionDetails data={data} />

            <Modal
                opened={cancellationModalOpen}
                onClose={() => setCancellationModalOpen(false)}
                title="Are you sure you want to cancel this subscription?"
                centered
                closeButtonProps={{ size: 32 }}
                classNames={{
                    inner: styles["modal-inner"],
                    header: styles["modal-header"],
                    content: styles["modal-content"],
                    title: styles["modal-title"],
                    body: styles["modal-body"],
                    close: styles["modal-close"],
                }}
            >
                <SubscriptionProduct data={data} />

                <p className={styles["cancellation-modal-frequency"]}>
                    Your next delivery of {count} {`unit${count !== 1 ? "s" : ""}`} is set to be
                    delivered on {`${dayjs(nextDate).format("MMMM D, YYYY")}`}
                </p>

                <div className={styles["cancellation-modal-options"]}>
                    <Button
                        onClick={() => {
                            /* Cancel order */
                        }}
                        color="rgb(241, 202, 168)"
                        variant="filled"
                        radius={9999}
                        className={`${styles["button"]} ${styles["cancel-button"]}`}
                        disabled={awaiting}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        Yes, I&apos;m sure
                    </Button>

                    <Button
                        onClick={() => setCancellationModalOpen(false)}
                        color="rgb(241, 202, 168)"
                        variant="filled"
                        radius={9999}
                        className={styles["button"]}
                        disabled={awaiting}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        Go back
                    </Button>
                </div>
            </Modal>
        </li>
    );
}
