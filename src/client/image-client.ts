import axios from 'axios'
import { cloudinaryHelper } from '@/helpers'
import {
    MAX_PROFILE_SIZE,
    CLOUDINARY_DELETE_REQUEST_URL,
    CLOUDINARY_UPLOAD_REQUEST_URL,
} from '@/constants'
import { ClientResponse } from '@/client/types'

export const imageClient = {
    uploadInCloudinary: async (file: File): Promise<ClientResponse<any>> => {
        if (file?.size > MAX_PROFILE_SIZE || !file.type.startsWith('image')) {
            return {
                status: 400,
                reason: "Maximum size of file is 3MB or type of file should be 'image'",
            }
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', import.meta.env.VITE_API_KEY)
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)

        try {
            const res = await axios.post(
                CLOUDINARY_UPLOAD_REQUEST_URL,
                formData,
            )

            return { status: res.status, data: res.data }
        } catch (e) {
            console.error(e)
            return { status: 500, reason: 'Failed to upload in Cloudinary' }
        }
    },

    deleteInCloudinary: async (
        assetId: string,
        publicId: string,
    ): Promise<ClientResponse> => {
        if (assetId === '') {
            return {
                status: 400,
                reason: 'Unexpected Error in Upload Image API',
            }
        }
        const formData = new FormData()

        const timestamp = cloudinaryHelper.getTimestamp()

        const sigSHA1 = cloudinaryHelper.generateSignatureSHA1(
            publicId,
            timestamp,
        )

        formData.append('asset_id', assetId)
        formData.append('public_id', publicId)
        formData.append('timestamp', timestamp)
        formData.append('api_key', import.meta.env.VITE_API_KEY)
        formData.append('signature', sigSHA1.toString())
        try {
            await axios.post(CLOUDINARY_DELETE_REQUEST_URL, formData)
            return {
                status: 200,
            }
        } catch (e) {
            console.error(e)
            return {
                status: 500,
                reason: 'Unexpected Error in Delete Image API',
            }
        }
    },
}
