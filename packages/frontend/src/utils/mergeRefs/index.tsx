import React from "react";

export function mergeRefs<T>(...inputRefs: (React.Ref<T> | null)[]): React.Ref<T> {
    return (value: T) => {
        inputRefs.forEach((inputRef) => {
            if (!inputRef) return;
            if (typeof inputRef === "function") {
                inputRef(value);
            } else if (inputRef && typeof inputRef === "object" && "current" in inputRef) {
                // eslint-disable-next-line no-param-reassign
                (inputRef as React.MutableRefObject<T>).current = value;
            }
        });
    };
}
