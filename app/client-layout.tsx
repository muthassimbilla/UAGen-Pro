"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Layout from "@/components/Layout"
import AuthWrapper from "@/components/AuthWrapper"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"

  return <AuthWrapper>{isLoginPage ? children : <Layout>{children}</Layout>}</AuthWrapper>
}
