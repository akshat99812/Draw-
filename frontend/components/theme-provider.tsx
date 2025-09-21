"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// This is the corrected, type-safe way to get the props
// It infers the props directly from the component, so it won't break on updates.
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}