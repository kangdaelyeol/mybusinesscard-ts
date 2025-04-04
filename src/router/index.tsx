import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/base-page'
import LoggedInOnly from '@/router/guard/logged-in-only'
import GuestOnly from '@/router/guard/guest-only'
import {
    SignUp,
    Main,
    Login,
    AccountDetail,
    ChangePassword,
    NotFound,
} from '@/components'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        children: [
            {
                index: true,
                element: (
                    <LoggedInOnly>
                        <Main />
                    </LoggedInOnly>
                ),
            },
            {
                path: 'login',
                element: (
                    <GuestOnly>
                        <Login />
                    </GuestOnly>
                ),
            },
            {
                path: 'signup',
                element: (
                    <GuestOnly>
                        <SignUp />
                    </GuestOnly>
                ),
            },
            {
                path: 'account',
                element: (
                    <LoggedInOnly>
                        <AccountDetail />
                    </LoggedInOnly>
                ),
            },
            {
                path: 'change-password',
                element: (
                    <LoggedInOnly>
                        <ChangePassword />
                    </LoggedInOnly>
                ),
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
])
