import { createContext, useCallback, useState } from 'react'

export const EVENT_TYPES = Object.freeze({
    HIDE_PROFILE_DETAIL: Symbol.for('HIDE_PROFILE_DETAIL'),
    HIDE_IMAGE_STYLING: Symbol.for('HIDE_IMAGE_STYLING'),
    HIDE_CREATE_CARD: Symbol.for('HIDE_CREATE_CARD'),
})

export const PubSubContext = createContext({
    subscribe: () => {},
    publish: () => {},
    unSubscribe: () => {},
})

export const PubSubProvider = ({ children }) => {
    const [subscribersMap, setSubscribersMap] = useState({})

    const subscribe = useCallback(
        (topic, handler) => {
            setSubscribersMap((prev) => {
                const newSubscribersMap = { ...prev }
                if (!newSubscribersMap[topic]) newSubscribersMap[topic] = []

                newSubscribersMap[topic].push(handler)
                return newSubscribersMap
            })
        },
        [subscribersMap],
    )

    const publish = useCallback(
        (topic, data) => {
            if (!subscribersMap[topic]) return

            subscribersMap[topic].forEach((handler) => handler(data))
        },
        [subscribersMap],
    )

    const unSubscribe = useCallback(
        (topic, handler) => {
            if (!subscribersMap[topic]) return

            setSubscribersMap((prev) => {
                const newSubscribersMap = { ...prev }
                newSubscribersMap[topic] = newSubscribersMap[topic].filter(
                    (item) => item !== handler,
                )
                return newSubscribersMap
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
