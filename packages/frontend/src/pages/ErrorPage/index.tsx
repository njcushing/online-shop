import { Link } from "react-router-dom";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import styles from "./index.module.css";

/* Breaking personal page naming convention to prevent clash with Error API */

export type TErrorPage = {
    hideHeader?: boolean;
    hideFooter?: boolean;
    height?: "page" | "fill";
};

export function ErrorPage({ hideHeader, hideFooter, height = "page" }: TErrorPage) {
    return (
        <div className={styles["error-page"]} data-height={height}>
            {!hideHeader && <Header disableActivity reduced />}

            <div className={styles["error-page-width-controller"]}>
                <h1
                    className={styles["header"]}
                >{`Oh no! There doesn't seem to be anything here`}</h1>

                <Link to="/" className={styles["link"]}>
                    Return to home
                </Link>
            </div>

            {!hideFooter && <Footer reduced />}
        </div>
    );
}
