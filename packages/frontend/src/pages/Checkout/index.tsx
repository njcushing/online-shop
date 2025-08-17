import { CheckoutContent } from "@/features/CheckoutContent";
import styles from "./index.module.css";

export function Checkout() {
    return (
        <div className={styles["page"]}>
            <CheckoutContent />
        </div>
    );
}
