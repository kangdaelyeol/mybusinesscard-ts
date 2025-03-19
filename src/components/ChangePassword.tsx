import classNames from 'classnames'
import { useContext } from 'react'
import { ThemeContext } from '@/context'
import LoadingSpinner from '@/components/LoadingSpinner'
import useChangePassword from '@/hooks/useChangePassword'

export default function ChangePassword() {
    const { theme } = useContext(ThemeContext)
    const { handlers, saveLoading, errorMessage, passwordState } =
        useChangePassword()

    return (
        <div
            className={classNames(
                'py-header-height mb-footer-height min-h-[100vh] mx-auto',
                {
                    'bg-color-white': theme === 'light',
                    'bg-color-black-semilight text-color-white':
                        theme === 'dark',
                },
            )}
        >
            <div className="w-full text-center mt-[25px] text-[25px] font-semibold">
                Change Password
            </div>

            <div className="w-full max-w-[400px] mx-auto mt-[40px]">
                <label className="block mt-[15px]" htmlFor="password-current">
                    <div
                        className={classNames({
                            'text-color-black-bright': theme === 'light',
                        })}
                    >
                        Current Password
                    </div>

                    <input
                        className={classNames(
                            'grow mt-[6px] rounded-[5px] px-[10px] py-[5px] outline-none border-[1px] w-full',
                            {
                                'input-dark': theme === 'dark',
                                'input-light': theme === 'light',
                            },
                        )}
                        id="password-current"
                        type="password"
                        value={passwordState.current}
                        onChange={handlers.currentPasswordChange}
                    />
                </label>

                <label className="block mt-[15px]" htmlFor="password-new">
                    <div
                        className={classNames({
                            'text-color-black-bright': theme === 'light',
                        })}
                    >
                        New Password
                    </div>

                    <input
                        className={classNames(
                            'grow mt-[6px] rounded-[5px] px-[10px] py-[5px] outline-none border-[1px] w-full',
                            {
                                'input-dark': theme === 'dark',
                                'input-light': theme === 'light',
                            },
                        )}
                        value={passwordState.new}
                        id="password-new"
                        type="password"
                        onChange={handlers.newPasswordChange}
                    />
                </label>

                <label className="block mt-[15px]" htmlFor="password-confirm">
                    <div
                        className={classNames({
                            'text-color-black-bright': theme === 'light',
                        })}
                    >
                        Confirm Password
                    </div>

                    <input
                        className={classNames(
                            'grow rounded-[5px] mt-[6px] px-[10px] py-[5px] outline-none border-[1px] w-full',
                            {
                                'input-dark': theme === 'dark',
                                'input-light': theme === 'light',
                            },
                        )}
                        value={passwordState.confirm}
                        id="password-confirm"
                        type="password"
                        onChange={handlers.confirmPasswordChange}
                    />
                </label>

                <div
                    className="cursor-pointer mt-[15px] text-color-blue hover:text-color-blue-light"
                    onClick={handlers.accountSettingsClick}
                >
                    Account Settings
                </div>

                <div
                    className={classNames(
                        'py-[10px] w-[300px] mx-auto mt-[25px] font-bold text-center cursor-pointer rounded-[8px] mt-[10px]',
                        {
                            'bg-color-black hover:bg-color-black-bright':
                                theme === 'dark',
                            'bg-color-gray hover:bg-color-black-bright text-color-white':
                                theme === 'light',
                        },
                    )}
                    onClick={handlers.saveButtonClick}
                >
                    {saveLoading ? <LoadingSpinner /> : 'Save'}
                </div>

                <div
                    className={classNames(
                        'w-[300px] mx-auto text-center mt-[20px] leading-[1.6]',
                        {
                            'text-color-blue-light': theme === 'dark',
                            'text-red-400': theme === 'light',
                        },
                    )}
                >
                    {errorMessage}
                </div>
            </div>
        </div>
    )
}
