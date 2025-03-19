import { useContext } from 'react'
import { ThemeContext } from '@/context'
import classNames from 'classnames'
import { GITHUB_URL } from '@/constants'

export default function Footer() {
    const { theme } = useContext(ThemeContext)

    return (
        <footer
            className={classNames(
                'h-footer-height w-full flex justify-center items-center',
                {
                    'bg-color-black text-color-white-light': theme === 'dark',
                    'bg-white text-color-black-light': theme === 'light',
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
