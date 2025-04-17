export const CreateCardFallback = () => {
    return (
        <div className="fixed top-0 left-0 flex flex-col justify-center items-center w-full h-full z-10 bg-black/90">
            <div className="h-full w-full flex justify-center items-center gap-[5px]">
                <svg
                    className="animate-spin shrink-0 h-[100px] w-[100px] mr-1 border-white border-[10px] border-t-transparent rounded-[50%]"
                    viewBox="0 0 24 24"
                ></svg>
            </div>
        </div>
    )
}
