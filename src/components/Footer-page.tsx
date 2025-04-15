import { useContext } from 'react'
import { ThemeContext } from '@/context'
import classNames from 'classnames'
import { GITHUB_URL } from '@/constants'

export const Footer = () => {
    const { theme } = useContext(ThemeContext)

    return (
        <footer
            className={classNames(
                'h-footer-height w-full flex justify-center items-center',
                {
                    'bg-black text-white-light': theme === 'dark',
                    'bg-white text-black-light': theme === 'light',
                },
            )}
        >
            <a
                href={GITHUB_URL}
                target="_blank"
                className="font-bold text-[15px] hover:underline"
            >
                rkdeofuf
            </a>
        </footer>
    )
}
