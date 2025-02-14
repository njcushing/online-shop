import { Header } from "@/features/Header";
import { Hero } from "@/features/Hero";
import styles from "./index.module.css";

export function Home() {
    return (
        <div className={styles["page"]}>
            <Header />
            <Hero />
        </div>
    );
}
