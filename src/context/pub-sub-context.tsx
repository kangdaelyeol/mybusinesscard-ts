import { createContext, useCallback, useState } from 'react'
import {
    ContextProps,
    PublishParamType,
    PubSubContextType,
    SubscribeHandlerType,
    SubscribersMapType,
    TopicType,
} from '@/context/types'

export const PubSubContext = createContext<PubSubContextType>({
    subscribe: () => {},
    publish: () => {},
    unSubscribe: () => {},
})

export const PubSubProvider = ({ children }: ContextProps) => {
    const [subscribersMap, setSubscribersMap] = useState<SubscribersMapType>({})

    const subscribe = useCallback(
        <T extends TopicType>(topic: T, handler: SubscribeHandlerType<T>) => {
            setSubscribersMap((prev) => {
                const handlerList = prev[topic] ? [...prev[topic]] : []
                handlerList.push(handler)

                return { ...prev, [topic]: handlerList }
            })
        },
        [subscribersMap],
    )

    const publish = useCallback(
        <T extends TopicType>(topic: T, data: PublishParamType<T>) => {
            if (!subscribersMap[topic]) return

            subscribersMap[topic].forEach((handler) => handler(data))
        },
        [subscribersMap],
    )

    const unSubscribe = useCallback(
        <T extends TopicType>(topic: T, handler: SubscribeHandlerType<T>) => {
            if (!subscribersMap[topic]) return

            setSubscribersMap((prev) => {
                const handlerList = (
                    prev[topic] as SubscribersMapType[T]
                )?.filter((item) => item !== handler)

                return {
                    ...prev,
                    [topic]: handlerList,
                }
            })
        },
        [subscribersMap],
    )

    return (
        <PubSubContext.Provider value={{ subscribe, publish, unSubscribe }}>
            {children}
        </PubSubContext.Provider>
    )
}
