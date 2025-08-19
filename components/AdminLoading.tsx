"use client"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLoadingProps {
  message?: string
  className?: string
}

export default function AdminLoading({ message = "ডেটা লোড হচ্ছে...", className }: AdminLoadingProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center",
        className,
      )}
    >
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
        <p className="text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </div>
  )
}

export { AdminLoading }
