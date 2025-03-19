import { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context'
import useHeader from '@/hooks/useHeader'
import ProfileDetail from '@/components/ProfileDetail'
import ImgDisplay from '@/components/ImgDisplay'

export default function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext)

    const {
        profileDetail,
        handleProfileClick,
        userState,
        hideProfileDetail,
        handleTitleClick,
    } = useHeader()

    return (
        <header
            className={classNames('fixed w-[100%] z-10', {
                'bg-white text-black-light': theme === 'light',
                'bg-color-black text-color-white-light': theme === 'dark',
            })}
        >
            <div className="max-w-[1100px] relative mx-auto h-header-height flex">
                <div className="absolute h-full flex items-center left-[30px] text-[20px] font-semibold max-small:text-[18px] max-small:left-[15px]">
                    {userState.nickname}
                </div>

                <span
                    onClick={handleTitleClick}
                    className="inset-0 m-auto font-bold text-[1.8rem] max-small:text-[22px] cursor-pointer"
                >
                    Create Business Card
                </span>

                <div
                    className={classNames(
                        'absolute top-0 bottom-0 my-auto h-[24px] cursor-pointer select-none ',
                        {
                            'right-[110px] max-small:right-[80px]':
                                userState.username,
                            'right-[30px] max-small:right-[15px]':
                                !userState.username,
                        },
                    )}
                    onClick={toggleTheme}
                >
                    <span
                        className={classNames('material-symbols-outlined', {
                            'text-color-white-light': theme === 'dark',
                        })}
                    >
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </div>

                {userState.username && (
                    <div
                        className="absolute inset-y-0 my-auto right-[30px] h-[50px] w-[50px] cursor-pointer max-small:right-[15px]"
                        onClick={handleProfileClick}
                    >
                        <ImgDisplay size={50} profile={userState.profile} />
                    </div>
                )}

                {userState.username && profileDetail && (
                    <ProfileDetail hideProfileDetail={hideProfileDetail} />
                )}
            </div>
        </header>
    )
}
