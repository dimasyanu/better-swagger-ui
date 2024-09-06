import { isNullOrEmpty } from "@/helpers/helper";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        isDarkMode: false
    }),
    getters: {

    },
    actions: {
        toggleThemeMode() {
            this.changeThemeMode(!this.isDarkMode)
        },        
        changeThemeMode(state: boolean = false) {
            localStorage.setItem('is_dark_mode', state.toString())
            this.isDarkMode = state
        },
        initializeThemeMode() {
            let isDarkMode = localStorage.getItem('is_dark_mode')
            if (isNullOrEmpty(isDarkMode)) {
                this.changeThemeMode(false)
                return
            }

            this.changeThemeMode(isDarkMode!.toLowerCase() === 'true')
        }
    },
})