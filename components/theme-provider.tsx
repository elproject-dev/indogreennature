"use client"

import * as React from "react"

export interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  forcedTheme?: string
  enableColorScheme?: boolean
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
  themes?: string[]
}

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
  resolvedTheme: string
  themes: string[]
  systemTheme?: string
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
  themes: ["light"],
})

export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = React.useMemo(
    () => ({
      theme: "light",
      setTheme: () => {},
      resolvedTheme: "light",
      themes: ["light"],
    }),
    []
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
