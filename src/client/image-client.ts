import axios from 'axios'
import { cloudinaryHelper } from '@/helpers'
import {
    MAX_PROFILE_SIZE,
    CLOUDINARY_DELETE_REQUEST_URL,
    CLOUDINARY_UPLOAD_REQUEST_URL,
} from '@/constants'
import {
    UploadCloudinaryResponse,
    DeleteCloudinaryResponse,
} from '@/client/types'

export const imageClient = {
    uploadInCloudinary: async (
        file: File,
    ): Promise<UploadCloudinaryResponse> => {
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
            return { status: 400, reason: 'Failed to upload in Cloudinary' }
        }
    },

    deleteInCloudinary: async (
        assetId: string,
        publicId: string,
    ): Promise<DeleteCloudinaryResponse> => {
        if (assetId === '') {
            return {
                status: 400,
                reason: 'Unexpected Error in Upload Image API',
            }
        }
        const formData = new FormData()

        const sigSHA1 = cloudinaryHelper.generateSignatureSHA1(
            publicId,
            import.meta.env.VITE_CLOUDINARY_API_SECRET,
        )

        formData.append('asset_id', assetId)
        formData.append('public_id', publicId)
        formData.append('timestamp', new Date().getTime().toString())
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
                status: 400,
                reason: 'Unexpected Error in Delete Image API',
            }
        }
    },
}
