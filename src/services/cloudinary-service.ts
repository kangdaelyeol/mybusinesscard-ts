import { imageClient } from '@/client'
import { CloudinaryImage } from '@/services/types'

export const cloudinaryService = {
    uploadImage: async (file: File): Promise<CloudinaryImage | null> => {
        const uploadInCloudinaryRes = await imageClient.uploadInCloudinary(file)

        if (
            uploadInCloudinaryRes.status === 200 &&
            'data' in uploadInCloudinaryRes
        ) {
            const { url, asset_id, public_id, width, height } =
                uploadInCloudinaryRes.data

            return { url, asset_id, public_id, width, height }
        } else if (
            uploadInCloudinaryRes.status === 400 &&
            'reason' in uploadInCloudinaryRes
        ) {
            console.error(
                `Error - uploadInClodinary: ${uploadInCloudinaryRes.reason}`,
            )
            return null
        } else {
            console.error('Unexpected Error in cloudinaryService - upload')
            return null
        }
    },

    deleteImage: async (
        assetId: string,
        publicId: string,
    ): Promise<boolean> => {
        const deleteInCloudinaryRes = await imageClient.deleteInCloudinary(
            assetId,
            publicId,
        )

        if (deleteInCloudinaryRes.status === 200) return true
        else if (
            deleteInCloudinaryRes.status === 400 &&
            'reason' in deleteInCloudinaryRes
        ) {
            console.error(
                `Error - deleteInClodinary: ${deleteInCloudinaryRes.reason}`,
            )
            return false
        } else {
            console.error('Unexpected Error in cloudinaryService - delete')
            return false
        }
    },
}
