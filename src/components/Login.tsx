import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import useLogin from '@/hooks/useLogin'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Login() {
    const { theme } = useContext(ThemeContext)
    const { loading, handlers, loginInput, errorMessage } = useLogin()

    return (
        <form
            onSubmit={handlers.userLogin}
            className={classNames(
                'min-h-[100vh] pt-[var(--header-height)] pb-[80px] mb-[var(--footer-height-margin)]',
                {
                    'bg-black-semilight': theme === 'dark',
                    'bg-white-light': theme === 'light',
                },
            )}
        >
            <div className="flex flex-col px-[30px] py-[20px] bg-white w-[400px] m-auto mt-[80px]">
                <div className="text-[30px] font-bold text-center text-black-light">
                    LOG IN
                </div>

                <input
                    className="bg-transparent border-b-[1px] border-solid border-gray-light p-[5px] mt-[30px] text-[18px]"
                    type="text"
                    placeholder="Username"
                    value={loginInput.username}
                    onChange={handlers.usernameInput}
                />

                <input
                    className="bg-transparent border-b-[1px] border-solid border-gray-light p-[5px] mt-[20px] text-[18px]"
                    type="password"
                    placeholder="Password"
                    value={loginInput.password}
                    onChange={handlers.passwordInput}
                />

                {errorMessage && (
                    <div className="mt-[10px] text-red-500 whitespace-pre-wrap text-center">
                        {errorMessage}
                    </div>
                )}

                <button
                    className={classNames(
                        'text-white py-[7px] mt-[15px] cursor-pointer',
                        {
                            'bg-gray-light hover:bg-black-light':
                                theme === 'dark',
                            'bg-blue hover:bg-blue-light': theme === 'light',
                        },
                    )}
                >
                    {loading ? <LoadingSpinner /> : 'Log in'}
                </button>

                <label className="mt-[20px]" htmlFor="remember">
                    <input
                        id="remember"
                        type="checkbox"
                        className="mr-[5px] border-solid border-gray-300"
                        onChange={handlers.rememberMeChange}
                        checked={loginInput.remember}
                    />

                    <span className="cursor-pointer select-none text-gray">
                        Remember me
                    </span>
                </label>
            </div>

            <Link
                className={classNames(
                    'block mx-auto w-[400px] text-center mt-[15px] hover:underline',
                    {
                        'text-gray': theme === 'dark',
                        'text-blue-light': theme === 'light',
                    },
                )}
                to="/signup"
            >
                Don't have an account?
            </Link>
        </form>
    )
}
