export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type GenericImage = {
    src: string;
    alt: string;
};
