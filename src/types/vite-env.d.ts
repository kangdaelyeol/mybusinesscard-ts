/// <reference types="vite/client">

interface ImportMetaEnv {
    readonly VITE_API_KEY: string
    readonly VITE_CLOUDINARY_API_SECRET: string
    readonly VITE_UPLOAD_PRESET: string
    readonly VITE_DATABASE_API_KEY: string
    readonly VITE_AUTH_DOMAIN: string
    readonly VITE_DATABASE_URL: string
    readonly VITE_PROJECT_ID: string
    readonly VITE_STORAGE_BUCKET: string
    readonly VITE_MESSAGEING_SENDER_ID: string
    readonly VITE_APP_ID: string
    readonly VITE_MEASUREMENT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
