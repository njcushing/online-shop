import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, Button } from "@mantine/core";
import { SubscriptionFrequency, PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import styles from "./index.module.css";
import { SubscriptionProduct } from "../SubscriptionProduct";

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

    const { count, frequency, nextDate, variant } = data;

    const { options } = variant;

    const variantUrlParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => variantUrlParams.append(key, `${value}`));

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

                <div className={styles["next-delivery-date"]}>
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
            </div>

            <div className={styles["content"]}>
                <SubscriptionProduct data={data} />

                <div className={styles["options"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <Button
                            onClick={() => {}}
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
                            onClick={() => {}}
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
        </li>
    );
}
