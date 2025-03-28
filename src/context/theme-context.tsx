import { createContext, useState } from 'react'
import { ContextProps, ThemeContextType, ThemeType } from '@/context/types'

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: ContextProps) => {
    const [theme, setTheme] = useState<ThemeType>('dark')
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
