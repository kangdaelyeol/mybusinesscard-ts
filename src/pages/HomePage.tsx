import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ToasterMessageContext } from '@/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ToasterMessage from '@/components/ToasterMessage'

export default function HomePage() {
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
