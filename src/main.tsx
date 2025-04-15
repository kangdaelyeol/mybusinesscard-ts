import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app'
import '@/index.css'

createRoot(document.getElementById('root') as HTMLDivElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
