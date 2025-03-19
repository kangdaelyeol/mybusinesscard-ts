import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { router } from '@/router'
import {
    ToasterMessageProvider,
    ResponsiveProvider,
    PubSubProvider,
    ThemeProvider,
} from '@/context'

function App() {
    return (
        <ThemeProvider>
            <PubSubProvider>
                <ResponsiveProvider>
                    <ToasterMessageProvider>
                        <Provider store={store}>
                            <RouterProvider router={router} />
                        </Provider>
                    </ToasterMessageProvider>
                </ResponsiveProvider>
            </PubSubProvider>
        </ThemeProvider>
    )
}

export default App
