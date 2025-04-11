import sha1 from 'crypto-js/sha1'

export const cloudinaryHelper = {
    generateSignatureSHA1: (publicId: string, timestamp: string) => {
        return sha1(
            `public_id=${publicId}&timestamp=${timestamp}${
                import.meta.env.VITE_CLOUDINARY_API_SECRET
            }`,
        )
    },

    getTimestamp: (): string => {
        return new Date().getTime().toString()
    },
}
