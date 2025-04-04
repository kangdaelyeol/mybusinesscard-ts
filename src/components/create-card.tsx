import { CardProvider } from '@/context'
import { CardDisplay, CardMaker } from '@/components'
import { useContext } from 'react'
import { PubSubContext } from '@/context'
import { PUBSUB_EVENT_TYPES } from '@/context/types'

export const CreateCard = () => {
    const { publish } = useContext(PubSubContext)

    const hideCreateCard = () => {
        publish(PUBSUB_EVENT_TYPES.HIDE_CREATE_CARD)
    }

    return (
        <div className="fixed top-0 left-0 flex flex-col justify-center items-center w-full h-full z-10 bg-black/90">
            <div className="relative flex flex-col">
                <div className="text-white text-[30px] text-center font-semibold">
                    Create Your Card!
                </div>

                <div className="flex gap-[20px] max-medium:flex-col-reverse mt-[30px]">
                    <CardProvider>
                        <CardMaker />
                        <CardDisplay />
                    </CardProvider>
                </div>
                <div
                    onClick={hideCreateCard}
                    className="absolute top-[5px] right-[30px] w-[30px] h-[30px] rounded-[50%] bg-red-500 hover:bg-red-400 cursor-pointer"
                ></div>
            </div>
        </div>
    )
}
