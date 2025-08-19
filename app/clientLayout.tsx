"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Layout from "@/components/Layout"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import AuthWrapper from "@/components/AuthWrapper"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

// <CHANGE> Converting to client component to use usePathname hook
export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // <CHANGE> Check if current page is login page to exclude Layout wrapper
  const isLoginPage = pathname === "/login"

  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthWrapper>
            {/* <CHANGE> Conditionally render Layout only for non-login pages */}
            {isLoginPage ? children : <Layout>{children}</Layout>}
          </AuthWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
