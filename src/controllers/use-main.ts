import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PubSubContext } from '@/context'
import { RootState } from '@/store'
import { PUBSUB_EVENT_TYPES } from '@/context/types'

export const useMain = () => {
    useEffect(() => {
        import('@/components/create-card')
        import('@/components/card-maker')
    }, [])
    const cards = useSelector((state: RootState) => state.cards)

    const [createCard, setCreateCard] = useState<boolean>(false)

    const { subscribe, unSubscribe } = useContext(PubSubContext)

    const showCreateCard = () => setCreateCard(true)

    useEffect(() => {
        const hideCreateCard = () => {
            setCreateCard(false)
        }
        subscribe(PUBSUB_EVENT_TYPES.HIDE_CREATE_CARD, hideCreateCard)

        return () => {
            unSubscribe(PUBSUB_EVENT_TYPES.HIDE_CREATE_CARD, hideCreateCard)
        }
    }, [])

    return { cards, createCard, showCreateCard }
}
