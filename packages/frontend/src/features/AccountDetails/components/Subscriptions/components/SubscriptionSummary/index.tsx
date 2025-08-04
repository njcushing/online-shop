import { useContext, useState, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { useMatches, Skeleton, Button, Modal } from "@mantine/core";
import { SubscriptionFrequency, PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import { Quantity } from "@/components/Inputs/Quantity";
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

const subscriptionFrequencyOptions: { frequency: SubscriptionFrequency; name: string }[] = [
    { frequency: "one_week", name: "Weekly" },
    { frequency: "two_weeks", name: "Every two weeks" },
    { frequency: "one_month", name: "Monthly" },
    { frequency: "three_months", name: "Every three months" },
    { frequency: "six_months", name: "Every six months" },
    { frequency: "one_year", name: "Yearly" },
];

export type TSubscriptionSummary = {
    data: PopulatedSubscriptionData;
};

export function SubscriptionSummary({ data }: TSubscriptionSummary) {
    const { subscriptions } = useContext(UserContext);
    const { awaiting } = subscriptions;

    const { count, frequency, nextDate, product, variant } = data;
    const { allowance } = product;
    const { allowanceOverride } = variant;

    const wide = useMatches({ base: false, xs: true });

    const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
    const [cancellationModalOpen, setCancellationModalOpen] = useState<boolean>(false);

    const [selectedCount, setSelectedCount] = useState<number>(count);
    const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequency>(frequency);

    const selectedScheduleHasChanged = useMemo(() => {
        return selectedCount !== count || selectedFrequency !== frequency;
    }, [count, selectedCount, frequency, selectedFrequency]);

    const maximumVariantQuantity = !Number.isNaN(Number(allowanceOverride))
        ? (allowanceOverride as number)
        : allowance;

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

            <Modal
                opened={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                title="Change delivery schedule"
                centered
                closeButtonProps={{ size: 32 }}
                classNames={{
                    inner: styles["modal-inner"],
                    header: styles["modal-header"],
                    content: styles["modal-content-thin"],
                    title: styles["modal-title"],
                    body: styles["modal-body"],
                    close: styles["modal-close"],
                }}
            >
                <p className={styles["schedule-modal-message"]}>
                    You are currently receiving {count} {`unit${count !== 1 ? "s" : ""}`} every{" "}
                    {`${subscriptionFrequencyMessage(frequency)}`}. Your next delivery is scheduled
                    for {`${dayjs(nextDate).format("MMMM D, YYYY")}`}.
                </p>

                <fieldset className={styles["schedule-modal-fieldset"]}>
                    <legend className={styles["legend"]}>Select a new delivery schedule:</legend>

                    <div className={styles["schedule-modal-fields-container"]}>
                        <div className={styles["Quantity-container"]}>
                            <Quantity
                                defaultValue={selectedCount}
                                min={1}
                                max={Math.max(1, maximumVariantQuantity)}
                                disabled={awaiting}
                                onQuantityChange={(v) => setSelectedCount(v)}
                            />
                            units
                        </div>

                        <select
                            className={styles["select"]}
                            id="update-delivery-frequency"
                            name="frequency"
                            value={selectedFrequency}
                            onChange={(e) => {
                                const { value } = e.target;
                                setSelectedFrequency(value as SubscriptionFrequency);
                            }}
                            disabled={awaiting}
                        >
                            {subscriptionFrequencyOptions.map((option) => {
                                const { frequency: value, name } = option;

                                return (
                                    <option
                                        className={styles["update-delivery-frequency-option"]}
                                        value={value}
                                        key={`update-delivery-frequency-option-${value}`}
                                    >
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </fieldset>

                {selectedScheduleHasChanged && (
                    <Button
                        onClick={() => {
                            /* Update schedule */
                        }}
                        color="rgb(241, 202, 168)"
                        variant="filled"
                        className={styles["button"]}
                        disabled={awaiting}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        Save changes
                    </Button>
                )}
            </Modal>

            <Modal
                opened={cancellationModalOpen}
                onClose={() => setCancellationModalOpen(false)}
                title="Are you sure you want to cancel this subscription?"
                centered
                closeButtonProps={{ size: 32 }}
                classNames={{
                    inner: styles["modal-inner"],
                    header: styles["modal-header"],
                    content: styles["modal-content-wide"],
                    title: styles["modal-title"],
                    body: styles["modal-body"],
                    close: styles["modal-close"],
                }}
            >
                <SubscriptionProduct data={data} />

                <p className={styles["cancellation-modal-frequency"]}>
                    Your next delivery of {count} {`unit${count !== 1 ? "s" : ""}`} is set to be
                    delivered on {`${dayjs(nextDate).format("MMMM D, YYYY")}`}.
                </p>

                <div className={styles["cancellation-modal-options"]}>
                    <Button
                        onClick={() => {
                            /* Cancel subscription */
                        }}
                        color="rgb(241, 202, 168)"
                        variant="filled"
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
