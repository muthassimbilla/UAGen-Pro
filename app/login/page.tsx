"use client"

import type React from "react"

import { useState } from "react"
import { AccessKey } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, Shield, Lock } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-muted/40 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center ring-1 ring-primary/20 shadow-lg">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">UAGen Pro</h1>
            <p className="text-muted-foreground text-lg">নিরাপদ অ্যাক্সেস সিস্টেম</p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="text-center space-y-2">
              <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                অ্যাক্সেস কী দিয়ে প্রবেশ
              </CardTitle>
              <CardDescription className="text-base">আপনার অনুমোদিত অ্যাক্সেস কী ব্যবহার করুন</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="accessKey" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  অ্যাক্সেস কী
                </Label>
                <div className="relative group">
                  <Input
                    id="accessKey"
                    type="password"
                    placeholder="আপনার গোপনীয় অ্যাক্সেস কী লিখুন"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="h-12 pl-4 pr-4 text-base border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 group-hover:border-border"
                    disabled={loading}
                    autoComplete="off"
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
                  <AlertDescription id="error-message" className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                disabled={loading || !accessKey.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    প্রবেশ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    নিরাপদ প্রবেশ
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-border/50">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">সাহায্যের প্রয়োজন?</p>
                <p className="text-xs text-muted-foreground/80">অ্যাডমিনের সাথে যোগাযোগ করুন</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            আপনার তথ্য সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড
          </p>
        </div>
      </div>
    </div>
  )
}
