export type ThemeType = 'dark' | 'light'

export interface ThemeContextType {
    theme: ThemeType
    toggleTheme: () => void
}
