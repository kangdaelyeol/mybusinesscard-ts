import { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import CardDisplay from '@/components/CardDisplay'
import CardEditor from '@/components/CardEditor'
import CreateCard from '@/components/CreateCard'
import useMain from '@/hooks/useMain'

export default function Main() {
    const { theme } = useContext(ThemeContext)
    const { cards, createCard, showCreateCard } = useMain()

    return (
        <div
            className={classNames(
                'py-header-height min-h-[100vh] mb-footer-height',
                {
                    'bg-color-white': theme === 'light',
                    'bg-color-black-semilight': theme === 'dark',
                },
            )}
        >
            {cards.length === 0 && (
                <div
                    className={classNames(
                        'mx-auto flex h-[500px] mb-[0px] justify-center items-center flex-col text-[30px] font-semibold',
                        {
                            'text-color-gray-light': theme === 'dark',
                            'text-color-black': theme === 'light',
                        },
                    )}
                >
                    <span>You don't have any cards!🥲</span>
                    <span className="mt-[10px]">Make your first card!</span>
                    <button
                        onClick={showCreateCard}
                        className={classNames(
                            'mt-[10px] px-[20px] py-[10px] rounded-[20px]',
                            {
                                'btn-dark': theme === 'dark',
                                'btn-light': theme === 'light',
                            },
                        )}
                    >
                        Create Card
                    </button>
                </div>
            )}
            <div className="max-w-[1100px] overflow-scroll mx-auto flex flex-col gap-[20px]">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="flex gap-[20px] max-medium:flex-col-reverse max-medium:mt-[20px]"
                    >
                        <CardEditor card={card} />
                        <CardDisplay card={card} />
                    </div>
                ))}
            </div>
            <div
                className={classNames(
                    'fixed bottom-[20px] right-[20px] w-[40px] h-[40px] flex justify-center items-center cursor-pointer rounded-[50%]',
                    {
                        'bg-color-white/40 hover:bg-color-white text-color-gray hover:text-color-black':
                            theme === 'dark',
                        'bg-color-blue/40 hover:bg-color-blue text-color-white hover:bg-color-blue-light':
                            theme === 'light',
                    },
                )}
                onClick={showCreateCard}
            >
                <span className="material-symbols-outlined font-lightbold text-[30px]">
                    add
                </span>
            </div>
            {createCard && <CreateCard />}
        </div>
    )
}
