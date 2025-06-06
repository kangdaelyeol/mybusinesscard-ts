export const CardEditorFallback = () => {
    return (
        <div className="flex justify-center items-center w-full h-[196px] my-[17px]">
            <div className="h-full w-[440px] flex justify-center items-center gap-[5px]">
                <svg
                    className="animate-spin shrink-0 h-[50px] w-[50px] mr-1 border-white border-[3px] border-t-transparent rounded-[50%]"
                    viewBox="0 0 24 24"
                ></svg>
            </div>
        </div>
    )
}
