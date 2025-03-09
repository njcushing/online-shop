import { useState, useEffect, useRef } from "react";
import { Navigation } from "./components/Navigation";
import styles from "./index.module.css";

export function Header() {
    const headerRef = useRef<HTMLElement>(null);
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
                const { height } = headerRef.current.getBoundingClientRect();
                setActive(-y >= height);
            } else {
                setActive(false);
            }
        };

        window.addEventListener("scroll", scrollDirectionCheck);

        return () => window.removeEventListener("scroll", scrollDirectionCheck);
    }, []);

    return (
        <>
            <div ref={baseRef}></div>
            <header
                className={`${styles["header"]} ${styles[active ? "active" : "inactive"]} ${styles[open ? "open" : "closed"]}`}
                ref={headerRef}
            >
                <div className={styles["header-width-controller"]}>
                    <Navigation />
                </div>
            </header>
        </>
    );
}
