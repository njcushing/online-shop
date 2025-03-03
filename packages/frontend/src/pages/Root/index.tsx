import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Home } from "../Home";
import { Product } from "../Product";
import styles from "./index.module.css";

export const Routes = [
    {
        path: "",
        element: <Home />,
        errorElement: <div></div>,
    },
    {
        path: "product/:productId",
        element: <Product />,
        errorElement: <div></div>,
    },
];

export function Root() {
    return (
        <div className={styles["page"]}>
            <Header />
            <Outlet />
        </div>
    );
}
