import { Header } from "@/features/Header";
import styles from "./index.module.css";

export function Home() {
    return (
        <div className={styles["page"]}>
            <Header />
        </div>
    );
}
