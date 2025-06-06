import { useContext } from 'react'
import { SettingBar } from '@/components'
import { MAX_SCALE_VALUE } from '@/constants'
import { useAvatarSizing } from '@/controllers'
import { ResponsiveContext } from '@/context'
import { CardStyle, UserProfileStyle } from '@/models'
import { imageHelper } from '@/helpers'

type ImageStylingProps = {
    url: string
    style: CardStyle | UserProfileStyle
    saveProfileStyle: (style: CardStyle) => void
}

export const ImageStyling = ({
    url,
    style,
    saveProfileStyle,
}: ImageStylingProps) => {
    const {
        imgStyle,
        setScaleRate,
        setRoundedRate,
        setTransXRate,
        setTransYRate,
        handleStyleSave,
        handleExitClick,
    } = useAvatarSizing(style, saveProfileStyle)

    const { pictureSize } = useContext(ResponsiveContext)

    const { width, height, scale, rounded, transX, transY } = imgStyle

    const { newHeight, newWidth, minTransX, minTransY } =
        imageHelper.calculateImageSize(width, height, pictureSize)

    const settingBarOptionList = [
        {
            title: 'Scale',
            setRate: setScaleRate,
            minVal: 1,
            maxVal: MAX_SCALE_VALUE,
            value: scale,
        },
        {
            title: 'TranslateX',
            setRate: setTransXRate,
            minVal: 0,
            maxVal: 100 * scale - 100 + minTransX,
            value: transX,
        },
        {
            title: 'TranslateY',
            setRate: setTransYRate,
            minVal: 0,
            maxVal: 100 * scale - 100 + minTransY,
            value: transY,
        },
        {
            title: 'Round',
            setRate: setRoundedRate,
            minVal: 0,
            maxVal: 50,
            value: rounded,
        },
    ]

    return (
        <div className="bg-picture-edit w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center backdrop-blur-sm z-10">
            <div className="bg-light flex flex-col">
                <div className="text-[30px] font-bold text-white text-center mb-[20px]">
                    Set your picture display!
                </div>
                <div className="flex gap-[30px] relative">
                    <div
                        onClick={handleExitClick}
                        className="absolute top-[-51px] right-0 rounded-[50%] w-[25px] h-[25px] bg-red-400 hover:bg-red-500 cursor-pointer"
                    ></div>
                    <div
                        className="relative w-[var(--img-size)] h-[var(--img-size)] overflow-hidden border-[5px] border-gray-900 border-solid"
                        style={
                            {
                                '--img-size': `${pictureSize}px`,
                            } as React.CSSProperties
                        }
                    >
                        <img
                            className="absolute picture-filter scale-[var(--img-scale)] origin-top-left translate-x-[var(--img-translateX)] translate-y-[var(--img-translateY)]"
                            src={url}
                            alt="resized picture"
                            width={newWidth}
                            height={newHeight}
                            style={
                                {
                                    '--img-scale': scale,
                                    '--img-translateX': `-${transX}%`,
                                    '--img-translateY': `-${transY}%`,
                                } as React.CSSProperties
                            }
                        />

                        <div
                            className="absolute top-0 left-0 w-full h-full rounded-[var(--picture-rounded)] overflow-hidden"
                            style={
                                {
                                    '--picture-rounded': `${rounded}%`,
                                } as React.CSSProperties
                            }
                        >
                            <img
                                className="absolute scale-[var(--img-scale)] translate-x-[var(--img-translateX)] translate-y-[var(--img-translateY)] origin-top-left"
                                src={url}
                                alt="resized picture"
                                width={newWidth}
                                height={newHeight}
                                style={
                                    {
                                        '--img-scale': scale,
                                        '--img-translateX': `-${transX}%`,
                                        '--img-translateY': `-${transY}%`,
                                    } as React.CSSProperties
                                }
                            />
                        </div>
                    </div>

                    <div
                        className="flex flex-col h-[400px] w-[var(--bar-width)]"
                        style={
                            {
                                '--bar-width': `${pictureSize}px`,
                            } as React.CSSProperties
                        }
                    >
                        {settingBarOptionList.map((option) => (
                            <SettingBar key={option.title} {...option} />
                        ))}

                        <button
                            onClick={handleStyleSave}
                            className="btn-light p-[10px] mt-[20px]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
