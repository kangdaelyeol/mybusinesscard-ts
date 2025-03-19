import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PubSubContext, EVENT_TYPES } from '@/context'

export default function useMain() {
    const cards = useSelector((state) => state.cards)

    const [createCard, setCreateCard] = useState(false)

    const { subscribe, unSubscribe } = useContext(PubSubContext)

    const showCreateCard = () => setCreateCard(true)

    useEffect(() => {
        const hideCreateCard = () => {
            setCreateCard(false)
        }
        subscribe(EVENT_TYPES.HIDE_CREATE_CARD, hideCreateCard)

        return () => {
            unSubscribe(EVENT_TYPES.HIDE_CREATE_CARD, hideCreateCard)
        }
    }, [])

    return { cards, createCard, showCreateCard }
}
