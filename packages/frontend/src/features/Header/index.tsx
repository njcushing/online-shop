import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useResizeObserver } from "@mantine/hooks";
import { HeaderContext } from "@/pages/Root";
import { Navigation } from "./components/Navigation";
import styles from "./index.module.css";

export type THeader = {
    disableActivity?: boolean;
    reduced?: boolean;
};

export function Header({ disableActivity, reduced }: THeader) {
    const { setHeaderInfo } = useContext(HeaderContext);

    const [headerRef, headerRect] = useResizeObserver();
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    useEffect(() => setHeaderHeight(headerRect.height), [headerRect]);

    const baseRef = useRef<HTMLDivElement>(null);

    // Mocking ResizeObserver doesn't seem to work when manually triggering the callback function
    // provided to the API; the useEffect above that depends on headerRect doesn't set the
    // headerHeight state. I'll continue to play around with it and try to find a solution that
    // allows me to test this code in jsdom
    /* v8 ignore start */

    const lastScrollPos = useRef<number>(0);
    const [active, setActive] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(document.body.getBoundingClientRect().top === 0);
    const forceClosedIds = useRef<Set<string>>(new Set());
    const scrollDirectionCheck = useCallback(() => {
        if (disableActivity) {
            setActive(false);
            setOpen(true);
            return;
        }

        const newScrollPos = document.body.getBoundingClientRect().top;
        setOpen(forceClosedIds.current.size === 0 && newScrollPos > lastScrollPos.current);
        lastScrollPos.current = newScrollPos;

        if (headerRef.current && baseRef.current) {
            const { y } = baseRef.current.getBoundingClientRect();
            setActive(-y >= headerHeight);
        } else {
            setActive(false);
        }
    }, [disableActivity, headerRef, headerHeight]);
    useEffect(() => {
        window.addEventListener("scroll", scrollDirectionCheck);

        return () => {
            window.removeEventListener("scroll", scrollDirectionCheck);
        };
    }, [scrollDirectionCheck, disableActivity]);

    /* v8 ignore stop */

    const forceClose = useCallback((state: boolean, id: string) => {
        if (!state) {
            if (forceClosedIds.current.has(id)) {
                forceClosedIds.current.delete(id);
            }
        } else {
            forceClosedIds.current.add(id);
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        setHeaderInfo({ active, open, height: headerHeight, forceClose });
    }, [setHeaderInfo, headerHeight, active, open, forceClose]);

    return (
        <>
            <div className={styles["base"]} ref={baseRef}></div>
            <div className={styles["background"]} style={{ height: `${headerHeight}px` }}></div>
            <header
                data-active={active}
                data-open={open}
                className={styles["header"]}
                style={{ position: disableActivity ? "relative" : "sticky" }}
                ref={headerRef}
            >
                <div className={styles["header-width-controller"]}>
                    <Navigation opened={open} reduced={reduced} />
                </div>
            </header>
        </>
    );
}
