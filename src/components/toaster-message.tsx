import { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context'

type ToasterMessageProps = { message: string }

export const ToasterMessage = ({ message }: ToasterMessageProps) => {
    const { theme } = useContext(ThemeContext)
    return (
        <div className="fixed w-full bottom-[20px] left-0 z-10">
            <div
                className={classNames(
                    'w-[250px] p-[15px] font-semibold text-[17px] text-center flex justify-center items-center rounded-[10px] mx-auto',
                    {
                        'bg-white text-black': theme === 'dark',
                        'bg-blue-light text-white': theme === 'light',
                    },
                )}
            >
                {message}
            </div>
        </div>
    )
}
