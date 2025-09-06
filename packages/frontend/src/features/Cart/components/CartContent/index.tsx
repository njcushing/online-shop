import { CartSummary } from "@/features/Cart/components/CartSummary";
import styles from "./index.module.css";

export function CartContent() {
    return (
        <section className={styles["cart-content"]}>
            <div className={styles["cart-content-width-controller"]}>
                <CartSummary layout="visible" />
            </div>
        </section>
    );
}
