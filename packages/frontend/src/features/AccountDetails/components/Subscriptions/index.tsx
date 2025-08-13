import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext, IUserContext, UserContext } from "@/pages/Root";
import { useScrollIntoView } from "@mantine/hooks";
import { Skeleton, Divider, Pagination } from "@mantine/core";
import { v4 as uuid } from "uuid";
import { SubscriptionSummary } from "./components/SubscriptionSummary";
import styles from "./index.module.css";

const subscriptionsPerPage = 10;

export function Subscriptions() {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { user, subscriptions, defaultData } = useContext(UserContext);

    const { response: userResponse } = user;
    const { response: subscriptionsResponse, setParams, attempt, awaiting } = subscriptions;

    const { data: userData } = userResponse;
    const { data: subscriptionsData } = subscriptionsResponse;

    const { subscriptions: subscriptionIds = [] } = userData || {};

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

    const data =
        subscriptionsData ||
        (defaultData.subscriptions as NonNullable<
            IUserContext["subscriptions"]["response"]["data"]
        >);

    return (data && data.length > 0) || awaiting ? (
        <div className={styles["subscriptions-container"]} ref={targetRef}>
            <Skeleton visible={awaiting}>
                <p
                    className={styles["subscription-count"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {subscriptionIds.length} active subscriptions
                </p>
            </Skeleton>

            <Divider className={styles["divider"]} />

            <ul className={styles["subscriptions"]}>
                {data.slice(0, subscriptionsPerPage).map((subscription) => {
                    const { id } = subscription;

                    return <SubscriptionSummary data={subscription} key={id} />;
                })}
            </ul>

            <div className={styles["pagination-container"]}>
                <Pagination
                    // Adding data-testid attribute to test onChange logic; Pagination component
                    // doesn't have an accessible role and the page buttons' text content
                    // (numbers) often conflict with the other elements' text content.
                    data-testid="pagination"
                    total={Math.ceil(subscriptionIds.length / subscriptionsPerPage)}
                    value={page + 1}
                    withEdges
                    onChange={(newPageNo) => {
                        setPage(newPageNo - 1);
                        setQueueScroll(true);
                    }}
                    disabled={awaiting}
                    classNames={{ control: styles["pagination-control"] }}
                />
            </div>
        </div>
    ) : (
        <p className={styles["no-subscriptions-message"]}>Nothing to show!</p>
    );
}
