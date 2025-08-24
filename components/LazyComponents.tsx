"use client"

import type React from "react"

import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const LazyAdminUsers = lazy(() => import("@/app/admin-users/page"))
export const LazyAdminNotices = lazy(() => import("@/app/admin-notices/page"))
export const LazyAdminAndroid = lazy(() => import("@/app/admin-android/page"))
export const LazyAdminInstagram = lazy(() => import("@/app/admin-instagram/page"))
export const LazyDashboard = lazy(() => import("@/app/dashboard/page"))

export const LazyChartComponents = lazy(() => import("@/components/ui/chart"))

export function ComponentSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-3/4" />
    </div>
  )
}

export function LazyWrapper({
  children,
  fallback = <ComponentSkeleton />,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
