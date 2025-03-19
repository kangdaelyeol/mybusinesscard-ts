export default function LoadingSpinner() {
    return (
        <div className="h-full w-full text-[3%] flex justify-center items-center gap-[5px]">
            <svg
                className="animate-spin shrink-0 h-5 w-5 mr-1 border-color-white border-[3px] border-t-transparent rounded-[50%]"
                viewBox="0 0 24 24"
            ></svg>
            Processing...
        </div>
    )
}
