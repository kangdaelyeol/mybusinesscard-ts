import sha256 from 'crypto-js/sha256'

export const generateSignatureSHA1 = (publicId, apiSecret) => {
    const timestamp = new Date().getTime()
    return sha256(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
}

