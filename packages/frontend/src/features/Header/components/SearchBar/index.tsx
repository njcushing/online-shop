import { forwardRef, useState, useEffect, useRef, useCallback } from "react";
import { Input, CloseButton, Collapse } from "@mantine/core";
import { mergeRefs } from "@/utils/mergeRefs";
import styles from "./index.module.css";

export type TSearchBar = {
    opened?: boolean;
};

export const SearchBar = forwardRef<HTMLInputElement, TSearchBar>(
    ({ opened = false }: TSearchBar, ref) => {
        const [value, setValue] = useState<string>("");
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            const { current } = inputRef;
            if (current && !opened) current.blur();
        }, [opened]);

        const focusInput = useCallback(() => {
            const { current } = inputRef;
            if (!current) return;
            if (opened) current.focus();
        }, [opened]);

        return (
            <Collapse
                in={opened}
                animateOpacity={false}
                onTransitionEnd={focusInput}
                className={styles["search-bar"]}
                data-testid="search-bar-Collapse"
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
                    ref={mergeRefs(ref, inputRef)}
                />
            </Collapse>
        );
    },
);

SearchBar.displayName = "HeaderSearchBar";
