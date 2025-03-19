import { useContext } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import useSignup from '@/hooks/useSignup'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Signup() {
    const { theme } = useContext(ThemeContext)
    const { handlers, loading, signupInput, errorMessage } = useSignup()

    return (
        <form
            onSubmit={handlers.signupSubmit}
            className={classNames(
                'min-h-[100vh] pt-header-height pb-[80px] mb-footer-height-margin',
                {
                    'bg-black-semilight': theme === 'dark',
                    'bg-white-light': theme === 'light',
                },
            )}
        >
            <div className="flex flex-col px-[30px] py-[20px] bg-white w-[400px] m-auto mt-[50px]">
                <div className="text-[30px] font-bold text-center text-black-light">
                    SIGN UP
                </div>
                <input
                    className="bg-transparent border-b-[1px] border-solid border-gray-light p-[5px] mt-[30px] text-[18px]"
                    type="text"
                    placeholder="Username"
                    value={signupInput.username}
                    onChange={handlers.usernameChange}
                />

                <input
                    className="bg-transparent border-b-[1px] border-solid border-gray-light p-[5px] mt-[20px] text-[18px]"
                    type="text"
                    placeholder="Nickname"
                    value={signupInput.nickname}
                    onChange={handlers.nicknameChange}
                />

                <input
                    className="bg-transparent border-b-[1px] border-solid border-gray-light p-[5px] mt-[20px] text-[18px]"
                    type="password"
                    placeholder="Password"
                    value={signupInput.password}
                    onChange={handlers.passwordChange}
                />

                <input
                    className="bg-transparent border-b-[1px] border-solid border-gray-light p-[5px] mt-[20px] text-[18px]"
                    type="password"
                    placeholder="Confirm Password"
                    value={signupInput.confirmPassword}
                    onChange={handlers.confirmPasswordChange}
                />

                {errorMessage && (
                    <div className="text-center whitespace-pre-wrap text-red-600 mt-[10px]">
                        {errorMessage}
                    </div>
                )}

                <button
                    className={classNames(
                        'text-white py-[7px] mt-[30px] cursor-pointer',
                        {
                            'bg-gray-light hover:bg-black-light':
                                theme === 'dark',
                            'bg-blue hover:bg-blue-light': theme === 'light',
                        },
                    )}
                >
                    {loading ? <LoadingSpinner /> : 'Sign up'}
                </button>
            </div>
            <Link
                className={classNames(
                    'block mx-auto w-[400px] text-center mt-[15px] hover:underline',
                    {
                        'text-gray': theme === 'dark',
                        'text-blue-light': theme === 'light',
                    },
                )}
                to="/login"
            >
                have an account?
            </Link>
        </form>
    )
}
