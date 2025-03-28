import { createContext, useState } from 'react'
import { TOAST_MESSAGE_TIMER } from '@/constants'
import { ContextProps, ToasterMessageContextType } from '@/context/types'

export const ToasterMessageContext = createContext<ToasterMessageContextType>({
    toasterMessage: '',
    setToasterMessageTimeOut: () => {},
})

export const ToasterMessageProvider = ({ children }: ContextProps) => {
    const [toasterMessage, setToasterMessage] = useState<string>('')
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)

    const setToasterMessageTimeOut = (message: string) => {
        if (timerId) clearTimeout(timerId)

        const id = setTimeout(() => {
            setToasterMessage('')
            setTimerId(null)
        }, TOAST_MESSAGE_TIMER)

        setToasterMessage(message)
        setTimerId(id)
    }

    return (
        <ToasterMessageContext.Provider
            value={{ toasterMessage, setToasterMessageTimeOut }}
        >
            {children}
        </ToasterMessageContext.Provider>
    )
}
