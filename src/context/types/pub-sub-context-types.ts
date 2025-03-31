export const PUBSUB_EVENT_TYPES = {
    HIDE_PROFILE_DETAIL: 'HIDE_PROFILE_DETAIL',
    HIDE_IMAGE_STYLING: 'HIDE_IMAGE_STYLING',
    HIDE_CREATE_CARD: 'HIDE_CREATE_CARD',
} as const

export type TopicType = keyof typeof PUBSUB_EVENT_TYPES

interface TopicParamMap {
    HIDE_PROFILE_DETAIL: undefined
    HIDE_IMAGE_STYLING: undefined
    HIDE_CREATE_CARD: undefined
}

export type SubscribeHandlerType<T extends TopicType> = (
    param: TopicParamMap[T],
) => void

export type SubscribersMapType = {
    [K in TopicType]?: SubscribeHandlerType<K>[]
}

export type PublishParamType<T extends TopicType> = TopicParamMap[T]

export interface PubSubContextType {
    subscribe: <T extends TopicType>(
        topic: T,
        handler: SubscribeHandlerType<T>,
    ) => void
    publish: <T extends TopicType>(topic: T, data?: PublishParamType<T>) => void
    unSubscribe: <T extends TopicType>(
        topic: T,
        handler: SubscribeHandlerType<T>,
    ) => void
}
