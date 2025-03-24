export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[P]> : T[P]
}
