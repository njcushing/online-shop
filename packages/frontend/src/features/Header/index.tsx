import { useState, useEffect, useRef } from "react";
import { Navigation } from "./components/Navigation";
import styles from "./index.module.css";

export function Header() {
    const lastScrollPos = useRef<number>(0);
    const [openState, setOpenState] = useState<boolean>(true);
    useEffect(() => {
        const scrollDirectionCheck = () => {
            const newScrollPos = document.body.getBoundingClientRect().top;
            setOpenState(newScrollPos > lastScrollPos.current);
            lastScrollPos.current = newScrollPos;
        };

        window.addEventListener("scroll", scrollDirectionCheck);

        return () => window.removeEventListener("scroll", scrollDirectionCheck);
    }, []);

    return (
        <header className={`${styles["header"]} ${styles[openState ? "open" : "closed"]}`}>
            <Navigation />
        </header>
    );
}
