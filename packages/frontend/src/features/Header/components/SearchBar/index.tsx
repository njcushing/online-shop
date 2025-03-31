import { useState } from "react";
import { Input, CloseButton } from "@mantine/core";
import styles from "./index.module.css";

export type TSearchBar = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function SearchBar({ opened = false, onClose }: TSearchBar) {
    const [value, setValue] = useState<string>("");

    return opened ? (
        <Input
            placeholder="Search for a product"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            mt="md"
            rightSection={
                <CloseButton
                    aria-label="Clear input"
                    onClick={() => onClose && onClose()}
                    style={{ display: value ? undefined : "none" }}
                />
            }
            autoFocus
            classNames={{ wrapper: styles["input-wrapper"], input: styles["input"] }}
        />
    ) : null;
}
