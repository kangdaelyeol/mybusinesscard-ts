import { DEFAULT_PROFILE_URL } from '@/constants'
import { imageHelper } from '@/helpers'
import { CardProfile, UserProfile } from '@/models'

type ImgDisplayProps = { size: number; profile: CardProfile | UserProfile }

export const ImgDisplay = ({ size, profile }: ImgDisplayProps) => {
    const { width, height, rounded, transX, transY, scale } = profile.style

    const { newHeight, newWidth } = imageHelper.calculateImageSize(
        width,
        height,
        size,
    )

    return (
        <div
            className="relative overflow-hidden rounded-[var(--img-rounded)] w-[var(--img-size)] h-[var(--img-size)]"
            style={
                {
                    '--img-size': `${size}px`,
                    '--img-rounded': `${rounded}%`,
                } as React.CSSProperties
            }
        >
            <img
                src={profile.url || DEFAULT_PROFILE_URL}
                alt="profile"
                width={newWidth}
                height={newHeight}
                className="absolute top-0 left-0 origin-top-left scale-[var(--img-scale)] translate-x-[var(--img-transX)] translate-y-[var(--img-transY)]"
                style={
                    {
                        '--img-scale': scale,
                        '--img-transX': `-${transX}%`,
                        '--img-transY': `-${transY}%`,
                    } as React.CSSProperties
                }
            />
        </div>
    )
}
