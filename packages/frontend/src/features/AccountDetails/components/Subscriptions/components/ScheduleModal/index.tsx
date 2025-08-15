import { useState, useMemo, useEffect } from "react";
import { Button, Modal } from "@mantine/core";
import {
    frequencies,
    SubscriptionFrequency,
    PopulatedSubscriptionData,
} from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import { Quantity } from "@/components/Inputs/Quantity";
import styles from "./index.module.css";

export type TScheduleModal = {
    data: PopulatedSubscriptionData;
    opened: boolean;
    onClose: () => unknown;
    onChange?: (newValues: { count: number; frequency: SubscriptionFrequency }) => unknown;
    awaiting: boolean;
};

export function ScheduleModal({ data, opened, onClose, onChange, awaiting }: TScheduleModal) {
    const { count, frequency, nextDate, product, variant } = data;
    const { allowance } = product;
    const { allowanceOverride } = variant;

    const [selectedCount, setSelectedCount] = useState<number>(count);
    const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequency>(frequency);

    useMemo(() => setSelectedCount(count), [count]);
    useMemo(() => setSelectedFrequency(frequency), [frequency]);

    const hasChanged = useMemo(() => {
        return selectedCount !== count || selectedFrequency !== frequency;
    }, [count, selectedCount, frequency, selectedFrequency]);

    useEffect(() => {
        if (hasChanged) {
            if (onChange) onChange({ count: selectedCount, frequency: selectedFrequency });
        }
    }, [onChange, selectedCount, selectedFrequency, hasChanged]);

    const maximumVariantQuantity =
        typeof allowanceOverride === "number" && !Number.isNaN(allowanceOverride)
            ? (allowanceOverride as number)
            : allowance;

    return (
        <Modal
            opened={opened}
            onClose={() => onClose && onClose()}
            title="Change delivery schedule"
            centered
            closeButtonProps={{ "aria-label": "Close", size: 32 }}
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
                {`${frequencies[frequency].text}`}. Your next delivery is scheduled for{" "}
                {`${dayjs(nextDate).format("MMMM D, YYYY")}`}.
            </p>

            <fieldset className={styles["fieldset"]}>
                <legend className={styles["legend"]}>Select a new delivery schedule:</legend>

                <div className={styles["fields-container"]}>
                    <div className={styles["Quantity-container"]}>
                        <Quantity
                            defaultValue={selectedCount}
                            min={1}
                            max={Math.max(1, maximumVariantQuantity)}
                            disabled={awaiting}
                            onQuantityChange={(v) => {
                                setSelectedCount(v);
                            }}
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
                        {Object.entries(frequencies).map((entry) => {
                            const [key, value] = entry;
                            const { optionName } = value;

                            return (
                                <option
                                    className={styles["frequency-option"]}
                                    value={key}
                                    key={`frequency-option-${key}`}
                                >
                                    {optionName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </fieldset>

            {hasChanged && (
                <Button
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
    );
}
