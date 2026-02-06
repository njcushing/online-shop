import { useState } from "react";
import { Button, Collapse } from "@mantine/core";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function DecaffeinationBanner() {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <section className={styles["decaffeination-banner"]}>
            <h2 className={styles["decaffeination-heading"]}>
                Delicious. Delightful. <strong>Decaffeinated</strong>.
            </h2>

            <p className={styles["decaffeination-opening-text"]}>
                At Cafree we believe decaf deserves the same care as any exceptional coffee or tea.
                {`That's`} why all our products are thoughtfully decaffeinated. We take our
                high-quality, ethically-sourced beans and leaves, then remove the caffeine using
                gentle processes that preserve character, depth, and aroma. The result is everything
                you love: drinks to be enjoyed at any time of day, without compromise.
            </p>

            <Collapse in={open} className={styles["Collapse"]}>
                <div className={styles["Collapse-vertical-padding"]}></div>

                <div className={styles["decaffeination-main-sections"]}>
                    <p className={styles["decaffeination-main-section-body-text"]}>
                        We chose to decaffeinate our products because we believe great coffee and
                        tea should fit into real life, rather than dictate it. Caffeine can be a
                        wonderful stimulant, and many coffee and tea drinkers partake mainly for the
                        benefits it can provide, but it {`isn't`} always kind to our bodies and
                        routines. For many people, even smaller doses of caffeine can cause jitters,
                        anxiety, disrupted sleep, and/or acid reflux. By removing caffeine, we make
                        space for enjoyment without the side effects.
                    </p>

                    <p className={styles["decaffeination-main-section-body-text"]}>
                        Decaffeination also opens the door to balance: you can enjoy your favourite
                        cups in the evening, a second or third without hesitation, or build a daily
                        ritual that supports rest rather than working against it. For those who are
                        sensitive to caffeine, managing intake for health reasons, or simply trying
                        to be more mindful about how they feel throughout the day, decaf {`isn't`} a
                        compromise, but a choice.
                    </p>

                    <p className={styles["decaffeination-main-section-body-text"]}>
                        Just as importantly, we {`don't`} believe caffeine should be the defining
                        feature of a great drink. Flavour, origin, craft, and care matter more.
                        {`That's`} why we use gentle decaffeination methods designed to preserve the
                        natural character of each coffee bean and tea leaf. What remains is the
                        expected depth, flavours and aromas. We pride ourselves on our ability to
                        decaffeinate efficiently without sacrificing any of best qualities of our
                        coffee and tea.
                    </p>

                    <p className={styles["decaffeination-main-section-body-text"]}>
                        The method we use involves passing high-pressure, liquid carbon dioxide
                        through the beans and leaves. This natural solvent effectively binds with
                        the caffeine, removing it without touching the other flavour compounds. No
                        chemical solvents are used in the process; our chosen method of extraction
                        is significantly better for the environment than other similar methods, and
                        is the best way to preserve the natural flavours and aromas you expect in
                        every cup.
                    </p>

                    <p className={styles["decaffeination-main-section-body-text"]}>
                        To summarise, our approach is about inclusivity and intention: decaffeinated
                        products allow more people, more moments, and more moods to be part of the
                        experience of drinking genuinely great coffee and tea that works with your
                        body, not against it.
                    </p>
                </div>
            </Collapse>

            <div className={styles["Button-container"]}>
                <Button
                    onClick={() => setOpen((c) => !c)}
                    color="transparent"
                    variant="filled"
                    classNames={{ root: styles["Button-root"], label: styles["Button-label"] }}
                >
                    {open ? (
                        <>
                            <CaretUp color="black" size={20} weight="regular" />
                            Show less
                        </>
                    ) : (
                        <>
                            Find out more
                            <CaretDown color="black" size={20} weight="regular" />
                        </>
                    )}
                </Button>
            </div>
        </section>
    );
}
