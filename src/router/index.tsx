import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/base-page'
import LoggedInOnly from '@/router/guard/logged-in-only'
import GuestOnly from '@/router/guard/guest-only'
import { NotFound } from '@/components'
import { PageFallback } from '@/components/fallback'

const Main = lazy(() =>
    import('@/components/main').then((module) => ({ default: module.Main })),
)

const Login = lazy(() =>
    import('@/components/login').then((module) => ({ default: module.Login })),
)

const SignUp = lazy(() =>
    import('@/components/sign-up').then((module) => ({
        default: module.SignUp,
    })),
)

const AccountDetail = lazy(() =>
    import('@/components/account-detail').then((module) => ({
        default: module.AccountDetail,
    })),
)

const ChangePassword = lazy(() =>
    import('@/components/change-password').then((module) => ({
        default: module.ChangePassword,
    })),
)

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        children: [
            {
                index: true,
                element: (
                    <LoggedInOnly>
                        <Suspense fallback={<PageFallback />}>
                            <Main />
                        </Suspense>
                    </LoggedInOnly>
                ),
            },
            {
                path: 'login',
                element: (
                    <GuestOnly>
                        <Suspense fallback={<PageFallback />}>
                            <Login />
                        </Suspense>
                    </GuestOnly>
                ),
            },
            {
                path: 'signup',
                element: (
                    <GuestOnly>
                        <Suspense fallback={<PageFallback />}>
                            <SignUp />
                        </Suspense>
                    </GuestOnly>
                ),
            },
            {
                path: 'account',
                element: (
                    <LoggedInOnly>
                        <Suspense fallback={<PageFallback />}>
                            <AccountDetail />
                        </Suspense>
                    </LoggedInOnly>
                ),
            },
            {
                path: 'change-password',
                element: (
                    <LoggedInOnly>
                        <Suspense fallback={<PageFallback />}>
                            <ChangePassword />
                        </Suspense>
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
