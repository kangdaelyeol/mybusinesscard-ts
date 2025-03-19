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
                'absolute flex flex-col gap-[10px] items-center top-header-height right-0 rounded-[30px] w-[400px] mr-[10px] mt-[10px] p-[15px]',
                {
                    'bg-black-light': theme === 'dark',
                    'bg-white shadow-2xl': theme === 'light',
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
                            'bg-black hover:bg-black-bright': theme === 'dark',
                            'bg-blue hover:bg-blue-light text-white':
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
                                'bg-black': theme === 'dark',
                                'bg-white-light shadow-2xl': theme === 'light',
                            },
                        )}
                    >
                        <div
                            onClick={handlers.newFileClick}
                            className={classNames(
                                'text-center py-[5px] cursor-pointer',
                                {
                                    'hover:bg-black-bright': theme === 'dark',
                                    'hover:bg-gray-light': theme === 'light',
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
                                    'hover:bg-black-bright': theme === 'dark',
                                    'hover:bg-gray-light': theme === 'light',
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
                        'text-skyblue hover:bg-black-bright border-white':
                            theme === 'dark',
                        'text-white bg-blue hover:bg-blue-light border-blue-light':
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
                        'bg-black hover:bg-black-bright': theme === 'dark',
                        'bg-gray hover:bg-black-bright text-white':
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
                            'hover:bg-black-bright': theme === 'dark',
                            'hover:bg-white-light': theme === 'light',
                        },
                    )}
                >
                    개인정보처리방침
                </div>
                <div className="w-[3px] h-[3px] rounded-[50%] bg-gray"></div>
                <div
                    className={classNames(
                        'rounded-[5px] px-[5px] py-[3px] text-[12px] cursor-pointer',
                        {
                            'hover:bg-black-bright': theme === 'dark',
                            'hover:bg-white-light': theme === 'light',
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
