import { useRef, useState } from "react";
import { Input, CloseButton, Collapse } from "@mantine/core";
import styles from "./index.module.css";

export type TSearchBar = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function SearchBar({ opened = false, onClose }: TSearchBar) {
    const [value, setValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Collapse
            in={opened}
            animateOpacity={false}
            onTransitionEnd={() => {
                const { current } = inputRef;
                if (!current) return;
                if (opened) current.focus();
                else current.blur();
            }}
        >
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
                classNames={{ wrapper: styles["input-wrapper"], input: styles["input"] }}
                ref={inputRef}
            />
        </Collapse>
    );
}
