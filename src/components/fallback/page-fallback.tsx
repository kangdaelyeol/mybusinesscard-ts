import { ThemeContext } from '@/context'
import classNames from 'classnames'
import { useContext } from 'react'

export const PageFallback = () => {
    const { theme } = useContext(ThemeContext)

    return (
        <div
            className={classNames(
                'py-header-height  h-[100vh] mb-footer-height-margin',
                {
                    'bg-white': theme === 'light',
                    'bg-black-semilight': theme === 'dark',
                },
            )}
        >
            <div className="h-full w-full flex justify-center items-center gap-[5px]">
                <svg
                    className="animate-spin shrink-0 h-[100px] w-[100px] mr-1 border-white border-[15px] border-t-transparent rounded-[50%]"
                    viewBox="0 0 24 24"
                ></svg>
            </div>
        </div>
    )
}
