import { makeAutoObservable } from 'mobx'

export const themesStore = {
    theme: localStorage.getItem('theme') || 'dark',

    ChangeTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', this.theme)
    }

}
makeAutoObservable(themesStore)