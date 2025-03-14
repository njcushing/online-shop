export const createPriceAdjustmentString = (current: number, base: number): string => {
    const reduction = (current / Math.max(base, 1)) * 100 - 100;
    return `${reduction < 0 ? "" : "+"}${reduction.toFixed(0)}%`;
};
