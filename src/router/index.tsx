import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoggedInOnly from '@/router/guard/LoggedInOnly'
import GuestOnly from '@/router/guard/GuestOnly'
import Signup from '@/components/Signup'
import Main from '@/components/Main'
import Login from '@/components/Login'
import AccountDetail from '@/components/AccountDetail'
import ChangePassword from '@/components/ChangePassword'
import NotFound from '@/components/NotFound'

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
                        <Signup />
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
