import { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import { CardDisplay, CreateCard, CardEditor } from '@/components'
import { useMain } from '@/hooks'

export const Main = () => {
    const { theme } = useContext(ThemeContext)
    const { cards, createCard, showCreateCard } = useMain()

    return (
        <div
            className={classNames(
                'py-header-height min-h-[100vh] mb-footer-height-margin',
                {
                    'bg-white': theme === 'light',
                    'bg-black-semilight': theme === 'dark',
                },
            )}
        >
            {cards.length === 0 && (
                <div
                    className={classNames(
                        'mx-auto flex h-[500px] mb-[0px] justify-center items-center flex-col text-[30px] font-semibold',
                        {
                            'text-gray-light': theme === 'dark',
                            'text-black': theme === 'light',
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
                        'bg-white/40 hover:bg-white text-gray hover:text-black':
                            theme === 'dark',
                        'bg-blue/40 hover:bg-blue text-white hover:bg-blue-light':
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
