import { imageClient } from '@/client'
import {
    CloudinaryImage,
    SERVICE_ERROR_TYPE,
    ServiceResponse,
} from '@/services/types'

export const cloudinaryService = {
    uploadImage: async (
        file: File,
    ): Promise<ServiceResponse<CloudinaryImage>> => {
        const uploadInCloudinaryRes = await imageClient.uploadInCloudinary(file)

        if (
            uploadInCloudinaryRes.status === 200 &&
            'data' in uploadInCloudinaryRes
        ) {
            const { url, asset_id, public_id, width, height } =
                uploadInCloudinaryRes.data

            return {
                ok: true,
                data: { url, asset_id, public_id, width, height },
            }
        } else if (
            uploadInCloudinaryRes.status === 400 &&
            'reason' in uploadInCloudinaryRes
        ) {
            console.error(
                `Error - uploadInClodinary: ${uploadInCloudinaryRes.reason}`,
            )
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.API_ERROR,
                reason: uploadInCloudinaryRes.reason,
            }
        } else {
            throw new Error('Unexpected Error in cloudinaryService - upload')
        }
    },

    deleteImage: async (
        assetId: string,
        publicId: string,
    ): Promise<ServiceResponse> => {
        const deleteInCloudinaryRes = await imageClient.deleteInCloudinary(
            assetId,
            publicId,
        )

        if (deleteInCloudinaryRes.status === 200) return { ok: true }
        else if (
            deleteInCloudinaryRes.status === 400 &&
            'reason' in deleteInCloudinaryRes
        ) {
            console.error(
                `Error - deleteInClodinary: ${deleteInCloudinaryRes.reason}`,
            )
            return {
                ok: false,
                errorType: SERVICE_ERROR_TYPE.API_ERROR,
                reason: deleteInCloudinaryRes.reason,
            }
        } else {
            throw new Error('Unexpected Error in cloudinaryService - delete')
        }
    },
}
