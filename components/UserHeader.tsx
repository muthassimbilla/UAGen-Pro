"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Clock, Shield, BarChart3 } from "lucide-react"
import { AccessKey } from "@/lib/supabase"

export default function UserHeader() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = AccessKey.getCurrentUser()
    setUser(currentUser)
  }, [])

  if (!user) return null

  const remainingDays = AccessKey.getRemainingDays(user)
  const isAdmin = AccessKey.isAdmin(user)
  const remainingGenerations = !isAdmin ? AccessKey.getRemainingGenerations(user) : null

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {isAdmin ? <Shield className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-gray-600" />}
          <span className="font-medium text-gray-900 dark:text-gray-100">{user.user_name}</span>
          <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Admin" : "User"}</Badge>
        </div>

        {!isAdmin && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span>
                বাকি: <span className="text-green-600 font-medium">{remainingGenerations}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>মেয়াদ: {remainingDays}</span>
            </div>
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" onClick={() => AccessKey.logout()} className="flex items-center space-x-2">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  )
}
