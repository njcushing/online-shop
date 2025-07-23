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

        // I'm not sure if this branch is reachable when using Mantine's Collapse component to call
        // it. I've tried firing a transitionEnd event on the component, and also recursively on its
        // children, but nothing I do seems to invoke the callback function provided to its
        // 'onTransitionEnd' prop. I'm unsure as to how the component calculates transitions under
        // the hood, and as I don't want to mock the component to preserve its integration within
        // the tests, I'm going to ignore this callback function from the coverage report for now.
        /* v8 ignore start */

        const focusInput = useCallback(() => {
            const { current } = inputRef;
            if (!current) return;
            if (opened) current.focus();
        }, [opened]);

        /* v8 ignore stop */

        return (
            <Collapse
                in={opened}
                animateOpacity={false}
                onTransitionEnd={focusInput}
                className={styles["search-bar"]}
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
