type StateConfig<T> = {
    [K in keyof T]: T[K];
};
export declare function useManager<T extends Record<string, any>>(initialState: StateConfig<T>): {
    state: T;
    updateState: <K extends keyof T>(key: K, value: T[K] | ((prevValue: T[K]) => T[K])) => void;
    deepUpdateState: (path: string, value: any | ((prevValue: any) => any)) => void;
    resetState: (newState?: Partial<T>) => void;
    bulkUpdate: (updates: Partial<T>) => void;
    getState: () => T;
};
export {};
