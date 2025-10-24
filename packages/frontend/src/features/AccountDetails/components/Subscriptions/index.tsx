import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { useScrollIntoView } from "@mantine/hooks";
import { Skeleton, Divider, Pagination } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { v4 as uuid } from "uuid";
import { PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import { SubscriptionSummary } from "./components/SubscriptionSummary";
import styles from "./index.module.css";

const subscriptionsPerPage = 10;

export function Subscriptions() {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { user, subscriptions, defaultData } = useContext(UserContext);
    const { setParams, attempt } = subscriptions;

    let userData = defaultData.user;
    let subscriptionsData = defaultData.subscriptions as PopulatedSubscriptionData[];

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [
            { name: "user", context: user },
            { name: "subscriptions", context: subscriptions },
        ],
    });

    if (!contextAwaitingAny) {
        if (data.user) userData = data.user;
        if (data.subscriptions) subscriptionsData = data.subscriptions;
    }

    /**
     * Need to include this - the orders state is stored in the Root component's UserContext, and
     * its 'awaiting' field is initially set to false, meaning before the 'attempt' function is
     * called in the hook below, and subsequently the 'awaiting' field is set to true in
     * UserContext, the default orders data is shown briefly on the first couple of render cycles.
     * This check prevents that from happening.
     */
    const hasAttempted = useRef<boolean>(false);
    useEffect(() => {
        if (contextAwaitingAny) hasAttempted.current = true;
    }, [contextAwaitingAny]);

    const awaitingAny = contextAwaitingAny || !hasAttempted.current;

    const { subscriptions: subscriptionIds = [] } = userData;

    const [page, setPage] = useState<number>(0);
    const [start, end] = useMemo(() => {
        return [page * subscriptionsPerPage, page * subscriptionsPerPage + subscriptionsPerPage];
    }, [page]);

    useEffect(() => {
        setParams([{ params: { start, end } }]);
        attempt();
    }, [setParams, attempt, start, end]);

    // Don't test auto-scroll logic
    /* v8 ignore start */

    const forceCloseId = useRef<string>(uuid());
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 16 /* Top padding */,
        duration: 600,
        cancelable: false,
        easing: (t) => 1 - (1 - t) ** 2,
        onScrollFinish: () => forceClose(false, forceCloseId.current),
    });
    const [queueScroll, setQueueScroll] = useState<boolean>(false);
    useEffect(() => {
        if (!queueScroll) return undefined;

        // Ensure Review components' container repaints before smooth scroll to prevent jumping
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollIntoView();
                forceClose(true, forceCloseId.current);
                setQueueScroll(false);
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [forceClose, scrollIntoView, queueScroll]);
    useEffect(() => {
        const { current } = forceCloseId;
        return () => {
            forceClose(false, current);
        };
    }, [forceClose]);

    /* v8 ignore stop */

    return (subscriptionsData && subscriptionsData.length > 0) || awaitingAny ? (
        <div className={styles["subscriptions-container"]} ref={targetRef}>
            <Skeleton visible={awaitingAny}>
                <p
                    className={styles["subscription-count"]}
                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                >
                    {subscriptionIds.length} active subscriptions
                </p>
            </Skeleton>

            <Divider className={styles["divider"]} />

            <ul className={styles["subscriptions"]}>
                {subscriptionsData &&
                    subscriptionsData.slice(0, subscriptionsPerPage).map((subscription) => {
                        const { id } = subscription;

                        return (
                            <SubscriptionSummary
                                data={subscription}
                                awaiting={awaitingAny}
                                key={id}
                            />
                        );
                    })}
            </ul>

            <div className={styles["pagination-container"]}>
                <Pagination
                    total={Math.max(Math.ceil(subscriptionIds.length / subscriptionsPerPage), 1)}
                    value={page + 1}
                    withEdges
                    onChange={
                        /**
                         * Can't reliably test this without mocking Pagination component due to
                         * 'subscriptionsPerPage' possibly changing in future
                         */
                        /* v8 ignore start */

                        (newPageNo) => {
                            setPage(newPageNo - 1);
                            setQueueScroll(true);
                        }

                        /* v8 ignore stop */
                    }
                    disabled={awaitingAny}
                    classNames={{ control: styles["pagination-control"] }}
                />
            </div>
        </div>
    ) : (
        <p className={styles["no-subscriptions-message"]}>Nothing to show!</p>
    );
}
