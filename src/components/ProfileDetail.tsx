import { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import { PROFILE_DETAIL_IMG_SIZE } from '@/constants'
import useProfileDetail from '@/hooks/useProfileDetail'
import ImageStyling from '@/components/ImageStyling'
import ImgDisplay from '@/components/ImgDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ProfileDetail() {
    const {
        fileInputRef,
        handlers,
        saveProfileStyle,
        userState,
        imageStyling,
        imageOption,
        fileLoading,
    } = useProfileDetail()

    const { theme } = useContext(ThemeContext)

    return (
        <div
            className={classNames(
                'absolute flex flex-col gap-[10px] items-center top-[var(--header-height)] right-0 rounded-[30px] w-[400px] mr-[10px] mt-[10px] p-[15px]',
                {
                    'bg-color-black-light': theme === 'dark',
                    'bg-color-white shadow-2xl': theme === 'light',
                },
            )}
        >
            <div className="relative">
                <ImgDisplay
                    size={PROFILE_DETAIL_IMG_SIZE}
                    profile={userState.profile}
                />
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
                    <span className="material-symbols-outlined text-[20px]">
                        edit
                    </span>
                </div>
                {imageOption && (
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
            <div className="text-center text-[24px] font-lightbold">
                안녕하세요, {userState.username}님
            </div>

            <div
                onClick={handlers.manageAccountClick}
                className={classNames(
                    'py-[7px] w-[150px] font-bold text-center border-solid border-[1px] rounded-[9999px] cursor-pointer',
                    {
                        'text-color-skyblue hover:bg-color-black-bright border-color-white':
                            theme === 'dark',
                        'text-color-white bg-color-blue hover:bg-color-blue-light border-color-blue-light':
                            theme === 'light',
                    },
                )}
            >
                계정 관리
            </div>

            <div
                onClick={handlers.logoutClick}
                className={classNames(
                    'py-[10px] w-[300px] font-bold text-center cursor-pointer rounded-[8px]',
                    {
                        'bg-color-black hover:bg-color-black-bright':
                            theme === 'dark',
                        'bg-color-gray hover:bg-color-black-bright text-color-white':
                            theme === 'light',
                    },
                )}
            >
                로그아웃
            </div>

            <div className="flex gap-[5px] items-center">
                <div
                    className={classNames(
                        'rounded-[5px] px-[5px] py-[3px] text-[12px] cursor-pointer',
                        {
                            'hover:bg-color-black-bright': theme === 'dark',
                            'hover:bg-color-white-light': theme === 'light',
                        },
                    )}
                >
                    개인정보처리방침
                </div>
                <div className="w-[3px] h-[3px] rounded-[50%] bg-color-gray"></div>
                <div
                    className={classNames(
                        'rounded-[5px] px-[5px] py-[3px] text-[12px] cursor-pointer',
                        {
                            'hover:bg-color-black-bright': theme === 'dark',
                            'hover:bg-color-white-light': theme === 'light',
                        },
                    )}
                >
                    서비스 약관
                </div>
            </div>

            {imageStyling && (
                <ImageStyling
                    {...userState.profile}
                    saveProfileStyle={saveProfileStyle}
                />
            )}
        </div>
    )
}
