import classNames from 'classnames'
import { CARD_IMAGE_SIZE } from '@/constants'
import useCardDisplay from '@/hooks/useCardDisplay'
import ImageStyling from '@/components/ImageStyling'
import ImgDisplay from '@/components/ImgDisplay'

const CardDisplay = ({ card }) => {
    const { data, saveProfileStyle, editPicture, handlePictureEdit } =
        useCardDisplay(card)

    const descriptionList = data.description.split('\n')

    return (
        <div className="h-[230px] flex flex-1">
            <div
                className={classNames(
                    'w-[440px] m-auto flex gap-[20px] rounded-[20px] border-[3px] border-solid p-[35px] overflow-hidden',
                    {
                        'bg-theme-pink border-pink-300 text-white':
                            data.theme === 'pink',
                        'bg-theme-black border-black text-gray-200':
                            data.theme === 'black',
                    },
                )}
            >
                <div className="relative group">
                    <div
                        onClick={handlePictureEdit}
                        className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 flex justify-center items-center bottom-0 right-0 w-[30px] h-[30px] bg-color-black z-[10] rounded-[50%] cursor-pointer hover:bg-color-black-bright"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            edit
                        </span>
                    </div>
                    <ImgDisplay size={CARD_IMAGE_SIZE} profile={data.profile} />
                </div>
                <div>
                    <div className="text-[25px] select-none object-cover">
                        {data.name || 'Name'}
                    </div>
                    {descriptionList.length === 0 && descriptionList[0] === ''
                        ? 'Description'
                        : descriptionList.map((content, idx) => (
                              <p
                                  key={idx}
                                  className="select-none whitespace-pre-wrap"
                              >
                                  {content}
                              </p>
                          ))}
                </div>
            </div>
            {editPicture && (
                <ImageStyling
                    {...data.profile}
                    saveProfileStyle={saveProfileStyle}
                />
            )}
        </div>
    )
}

export default CardDisplay
