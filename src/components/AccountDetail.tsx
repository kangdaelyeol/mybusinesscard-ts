import { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import useAccountDetail from '@/hooks/useAccountDetail'
import ImageStyling from '@/components/ImageStyling'
import ImgDisplay from '@/components/ImgDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AccountDetail() {
    const { theme } = useContext(ThemeContext)

    const {
        fileLoading,
        profileOption,
        profileStyling,
        nickname,
        handlers,
        saveProfileStyle,
        fileInputRef,
        userState,
        saveLoading,
        errorMessage,
        deleteAccountModal,
        deleteAccountLoading,
    } = useAccountDetail()

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
            <div className="text-[25px] font-semibold text-center mt-[25px]">
                Account Settings
            </div>

            <div className="relative mt-[20px] mx-auto w-[150px]">
                <ImgDisplay size={150} profile={userState.profile} />

                <div
                    className={classNames(
                        'absolute bottom-[-8px] right-[-8px] flex justify-center items-center w-[30px] h-[30px] rounded-[50%] cursor-pointer',
                        {
                            'bg-color-black hover:bg-color-black-bright':
                                theme === 'dark',
                            'bg-color-blue hover:bg-color-blue-light text-color-white':
                                theme === 'light',
                        },
                    )}
                    onClick={handlers.editProfileClick}
                >
                    <span className="material-symbols-outlined text-[20px] text-color-white">
                        edit
                    </span>
                </div>

                {profileOption && (
                    <div
                        className={classNames(
                            'flex flex-col absolute bottom-[-8px] right-[-110px] w-[100px] rounded-[10px] overflow-hidden font-semibold',
                            {
                                'bg-color-black': theme === 'dark',
                                'bg-color-white-light shadow-2xl':
                                    theme === 'light',
                            },
                        )}
                    >
                        <div
                            onClick={handlers.newFileClick}
                            className={classNames(
                                'text-center py-[5px] cursor-pointer',
                                {
                                    'hover:bg-color-black-bright':
                                        theme === 'dark',
                                    'hover:bg-color-gray-light':
                                        theme === 'light',
                                },
                            )}
                        >
                            {fileLoading ? <LoadingSpinner /> : 'New File'}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onInput={handlers.fileInput}
                        />

                        <div
                            className={classNames(
                                'text-center py-[5px] cursor-pointer',
                                {
                                    'hover:bg-color-black-bright':
                                        theme === 'dark',
                                    'hover:bg-color-gray-light':
                                        theme === 'light',
                                },
                            )}
                            onClick={handlers.editPositionClick}
                        >
                            Position
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <div className="grow-1 p-[10px]">
                    <div className="">
                        <div className="text-[15px] text-color-gray">
                            username
                        </div>

                        <div className="font-semibold text-[20px] pl-[2px]">
                            {userState.username}
                        </div>
                    </div>

                    <label htmlFor="nickname" className="block mt-[10px]">
                        <div className="text-[15px] text-color-gray">
                            nickname
                        </div>

                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={handlers.nicknameChange}
                            className={classNames(
                                'grow rounded-[5px] px-[10px] py-[5px] outline-none border-[1px] w-full',
                                {
                                    'input-dark': theme === 'dark',
                                    'input-light': theme === 'light',
                                },
                            )}
                        />
                    </label>

                    <div
                        className="cursor-pointer mt-[20px] text-color-blue hover:text-color-blue-light"
                        onClick={handlers.changePasswordClick}
                    >
                        Change Password
                    </div>

                    <div
                        className={classNames(
                            'py-[10px] w-[300px] font-bold text-center cursor-pointer rounded-[8px] mt-[20px]',
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
                        onClick={handlers.deleteAccountClick}
                        className="cursor-pointer text-red-600 hover:text-red-500 mt-[20px]"
                    >
                        Delete Account
                    </div>

                    {deleteAccountModal && (
                        <div
                            className={classNames(
                                'fixed top-0 left-0 w-full h-full flex justify-center items-center',
                                {
                                    'bg-color-black/90': theme === 'dark',
                                    'bg-color-white-light/90':
                                        theme === 'light',
                                },
                            )}
                        >
                            <div
                                className={classNames(
                                    'h-[300px] w-[500px] rounded-[20px] flex flex-col justify-center items-center gap-[30px]',
                                    {
                                        'bg-color-black-semilight':
                                            theme === 'dark',
                                        'bg-color-white': theme === 'light',
                                    },
                                )}
                            >
                                <div className="text-[20px] font-bold">
                                    Are you sure to delete Account?
                                </div>
                                <div className="flex justify-center gap-[30px]">
                                    <div
                                        onClick={
                                            handlers.deleteAccountInModalClick
                                        }
                                        className={classNames(
                                            'px-[15px] py-[10px] rounded-[5px]',
                                            {
                                                'btn-dark text-red-500 hover:text-red-400':
                                                    theme === 'dark',
                                                'bg-red-500 hover:bg-red-400 text-white cursor-pointer':
                                                    theme === 'light',
                                            },
                                        )}
                                    >
                                        {deleteAccountLoading ? (
                                            <LoadingSpinner />
                                        ) : (
                                            'Delete'
                                        )}
                                    </div>
                                    <div
                                        onClick={
                                            handlers.deleteAccountCancelClick
                                        }
                                        className={classNames(
                                            ' px-[15px] py-[10px] rounded-[5px]',
                                            {
                                                'btn-dark text-color-white':
                                                    theme === 'dark',
                                                'btn-light': theme === 'light',
                                            },
                                        )}
                                    >
                                        Cancel
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        className={classNames(
                            'w-[300px] text-center mt-[20px] leading-[1.6]',
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

            {profileStyling && (
                <ImageStyling
                    {...userState.profile}
                    saveProfileStyle={saveProfileStyle}
                />
            )}
        </div>
    )
}
