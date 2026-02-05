import { Hero } from "./components/Hero";
import { DecaffeinationBanner } from "./components/DecaffeinationBanner";
import { InfoMarquee } from "./components/InfoMarquee";
import { CoffeeBlendInfoPanels } from "../CoffeeBlendInfoPanels";
import { CoffeeSubcategoryCards } from "./components/CoffeeSubcategoryCards";
import { SustainabilityBanner } from "./components/SustainabilityBanner";
import { OtherCategoryCards } from "./components/OtherCategoryCards";
import styles from "./index.module.css";

export function HomepageContent() {
    return (
        <div className={styles["homepage-content"]}>
            <Hero />
            <DecaffeinationBanner />
            <InfoMarquee />
            <CoffeeBlendInfoPanels />
            <CoffeeSubcategoryCards />
            <SustainabilityBanner />
            <OtherCategoryCards />
        </div>
    );
}
