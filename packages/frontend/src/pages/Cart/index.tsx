import { CartContent } from "@/features/Cart/components/CartContent";
import styles from "./index.module.css";

export function Cart() {
    return (
        <div className={styles["page"]}>
            <CartContent />
        </div>
    );
}
