import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    const handleGoToMainClick = () => {
        navigate('/')
    }

    return (
        <div className="py-header-height min-h-[100vh] mb-footer-height bg-color-gray flex justify-center items-center">
            <div className="bg-color-white max-w-[364px] p-[24px] rounded-[8px]">
                <h1 className="text-[1.375rem] font-bold">Page not found</h1>
                <p className="mt-[8px] text-color-gray">
                    Looks like you’ve followed a broken link or entered a URL
                    that doesn’t exist on this site.
                </p>
                <hr className="my-[16px] bg-color-gray h-[1px]" />
                <span
                    onClick={handleGoToMainClick}
                    className="mt-[8px] text-color-blue hover:text-color-blue-light cursor-pointer"
                >
                    Go to main
                </span>
            </div>
        </div>
    )
}
