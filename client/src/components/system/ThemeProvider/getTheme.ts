import themes from '~/themes.json'
import { ThemeType, Themes } from './ThemeInterface'

const themes_: Themes = themes.themes

export const getTheme = <T extends keyof Themes>(name: T): ThemeType => {
	return themes_[name]
}

export const getThemes = (): string[] => {
	return Object.keys(themes_)
}
