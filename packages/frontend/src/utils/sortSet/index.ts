export const sortSet = (values: Set<string>): Set<string> => {
    return new Set(
        [...values].sort((a, b) => {
            const numA = Number(a);
            const numB = Number(b);

            const isNumA = !Number.isNaN(numA);
            const isNumB = !Number.isNaN(numB);

            if (isNumA && isNumB) return numA - numB;
            if (isNumA) return -1;
            if (isNumB) return 1;
            return a.localeCompare(b);
        }),
    );
};
