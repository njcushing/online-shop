import { useMatches, Divider, Progress } from "@mantine/core";
import { v4 as uuid } from "uuid";
import { BlendData } from "../../blendData";
import styles from "./index.module.css";

export type TPanel = {
    data: BlendData;
};

export function Panel({ data }: TPanel) {
    const narrow = useMatches({ base: true, xs: false }, { getInitialValueInEffect: false });

    const { name, origins, description, notes, pairings, intensity, acidity, roast, colors } = data;

    return (
        <div
            className={styles["panel"]}
            style={{ backgroundColor: `color-mix(in srgb, white 70%, ${colors.main})` }}
        >
            <div className={styles["content-top"]}>
                <p
                    className={styles["name"]}
                    style={{ backgroundColor: `color-mix(in srgb, white 30%, ${colors.main})` }}
                >
                    {name}
                </p>

                <div
                    className={styles["flags"]}
                    style={{ backgroundColor: `color-mix(in srgb, white 30%, ${colors.main})` }}
                >
                    <Divider orientation="vertical" className={styles["Divider"]} />

                    {origins.map((origin) => (
                        <div className={`fi fi-${origin} ${styles["flag"]}`} key={origin}></div>
                    ))}
                </div>
            </div>

            <div className={styles["content-main"]}>
                <div className={styles["content-left"]}>
                    <p className={styles["description"]}>{description}</p>

                    <Divider className={styles["Divider"]} />

                    <div className={styles["content-left-second"]}>
                        <div className={styles["intensity-container"]}>
                            <p className={styles["intensity-title"]}>Intensity:</p>

                            <p className={styles["intensity-value"]}>{intensity}</p>

                            <Progress.Root
                                size="xl"
                                classNames={{
                                    root: styles["Progress-root"],
                                    section: styles["Progress-section"],
                                }}
                            >
                                {Array.from({ length: 13 }).map((e, i) => {
                                    return (
                                        <Progress.Section
                                            value={100 / 11}
                                            color={
                                                i <= intensity - 1
                                                    ? colors.main
                                                    : "rgba(0, 0, 0, 0.2)"
                                            }
                                            key={uuid()}
                                        ></Progress.Section>
                                    );
                                })}
                            </Progress.Root>
                        </div>

                        <div className={styles["acidity-container"]}>
                            <p className={styles["acidity-title"]}>Acidity:</p>

                            <p className={styles["acidity-value"]}>{acidity}</p>
                        </div>

                        <div className={styles["roast-level-container"]}>
                            <p className={styles["roast-level-title"]}>Roast Level:</p>

                            <p className={styles["roast-level-value"]}>{roast}</p>
                        </div>
                    </div>

                    <Divider className={styles["Divider"]} />

                    <div className={styles["content-left-third"]}>
                        <div className={styles["notes-container"]}>
                            <p className={styles["notes-title"]}>Tasting Notes:</p>

                            <p className={styles["notes-description"]}>{notes}</p>
                        </div>

                        <div className={styles["pairings-container"]}>
                            <p className={styles["pairings-title"]}>Pairings:</p>

                            <p className={styles["pairings-description"]}>{pairings}</p>
                        </div>
                    </div>
                </div>

                <Divider
                    orientation={narrow ? "horizontal" : "vertical"}
                    className={styles["Divider"]}
                />

                <div
                    className={styles["content-right"]}
                    style={{ backgroundColor: `color-mix(in srgb, white 84%, ${colors.main})` }}
                ></div>
            </div>
        </div>
    );
}
