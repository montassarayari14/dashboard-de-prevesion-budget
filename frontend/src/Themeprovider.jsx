/**
 * ThemeProvider
 * -------------
 * Gère le thème global (clair / sombre).
 * - Lit localStorage("theme") au démarrage
 * - Pose data-theme="light" | "dark" sur <html>
 * - Expose toggleTheme() via window pour que n'importe quel composant le déclenche
 *
 * Usage : entourer <App /> dans main.jsx
 *   <ThemeProvider><App /></ThemeProvider>
 */

import { useEffect } from "react"

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // Appliquer le thème sauvegardé au montage
    const saved = localStorage.getItem("theme") || "dark"
    applyTheme(saved)

    // Exposer toggleTheme globalement
    window.toggleTheme = () => {
      const current = localStorage.getItem("theme") || "dark"
      applyTheme(current === "dark" ? "light" : "dark")
    }
  }, [])

  return children
}

function applyTheme(theme) {
  localStorage.setItem("theme", theme)
  document.documentElement.setAttribute("data-theme", theme)
}