import { CSSProperties } from "react";
import { Divider, Progress } from "@mantine/core";
import { v4 as uuid } from "uuid";
import { BlendData } from "../../blendData";
import styles from "./index.module.css";

const intensityColours: CSSProperties["color"][] = [
    "#7f7171",
    "#776a6a",
    "#706262",
    "#685b5b",
    "#615454",
    "#594d4d",
    "#524646",
    "#4b3f3f",
    "#443838",
    "#3d3232",
    "#362b2b",
    "#302525",
    "#291f1f",
];

export type TPanel = {
    data: BlendData;
};

export function Panel({ data }: TPanel) {
    const { name, origins, description, intensity } = data;

    return (
        <div className={styles["panel"]}>
            <div className={styles["content-top"]}>
                <p className={styles["name"]}>{name}</p>

                <div className={styles["flags"]}>
                    <Divider orientation="vertical" className={styles["Divider"]} />

                    {origins.map((origin) => (
                        <div className={`fi fi-${origin} ${styles["flag"]}`} key={origin}></div>
                    ))}
                </div>
            </div>

            <Divider className={styles["Divider"]} />

            <div className={styles["content-main"]}>
                <div className={styles["content-left"]}>
                    <p className={styles["description"]}>{description}</p>

                    <Divider className={styles["Divider"]} />

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
                                                ? intensityColours[intensity - 1]
                                                : "rgba(0, 0, 0, 0.2)"
                                        }
                                        key={uuid()}
                                    ></Progress.Section>
                                );
                            })}
                        </Progress.Root>
                    </div>
                </div>

                <Divider orientation="vertical" className={styles["Divider"]} />

                <div className={styles["content-right"]}></div>
            </div>
        </div>
    );
}
