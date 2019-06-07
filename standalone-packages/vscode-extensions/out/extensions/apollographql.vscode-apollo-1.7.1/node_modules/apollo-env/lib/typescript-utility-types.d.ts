export declare type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
//# sourceMappingURL=typescript-utility-types.d.ts.map