"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart3,
  Calendar,
  Clock,
  User,
  Zap,
  TrendingUp,
  Activity,
  Bell,
  Download,
  Copy,
  Key,
  Shield,
} from "lucide-react"
import { AccessKey, UserGeneration, AdminNotice } from "@/lib/supabase"

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState(null)
  const [history, setHistory] = useState([])
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGenerated: 0,
    todayGenerated: 0,
    weekGenerated: 0,
    monthGenerated: 0,
  })

  useEffect(() => {
    checkAuthentication()
    loadUserData()
  }, [])

  const checkAuthentication = () => {
    const user = AccessKey.getCurrentUser()
    if (!user) {
      window.location.href = "/login"
      return
    }

    if (user.user_role === "admin") {
      window.location.href = "/admin"
      return
    }

    setCurrentUser(user)
  }

  const loadUserData = async () => {
    const user = AccessKey.getCurrentUser()
    if (!user) return

    setLoading(true)
    try {
      const [userHistory, activeNotices] = await Promise.all([
        UserGeneration.getUserHistory(user.access_key, 10),
        AdminNotice.getActiveNotices(user.user_name),
      ])

      setHistory(userHistory)
      setNotices(activeNotices)

      // Calculate stats
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const totalGenerated = userHistory.reduce((sum, item) => sum + (item.generated_data?.user_agents?.length || 0), 0)
      const todayGenerated = userHistory
        .filter((item) => new Date(item.created_at) >= today)
        .reduce((sum, item) => sum + (item.generated_data?.user_agents?.length || 0), 0)
      const weekGenerated = userHistory
        .filter((item) => new Date(item.created_at) >= weekAgo)
        .reduce((sum, item) => sum + (item.generated_data?.user_agents?.length || 0), 0)
      const monthGenerated = userHistory
        .filter((item) => new Date(item.created_at) >= monthAgo)
        .reduce((sum, item) => sum + (item.generated_data?.user_agents?.length || 0), 0)

      setStats({
        totalGenerated,
        todayGenerated,
        weekGenerated,
        monthGenerated,
      })
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryDownload = async (historyItem) => {
    if (!historyItem.generated_data?.user_agents || historyItem.generated_data.user_agents.length === 0) {
      return
    }

    try {
      const content = historyItem.generated_data.user_agents.join("\n")
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const timestamp = new Date(historyItem.created_at).toISOString().slice(0, 19).replace(/:/g, "-")
      a.download = `${historyItem.platform}_${historyItem.generated_data.app_type}_user_agents_${timestamp}.txt`

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading from history:", error)
    }
  }

  const handleHistoryCopy = async (historyItem) => {
    if (!historyItem.generated_data?.user_agents || historyItem.generated_data.user_agents.length === 0) {
      return
    }

    try {
      const content = historyItem.generated_data.user_agents.join("\n")
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error("Error copying from history:", error)
    }
  }

  const getUsagePercentage = () => {
    if (!currentUser || currentUser.generation_limit === null) return 0
    return Math.round(((currentUser.used_generations || 0) / currentUser.generation_limit) * 100)
  }

  const getRemainingDays = () => {
    if (!currentUser?.expires_at) return "Unlimited"
    const expiryDate = new Date(currentUser.expires_at)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return "Expired"
    return `${diffDays} days`
  }

  const getStatusColor = () => {
    if (!currentUser?.expires_at) return "default"
    const remainingDays = getRemainingDays()
    if (remainingDays === "Expired") return "destructive"
    if (remainingDays.includes("days") && Number.parseInt(remainingDays) <= 7) return "warning"
    return "default"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">ইউজার ড্যাশবোর্ড</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Dashboard</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          আপনার ব্যবহার, লিমিট এবং অ্যাকাউন্ট তথ্য দেখুন
        </p>
      </div>

      {/* User Status Card */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  স্বাগতম, {currentUser.user_name}
                </h2>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">ইউজার অ্যাকাউন্ট</Badge>
                  <Badge variant={getStatusColor()}>
                    {getRemainingDays() === "Expired" ? "মেয়াদ শেষ" : `মেয়াদ: ${getRemainingDays()}`}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {AccessKey.getRemainingGenerations(currentUser)}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">বাকি জেনারেশন</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentUser.used_generations || 0}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">ব্যবহৃত</div>
              </div>
            </div>
          </div>

          {/* Usage Progress Bar */}
          {currentUser.generation_limit && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ব্যবহারের অগ্রগতি</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {currentUser.used_generations || 0} / {currentUser.generation_limit}
                </span>
              </div>
              <Progress value={getUsagePercentage()} className="h-3" />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>0%</span>
                <span>{getUsagePercentage()}% ব্যবহৃত</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notices */}
      {notices.length > 0 && (
        <div className="mb-8 space-y-3">
          {notices.map((notice) => (
            <Alert key={notice.id} className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
              <Bell className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{notice.title}:</strong> {notice.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">মোট জেনারেট</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalGenerated}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">আজকে</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.todayGenerated}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">এই সপ্তাহে</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.weekGenerated}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">এই মাসে</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.monthGenerated}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            অ্যাকাউন্ট তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Key className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">অ্যাক্সেস কী</p>
                  <code className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                    {currentUser.access_key}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">ইউজার নাম</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{currentUser.user_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">জেনারেশন লিমিট</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {currentUser.generation_limit || "Unlimited"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">শেষ লগইন</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {currentUser.last_login ? new Date(currentUser.last_login).toLocaleDateString("bn-BD") : "কখনো নয়"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            সাম্প্রতিক জেনারেশন হিস্ট্রি
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">এখনো কোন জেনারেশন হিস্ট্রি নেই।</p>
              <Button className="mt-4" onClick={() => (window.location.href = "/generator")}>
                <Zap className="w-4 h-4 mr-2" />
                জেনারেট করুন
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {item.platform}
                      </Badge>
                      <Badge variant="secondary">{item.generated_data?.app_type || "Unknown"}</Badge>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.generated_data?.user_agents?.length || 0} ইউজার এজেন্ট
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(item.created_at).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleHistoryCopy(item)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      কপি
                    </Button>
                    <Button
                      onClick={() => handleHistoryDownload(item)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      ডাউনলোড
                    </Button>
                  </div>
                </div>
              ))}

              {history.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => (window.location.href = "/generator")}>
                    সব হিস্ট্রি দেখুন
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
