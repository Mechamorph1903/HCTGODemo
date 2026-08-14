import { useState, useEffect } from 'react'

export const useDarkMode = () => {
    // 'system' | 'light' | 'dark' — the person's explicit choice, defaults to following the OS
    const [preference, setPreference] = useState(() => localStorage.getItem('hctgoTheme') || 'system')
    const [systemPrefersDark, setSystemPrefersDark] = useState(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e) => setSystemPrefersDark(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    const isDark = preference === 'system' ? systemPrefersDark : preference === 'dark'

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    const setTheme = (value) => {
        setPreference(value)
        localStorage.setItem('hctgoTheme', value)
    }

    return { preference, isDark, setTheme }
}