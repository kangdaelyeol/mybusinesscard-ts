import sha1 from 'crypto-js/sha1'

export const cloudinaryHelper = {
    generateSignatureSHA1: (publicId: string, apiSecret: string) => {
        const timestamp = new Date().getTime()
        return sha1(
            `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`,
        )
    },
}
