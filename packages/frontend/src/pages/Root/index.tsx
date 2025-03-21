import { Outlet } from "react-router-dom";
import { Header } from "@/features/Header";
import { Home } from "../Home";
import { Category } from "../Category";
import { Product } from "../Product";
import { ErrorPage } from "../ErrorPage";
import styles from "./index.module.css";

export const Routes = [
    {
        path: "",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "c/*",
        element: <Category />,
        errorElement: <ErrorPage />,
    },
    {
        path: "p/:productSlug",
        element: <Product />,
        errorElement: <ErrorPage />,
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
