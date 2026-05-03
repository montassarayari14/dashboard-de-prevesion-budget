import { createContext, useContext, useEffect, useMemo, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light") // Default LIGHT

  useEffect(() => {
    // Load from localStorage on mount, default light
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      setTheme("dark")
    } else {
      setTheme("light")
      localStorage.setItem("theme", "light")
    }
  }, [])

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "light") {
        document.documentElement.classList.remove("dark")
      } else {
        document.documentElement.classList.add("dark")
      }
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

