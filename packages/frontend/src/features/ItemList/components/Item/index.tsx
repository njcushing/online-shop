import { Link } from "react-router-dom";
import { Image } from "@mantine/core";
import styles from "./index.module.css";

export function Item() {
    return (
        <Link to="/p/product" className={styles["item"]}>
            <Image className={styles["item-image"]} />
            <p className={styles["item-name"]}>Item Name</p>
            <span className={styles["item-price"]}>Item Price</span>
        </Link>
    );
}
