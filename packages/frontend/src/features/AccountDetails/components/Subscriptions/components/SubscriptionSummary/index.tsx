import { useContext, useState } from "react";
import { UserContext } from "@/pages/Root";
import { useMatches, Skeleton, Button } from "@mantine/core";
import { frequencies, PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import { SubscriptionProduct } from "../SubscriptionProduct";
import { SubscriptionDetails } from "../SubscriptionDetails";
import styles from "./index.module.css";
import { ScheduleModal } from "../ScheduleModal";
import { CancellationModal } from "../CancellationModal";

export type TSubscriptionSummary = {
    data: PopulatedSubscriptionData;
};

export function SubscriptionSummary({ data }: TSubscriptionSummary) {
    const { subscriptions } = useContext(UserContext);
    const { awaiting } = subscriptions;

    const { count, frequency, nextDate } = data;

    const wide = useMatches({ base: false, xs: true });

    const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
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
                        >{`${count} unit${count !== 1 ? "s" : ""} every ${frequencies[frequency].text}`}</p>
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
                            onClick={() => {
                                if (!awaiting) setScheduleModalOpen(true);
                            }}
                            color="rgb(241, 202, 168)"
                            variant="filled"
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

            <ScheduleModal
                data={data}
                opened={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
            />

            <CancellationModal
                data={data}
                opened={cancellationModalOpen}
                onClose={() => setCancellationModalOpen(false)}
            />
        </li>
    );
}
