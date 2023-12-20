import React from 'react'
import { ThemeType } from './ThemeInterface'
import { getTheme, getThemes } from './getTheme'

interface ThemeContextProps {
	children: React.ReactNode
}

interface ThemeContextValue {
	theme: ThemeType
	toggleTheme: (name: string) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
	undefined,
)

export const ThemeProvider: React.FC<ThemeContextProps> = ({ children }) => {
	// get theme list
	const themes: string[] = getThemes()

	const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
		.matches
		? 'dark'
		: 'light'

	// theme name: get from local storage
	const [themeType, setThemeType] = React.useState<string>(
		localStorage.getItem('theme') ?? preferredTheme,
	)
	const [theme, setTheme] = React.useState<ThemeType>(
		getTheme(`${themeType}Theme`),
	)

	React.useEffect(() => {
		setTheme(getTheme(`${themeType}Theme`))
	}, [themeType])

	const toggleTheme = (name: string) => {
		if (themes.includes(`${themeType}Theme`)) {
			setThemeType(name)
			localStorage.setItem('theme', name)
		} else if (name === 'default') {
			setThemeType(preferredTheme)
			localStorage.removeItem('theme')
		}
	}

	const value: ThemeContextValue = { theme, toggleTheme }

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = React.useContext(ThemeContext)

	if (!context)
		throw new Error('`useTheme` must be used within a ThemeProvider')

	return context
}
