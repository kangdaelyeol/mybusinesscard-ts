import { useContext } from 'react'
import classNames from 'classnames'
import { useSettingBar } from '@/controllers'
import { ResponsiveContext } from '@/context'

type SettingBarProps = {
    setRate: (value: number) => void
    title: string
    minVal: number
    maxVal: number
    value: number
}

export const SettingBar = ({
    setRate,
    title,
    minVal,
    maxVal,
    value,
}: SettingBarProps) => {
    const { barWidth } = useContext(ResponsiveContext)
    const {
        handleBarMove,
        handleMouseClear,
        handleMouseDown,
        barRate,
        isDisable,
    } = useSettingBar(minVal, maxVal, setRate, value, barWidth)

    return (
        <div className="relative mb-[30px] max-medium:mb-[20px]">
            <div className="text-white mb-[15px] font-bold text-[20px] max-medium:text-[15px] max-medium:mb-[8px]">
                {title}
            </div>
            <div
                className={classNames(
                    'absolute w-[var(--bar-width)] h-[10px] my-auto border-1px border-solid border-black box-border',
                    {
                        'bg-white': isDisable === false,
                        'bg-gray-900': isDisable === true,
                    },
                )}
                style={
                    {
                        '--bar-width': `${barWidth}px`,
                    } as React.CSSProperties
                }
            >
                {!isDisable && (
                    <>
                        <div
                            className="h-[200%] w-[20px] absolute top-[-50%] left-[var(--controller-x)] rounded-[50%] bg-blue"
                            style={
                                {
                                    '--controller-x': `${
                                        barRate * barWidth - 10
                                    }px`,
                                } as React.CSSProperties
                            }
                        ></div>
                        <div
                            className="absolute h-full top-0 left-0 w-[var(--bar-width)] bg-blue"
                            style={
                                {
                                    '--bar-width': `${barRate * barWidth}px`,
                                } as React.CSSProperties
                            }
                        ></div>
                    </>
                )}

                <div
                    onMouseMove={handleBarMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseClear}
                    onMouseLeave={handleMouseClear}
                    className="absolute top-0 left-0 w-full h-full cursor-pointer"
                ></div>
            </div>
        </div>
    )
}
