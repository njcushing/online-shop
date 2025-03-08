import { Item } from "./components/Item";
import styles from "./index.module.css";

export function ItemList() {
    return (
        <section className={styles["item-list"]}>
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
        </section>
    );
}
