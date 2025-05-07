export const generateDateWithinRandomRange = (start: Date, end: Date): Date => {
    const startTime = start.getTime();
    const endTime = end.getTime();

    return new Date(Math.min(startTime, endTime) + Math.random() * Math.abs(endTime - startTime));
};
