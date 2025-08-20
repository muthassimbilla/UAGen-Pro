"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, Shield, Lock, AlertTriangle, X, CheckCircle } from "lucide-react"

// Mock authentication function for demo
const AccessKey = {
  authenticate: async (key: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (key === "admin123") {
      return { user_role: "admin", name: "Admin User" }
    } else if (key === "user123") {
      return { user_role: "user", name: "Regular User" }
    } else {
      throw new Error("অ্যাকসেস কী সঠিক নয়। দয়া করে পুনরায় চেষ্টা করুন।")
    }
  },
  setCurrentUser: (user: any) => {
    console.log("User set:", user)
  }
}

export default function LoginPage() {
  const [accessKey, setAccessKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessKey.trim()) {
      setError("অ্যাকসেস কী প্রয়োজন")
      setShowError(true)
      return
    }

    setLoading(true)
    setError("")
    setShowError(false)

    try {
      const user = await AccessKey.authenticate(accessKey.trim())
      AccessKey.setCurrentUser(user)
      
      // Simulate redirect
      alert(`সফলভাবে লগইন হয়েছে! Redirecting to ${user.user_role === "admin" ? "/admin" : "/generator"}`)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "লগইন ব্যর্থ হয়েছে")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  const dismissError = () => {
    setShowError(false)
    setTimeout(() => setError(""), 300)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes liquidFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(20px, -15px) rotate(1deg) scale(1.02); }
          50% { transform: translate(-15px, 10px) rotate(-0.5deg) scale(0.98); }
          75% { transform: translate(10px, 5px) rotate(0.8deg) scale(1.01); }
        }

        @keyframes liquidPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes errorSlideIn {
          0% { 
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          100% { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes errorSlideOut {
          0% { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        @keyframes loadingDots {
          0%, 20% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
          80%, 100% { opacity: 0; transform: scale(0.8); }
        }

        @keyframes loadingPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
            transform: scale(1.02);
          }
        }

        @keyframes spinnerRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes progressBar {
          0% { width: 0%; }
          25% { width: 30%; }
          50% { width: 60%; }
          75% { width: 85%; }
          100% { width: 100%; }
        }

        .liquid-glass {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          overflow: hidden;
        }

        .liquid-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 200%;
          animation: shimmer 3s infinite;
          pointer-events: none;
        }

        .liquid-glass::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 50%
          );
          animation: liquidFloat 8s infinite ease-in-out;
          pointer-events: none;
        }

        .glass-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.3),
            rgba(59, 130, 246, 0.1),
            transparent
          );
          filter: blur(1px);
          animation: liquidFloat 6s infinite ease-in-out;
        }

        .glass-orb:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: -1s;
        }

        .glass-orb:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 20%;
          animation-delay: -3s;
        }

        .glass-orb:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 60%;
          animation-delay: -5s;
        }

        .input-glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .input-glass:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .input-error {
          border-color: rgba(239, 68, 68, 0.5) !important;
          animation: errorShake 0.5s ease-in-out;
        }

        .button-glass {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.8),
            rgba(59, 130, 246, 0.6)
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .button-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .button-glass:hover::before {
          left: 100%;
        }

        .button-loading {
          animation: loadingPulse 2s infinite;
          cursor: not-allowed;
        }

        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .floating-bubble {
          position: absolute;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.2),
            rgba(59, 130, 246, 0.05),
            transparent
          );
          border-radius: 50%;
          animation: liquidPulse 4s infinite ease-in-out;
        }

        .floating-bubble:nth-child(1) {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .floating-bubble:nth-child(2) {
          width: 40px;
          height: 40px;
          top: 70%;
          right: 25%;
          animation-delay: -2s;
        }

        .floating-bubble:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 70%;
          animation-delay: -4s;
        }

        .main-content {
          position: relative;
          z-index: 10;
        }

        .error-alert {
          animation: ${showError ? 'errorSlideIn' : 'errorSlideOut'} 0.3s ease-in-out;
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.1),
            rgba(239, 68, 68, 0.05)
          );
          border: 1px solid rgba(239, 68, 68, 0.3);
          backdrop-filter: blur(10px);
        }

        .loading-dots {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }

        .loading-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: loadingDots 1.5s infinite;
        }

        .loading-dot:nth-child(1) { animation-delay: 0s; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.8),
            rgba(99, 102, 241, 0.8)
          );
          border-radius: 1px;
          animation: progressBar 2s ease-in-out;
        }

        .custom-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spinnerRotate 1s linear infinite;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="glass-orb"></div>
          <div className="glass-orb"></div>
          <div className="glass-orb"></div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-bubble"></div>
          <div className="floating-bubble"></div>
          <div className="floating-bubble"></div>
        </div>

        <div className="main-content w-full max-w-md space-y-8 p-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 liquid-glass flex items-center justify-center shadow-2xl">
              <Shield className="w-8 h-8 text-blue-300" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">UAGen Pro</h1>
              <p className="text-blue-200 text-lg">নিরাপদ অ্যাকসেস সিস্টেম</p>
            </div>
          </div>

          <div className="liquid-glass shadow-2xl p-8 relative">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5 text-blue-300" />
                  <h2 className="text-xl font-semibold text-white">অ্যাকসেস কী দিয়ে প্রবেশ</h2>
                </div>
                <p className="text-blue-200 text-base">আপনার অনুমোদিত অ্যাকসেস কী ব্যবহার করুন</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="accessKey" className="text-sm font-medium text-blue-100 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    অ্যাকসেস কী
                  </Label>
                  <div className="relative group">
                    <Input
                      id="accessKey"
                      type="password"
                      placeholder="আপনার গোপনীয় অ্যাকসেস কী লিখুন"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className={`h-12 pl-4 pr-4 text-base input-glass text-white placeholder:text-blue-300/70 transition-all duration-300 ${error && showError ? 'input-error' : ''}`}
                      disabled={loading}
                      autoComplete="off"
                      aria-describedby={error ? "error-message" : undefined}
                    />
                  </div>
                </div>

                {error && showError && (
                  <Alert className="error-alert">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <AlertDescription id="error-message" className="text-sm text-red-200 font-medium">
                          {error}
                        </AlertDescription>
                        <p className="text-xs text-red-300 mt-1">
                          দয়া করে সঠিক অ্যাকসেস কী দিন এবং পুনরায় চেষ্টা করুন
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={dismissError}
                        className="text-red-300 hover:text-red-200 transition-colors p-1 rounded-full hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className={`w-full h-12 text-base font-medium button-glass text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 relative overflow-hidden ${loading ? 'button-loading' : ''}`}
                  disabled={loading || !accessKey.trim()}
                >
                  {loading && <div className="progress-bar"></div>}
                  
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="custom-spinner"></div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">প্রবেশ করা হচ্ছে</span>
                        <div className="loading-dots">
                          <div className="loading-dot"></div>
                          <div className="loading-dot"></div>
                          <div className="loading-dot"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      নিরাপদ প্রবেশ
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="text-center space-y-2">
                  <p className="text-sm text-blue-200">সাহায্যের প্রয়োজন?</p>
                  <p className="text-xs text-blue-300/80">অ্যাডমিনের সাথে যোগাযোগ করুন</p>
                </div>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-xs text-blue-300/60 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              আপনার তথ্য সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
