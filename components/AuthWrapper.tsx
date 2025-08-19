"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AccessKey } from "@/lib/supabase"
import { AdminLoading } from "@/components/AdminLoading"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  const adminRoutes = ["/admin", "/admin-android", "/admin-instagram", "/admin-users"]

  const isLoginPage = pathname === "/login"

  useEffect(() => {
    const checkAuth = () => {
      if (isLoginPage) {
        setLoading(false)
        return
      }

      const currentUser = AccessKey.getCurrentUser()

      if (!currentUser) {
        window.location.href = "/login"
        return
      }

      const requiresAdmin = adminRoutes.some((route) => pathname.startsWith(route))

      if (requiresAdmin) {
        // All admin routes are accessible since all authenticated users are admin
        setUser(currentUser)
        setLoading(false)
        return
      }

      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()
  }, [pathname, isLoginPage])

  if (loading) {
    return <AdminLoading message="Verifying access..." />
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return <>{children}</>
}
