"use client"

import type React from "react"

import { useState } from "react"
import { AccessKey } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, Shield } from "lucide-react"

export default function LoginPage() {
  const [accessKey, setAccessKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessKey.trim()) {
      setError("অ্যাক্সেস কী প্রয়োজন")
      return
    }

    setLoading(true)
    setError("")

    try {
      const user = await AccessKey.authenticate(accessKey.trim())

      AccessKey.setCurrentUser(user)

      if (user.user_role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/generator"
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "লগইন ব্যর্থ হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">UAGen Pro</CardTitle>
            <CardDescription className="text-base mt-2">আপনার অ্যাক্সেস কী দিয়ে লগইন করুন</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessKey" className="text-sm font-medium">
                অ্যাক্সেস কী
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="accessKey"
                  type="password"
                  placeholder="আপনার অ্যাক্সেস কী লিখুন"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !accessKey.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগইন করুন"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>সাহায্যের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
