import { DEFAULT_PROFILE_URL } from '@/constants'
import { calculateImageSize } from '@/utils'

export default function ImgDisplay({ size, profile }) {
    const { width, height, rounded, transX, transY, scale } = profile.style

    const { newHeight, newWidth } = calculateImageSize(width, height, size)

    return (
        <div
            className="relative overflow-hidden rounded-[var(--img-rounded)] w-[var(--img-size)] h-[var(--img-size)]"
            style={{
                '--img-size': `${size}px`,
                '--img-rounded': `${rounded}%`,
            }}
        >
            <img
                src={profile.url || DEFAULT_PROFILE_URL}
                alt="profile"
                width={newWidth}
                height={newHeight}
                className="absolute top-0 left-0 origin-top-left scale-[var(--img-scale)] translate-x-[var(--img-transX)] translate-y-[var(--img-transY)]"
                style={{
                    '--img-scale': scale,
                    '--img-transX': `-${transX}%`,
                    '--img-transY': `-${transY}%`,
                }}
            />
        </div>
    )
}
