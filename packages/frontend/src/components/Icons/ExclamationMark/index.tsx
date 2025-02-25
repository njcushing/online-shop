import { CSSProperties, useMemo } from "react";

export type IExclamationMark = {
    ariaLabel?: string;
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
    style?: {
        stroke?: CSSProperties["stroke"];
        strokeWidth?: CSSProperties["strokeWidth"];
    };
};

const defaultStyles: Required<IExclamationMark["style"]> = {
    stroke: "red",
    strokeWidth: "16px",
};

export function ExclamationMark({
    ariaLabel = "Error: ",
    width = "16",
    height = "16",
    style,
}: IExclamationMark) {
    const concatenatedStyles = useMemo(() => ({ ...defaultStyles, ...style }), [style]);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 180 180"
            width={width}
            height={height}
            aria-label={ariaLabel}
            style={{ flexShrink: 0 }}
        >
            <path
                fill="none"
                stroke={concatenatedStyles.stroke}
                strokeWidth={concatenatedStyles.strokeWidth}
                strokeLinecap="round"
                d="M89,9a81,81 0 1,0 2,0zm1,38v58m0,25v1"
            />
        </svg>
    );
}
