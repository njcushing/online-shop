import { Hero } from "./components/Hero";
import { InfoMarquee } from "./components/InfoMarquee";
import { CoffeeBlendInfoPanels } from "../CoffeeBlendInfoPanels";
import { CategoryCards } from "./components/CategoryCards";
import { SustainabilityBanner } from "./components/SustainabilityBanner";
import styles from "./index.module.css";

export function HomepageContent() {
    return (
        <div className={styles["homepage-content"]}>
            <Hero />
            <InfoMarquee />
            <CoffeeBlendInfoPanels />
            <CategoryCards />
            <SustainabilityBanner />
        </div>
    );
}
