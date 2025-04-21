import { useContext, useState, useEffect, useRef } from "react";
import { useResizeObserver } from "@mantine/hooks";
import { HeaderContext } from "@/pages/Root";
import { Navigation } from "./components/Navigation";
import styles from "./index.module.css";

export function Header() {
    const { setHeaderInfo } = useContext(HeaderContext);

    const [headerRef, headerRect] = useResizeObserver();
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    useEffect(() => setHeaderHeight(headerRect.height), [headerRect]);

    const baseRef = useRef<HTMLDivElement>(null);

    const lastScrollPos = useRef<number>(0);
    const [active, setActive] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(document.body.getBoundingClientRect().top === 0);
    useEffect(() => {
        const scrollDirectionCheck = () => {
            const newScrollPos = document.body.getBoundingClientRect().top;
            setOpen(newScrollPos > lastScrollPos.current);
            lastScrollPos.current = newScrollPos;

            if (headerRef.current && baseRef.current) {
                const { y } = baseRef.current.getBoundingClientRect();
                setActive(-y >= headerHeight);
            } else {
                setActive(false);
            }
        };

        window.addEventListener("scroll", scrollDirectionCheck);

        return () => {
            window.removeEventListener("scroll", scrollDirectionCheck);
        };
    }, [headerRef, headerHeight]);

    useEffect(() => {
        setHeaderInfo({ active, open, height: headerHeight });
    }, [setHeaderInfo, headerHeight, active, open]);

    return (
        <>
            <div ref={baseRef}></div>
            <header
                className={`${styles["header"]} ${styles[active ? "active" : "inactive"]} ${styles[open ? "open" : "closed"]}`}
                ref={headerRef}
            >
                <div className={styles["header-width-controller"]}>
                    <Navigation opened={open} />
                </div>
            </header>
        </>
    );
}
