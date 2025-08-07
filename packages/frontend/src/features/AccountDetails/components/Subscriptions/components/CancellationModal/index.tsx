import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Button, Modal } from "@mantine/core";
import { PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import { SubscriptionProduct } from "../SubscriptionProduct";
import styles from "./index.module.css";

export type TCancellationModal = {
    data: PopulatedSubscriptionData;
    opened: boolean;
    onClose: () => unknown;
};

export function CancellationModal({ data, opened, onClose }: TCancellationModal) {
    const { subscriptions } = useContext(UserContext);
    const { awaiting } = subscriptions;

    const { count, nextDate } = data;

    return (
        <Modal
            opened={opened}
            onClose={() => onClose && onClose()}
            title="Are you sure you want to cancel this subscription?"
            centered
            closeButtonProps={{ "aria-label": "Close", size: 32 }}
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

            <p className={styles["frequency-message"]}>
                Your next delivery of {count} {`unit${count !== 1 ? "s" : ""}`} is set to be
                delivered on {`${dayjs(nextDate).format("MMMM D, YYYY")}`}.
            </p>

            <Button
                color="rgb(241, 202, 168)"
                variant="filled"
                className={`${styles["button"]} ${styles["cancel-button"]}`}
                disabled={awaiting}
                style={{ visibility: awaiting ? "hidden" : "initial" }}
            >
                Yes, I&apos;m sure
            </Button>
        </Modal>
    );
}
