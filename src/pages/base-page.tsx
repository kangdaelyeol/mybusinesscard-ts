import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ToasterMessageContext } from '@/context'
import { Header, Footer, ToasterMessage } from '@/components'

export default function BasePage() {
    const { toasterMessage } = useContext(ToasterMessageContext)
    return (
        <div>
            <Header />
            <Outlet />
            {toasterMessage && <ToasterMessage message={toasterMessage} />}
            <Footer />
        </div>
    )
}
