import sha256 from 'crypto-js/sha256'

export const cloudinaryHelper = {
    generateSignatureSHA1: (publicId: string, apiSecret: string) => {
        const timestamp = new Date().getTime()
        return sha256(
            `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`,
        )
    },
}
