export type StringifyDates<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends object
        ? StringifyDates<T[K]>
        : T[K];
};
