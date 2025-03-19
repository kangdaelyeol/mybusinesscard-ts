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
                'min-h-[100vh] pt-header-height pb-[80px] mb-footer-height',
                {
                    'bg-color-black-semilight': theme === 'dark',
                    'bg-color-white-light': theme === 'light',
                },
            )}
        >
            <div className="flex flex-col px-[30px] py-[20px] bg-color-white w-[400px] m-auto mt-[80px]">
                <div className="text-[30px] font-bold text-center text-color-black-light">
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
                        'text-color-white py-[7px] mt-[15px]',
                        {
                            'bg-color-gray-light hover:bg-color-black-light':
                                theme === 'dark',
                            'bg-color-blue hover:bg-color-blue-light':
                                theme === 'light',
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

                    <span className="cursor-pointer select-none text-color-gray">
                        Remember me
                    </span>
                </label>
            </div>

            <Link
                className={classNames(
                    'block mx-auto w-[400px] text-center mt-[15px] hover:underline',
                    {
                        'text-color-gray': theme === 'dark',
                        'text-color-blue-light': theme === 'light',
                    },
                )}
                to="/signup"
            >
                Don't have an account?
            </Link>
        </form>
    )
}
