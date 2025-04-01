import { useState } from "react";
import { Input, CloseButton, Collapse } from "@mantine/core";
import styles from "./index.module.css";

export type TSearchBar = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function SearchBar({ opened = false, onClose }: TSearchBar) {
    const [value, setValue] = useState<string>("");

    return (
        <Collapse in={opened} animateOpacity={false}>
            <Input
                placeholder="Search for a product"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                mt="md"
                rightSection={
                    <CloseButton
                        aria-label="Clear input"
                        onClick={() => setValue("")}
                        style={{ display: value ? undefined : "none" }}
                    />
                }
                autoFocus
                classNames={{ wrapper: styles["input-wrapper"], input: styles["input"] }}
            />
        </Collapse>
    );
}
