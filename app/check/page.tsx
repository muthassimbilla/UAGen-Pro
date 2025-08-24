"use client"

import type React from "react"
import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Check,
  X,
  Copy,
  RefreshCw,
  History,
  Castle as Paste,
  Shield,
  AlertTriangle,
  Info,
  Zap,
} from "lucide-react"
import { GenerationHistory } from "@/lib/supabase"
import { toast } from "sonner"

interface SecurityAnalysis {
  riskLevel: "low" | "medium" | "high" | "critical"
  threats: string[]
  isBot: boolean
  isSuspicious: boolean
  fingerprinting: {
    resistance: "low" | "medium" | "high"
    uniqueness: number
    trackingRisk: "low" | "medium" | "high"
  }
}

interface CompatibilityAnalysis {
  browserSupport: {
    modern: boolean
    legacy: boolean
    outdated: boolean
  }
  securityStatus: {
    hasKnownVulnerabilities: boolean
    supportStatus: "active" | "deprecated" | "unsupported"
    lastUpdate: string | null
  }
  performanceImpact: {
    parsingComplexity: "low" | "medium" | "high"
    size: "optimal" | "large" | "excessive"
    efficiency: number
  }
}

interface UserAgentInfo {
  browser: string
  version: string
  os: string
  device: string
  platform: string
  isValid: boolean
  details: {
    length: number
    hasVersion: boolean
    userAgent: string
    osVersion?: string
    buildNumber?: string
    deviceModel?: string
    manufacturer?: string
    chipset?: string
    resolution?: string
    dpi?: string
    language?: string
    isWebView?: boolean
    isFacebookApp?: boolean
    isInstagramApp?: boolean
    appVersion?: string
    webkitVersion?: string
    chromeVersion?: string
    facebookVersion?: string
    instagramVersion?: string
    scale?: string
    uniqueId?: string
    iabmv?: string
    fbss?: string
    fbrv?: string
    error?: string
  }
  security: SecurityAnalysis
  compatibility: CompatibilityAnalysis
  recommendations: string[]
  components: {
    engine: string
    engineVersion: string
    layout: string
    javascript: string
    rendering: string
  }
}

interface GenerationHistoryItem {
  id: string
  app_type: string
  quantity: number
  user_agents: string[]
  generated_at: string
  created_by: string
}

export default function UserAgentCheckPage() {
  const [userAgents, setUserAgents] = useState<string[]>([])
  const [pastedUserAgents, setPastedUserAgents] = useState("")
  const [checkResults, setCheckResults] = useState<UserAgentInfo[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("")
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Load generation history on component mount
  useEffect(() => {
    loadGenerationHistory()
  }, [])

  const loadGenerationHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const history = await GenerationHistory.list("-generated_at")
      setGenerationHistory(history || [])
    } catch (error) {
      console.error("Error loading generation history:", error)
      toast.error("জেনারেশন হিস্ট্রি লোড করতে সমস্যা হয়েছে")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const parseUserAgent = (userAgent: string): UserAgentInfo => {
    try {
      // Basic validation
      const isValid = userAgent.length > 10 && userAgent.includes("/")

      let browser = "Unknown"
      let version = "Unknown"
      let os = "Unknown"
      let device = "Unknown"
      let platform = "Unknown"

      // Enhanced details object
      const details: any = {
        length: userAgent.length,
        hasVersion: userAgent.includes("/"),
        userAgent: userAgent,
        isWebView: false,
        isFacebookApp: false,
        isInstagramApp: false,
      }

      const botPatterns = [
        /bot|crawler|spider|scraper/i,
        /googlebot|bingbot|slurp|duckduckbot/i,
        /facebookexternalhit|twitterbot|linkedinbot/i,
        /whatsapp|telegram|discord/i,
        /curl|wget|python|java|php/i,
        /headless|phantom|selenium|puppeteer/i,
      ]

      const isBotDetected = botPatterns.some((pattern) => pattern.test(userAgent))

      const suspiciousPatterns = [
        userAgent.length > 1000, // Excessively long
        userAgent.length < 20, // Too short
        /[<>{}[\]]/g.test(userAgent), // Contains suspicious characters
        userAgent.split(" ").length > 50, // Too many components
        /\b(hack|exploit|inject|xss|sql)\b/i.test(userAgent), // Malicious keywords
        userAgent.includes(".."), // Path traversal attempts
        userAgent.includes("%"), // URL encoding (suspicious in UA)
      ]

      const isSuspicious = suspiciousPatterns.some((pattern) => pattern === true)

      const components = {
        engine: "Unknown",
        engineVersion: "Unknown",
        layout: "Unknown",
        javascript: "Unknown",
        rendering: "Unknown",
      }

      // Detect WebView
      if (userAgent.includes("; wv)") || userAgent.includes("Version/4.0")) {
        details.isWebView = true
      }

      // Detect Facebook In-App Browser
      if (userAgent.includes("[FB_IAB/") || userAgent.includes("FBAN/FBIOS") || userAgent.includes("FBAV/")) {
        details.isFacebookApp = true
        browser = "Facebook In-App Browser"
        components.engine = "WebView"
        components.layout = "Blink"

        // Extract Facebook version
        const fbavMatch = userAgent.match(/FBAV\/([0-9.]+)/)
        if (fbavMatch) {
          details.facebookVersion = fbavMatch[1]
          version = fbavMatch[1]
        }

        // Extract FBRV
        const fbrvMatch = userAgent.match(/FBRV\/([0-9]+)/)
        if (fbrvMatch) {
          details.fbrv = fbrvMatch[1]
        }

        // Extract FBSS
        const fbssMatch = userAgent.match(/FBSS\/([0-9.]+)/)
        if (fbssMatch) {
          details.fbss = fbssMatch[1]
        }

        // Extract IABMV
        const iabmvMatch = userAgent.match(/IABMV\/([0-9]+)/)
        if (iabmvMatch) {
          details.iabmv = iabmvMatch[1]
        }
      }

      // Detect Instagram App
      if (userAgent.includes("Instagram ")) {
        details.isInstagramApp = true
        browser = "Instagram In-App Browser"
        components.engine = "WebView"
        components.layout = "Blink"

        // Extract Instagram version
        const instaMatch = userAgent.match(/Instagram ([0-9.]+)/)
        if (instaMatch) {
          details.instagramVersion = instaMatch[1]
          version = instaMatch[1]
        }

        // Extract unique ID
        const uniqueIdMatch = userAgent.match(/; ([0-9]+); IABMV/)
        if (uniqueIdMatch) {
          details.uniqueId = uniqueIdMatch[1]
        }
      }

      // Extract Chrome version and engine info
      const chromeMatch = userAgent.match(/Chrome\/([0-9.]+)/)
      if (chromeMatch) {
        details.chromeVersion = chromeMatch[1]
        components.engine = "Blink"
        components.layout = "Blink"
        components.javascript = "V8"
        if (!details.isFacebookApp && !details.isInstagramApp) {
          browser = "Chrome"
          version = chromeMatch[1]
        }
      }

      // Extract WebKit version
      const webkitMatch = userAgent.match(/AppleWebKit\/([0-9.]+)/)
      if (webkitMatch) {
        details.webkitVersion = webkitMatch[1]
        if (!components.engine || components.engine === "Unknown") {
          components.engine = "WebKit"
          components.layout = "WebKit"
        }
      }

      // Extract Firefox version
      const firefoxMatch = userAgent.match(/Firefox\/([0-9.]+)/)
      if (firefoxMatch && !details.isFacebookApp && !details.isInstagramApp) {
        browser = "Firefox"
        version = firefoxMatch[1]
        components.engine = "Gecko"
        components.layout = "Gecko"
        components.javascript = "SpiderMonkey"
      }

      // Extract Safari version
      if (
        userAgent.includes("Safari/") &&
        !userAgent.includes("Chrome") &&
        !details.isFacebookApp &&
        !details.isInstagramApp
      ) {
        browser = "Safari"
        components.engine = "WebKit"
        components.layout = "WebKit"
        components.javascript = "JavaScriptCore"
        const safariMatch = userAgent.match(/Version\/([0-9.]+)/)
        if (safariMatch) version = safariMatch[1]
      }

      // Enhanced OS and device detection
      if (userAgent.includes("iPhone")) {
        os = "iOS"
        platform = "Mobile"
        device = "iPhone"
        components.rendering = "Core Animation"

        // Extract iOS version
        const iosMatch = userAgent.match(/iPhone OS ([0-9_]+)/)
        if (iosMatch) {
          details.osVersion = iosMatch[1].replace(/_/g, ".")
        }

        // Extract device model
        const deviceMatch = userAgent.match(/\(([^;]+); CPU iPhone OS/)
        if (deviceMatch) {
          details.deviceModel = deviceMatch[1]
        }

        // Extract build number
        const buildMatch = userAgent.match(/Mobile\/([A-Z0-9]+)/)
        if (buildMatch) {
          details.buildNumber = buildMatch[1]
        }

        // Extract scale and resolution for Instagram
        if (details.isInstagramApp) {
          const scaleMatch = userAgent.match(/scale=([0-9.]+)/)
          if (scaleMatch) {
            details.scale = scaleMatch[1]
          }

          const resolutionMatch = userAgent.match(/scale=[0-9.]+; ([0-9x]+)/)
          if (resolutionMatch) {
            details.resolution = resolutionMatch[1]
          }
        }
      } else if (userAgent.includes("iPad")) {
        os = "iOS"
        platform = "Tablet"
        device = "iPad"
        components.rendering = "Core Animation"

        // Extract iOS version
        const iosMatch = userAgent.match(/iPad; CPU OS ([0-9_]+)/)
        if (iosMatch) {
          details.osVersion = iosMatch[1].replace(/_/g, ".")
        }
      } else if (userAgent.includes("Android")) {
        os = "Android"
        platform = userAgent.includes("Mobile") ? "Mobile" : "Tablet"
        components.rendering = "Skia"

        // Extract Android version
        const androidMatch = userAgent.match(/Android ([0-9.]+)/)
        if (androidMatch) {
          details.osVersion = androidMatch[1]
        }

        // Extract device model and manufacturer
        const deviceMatch = userAgent.match(/Android [0-9.]+; ([^)]+)\)/)
        if (deviceMatch) {
          const deviceInfo = deviceMatch[1].trim()
          details.deviceModel = deviceInfo

          // Extract build number
          const buildMatch = deviceInfo.match(/Build\/([A-Z0-9.]+)/)
          if (buildMatch) {
            details.buildNumber = buildMatch[1]
            details.deviceModel = deviceInfo.replace(/ Build\/[A-Z0-9.]+/, "")
          }
        }

        // Extract manufacturer and chipset for Instagram
        if (details.isInstagramApp) {
          const instaDetailsMatch = userAgent.match(/; ([^;]+); ([^;]+); ([^;]+); ([^;]+); ([^)]+)\)/)
          if (instaDetailsMatch) {
            details.dpi = instaDetailsMatch[1]
            details.resolution = instaDetailsMatch[2]
            details.manufacturer = instaDetailsMatch[3]
            details.chipset = instaDetailsMatch[5]
          }

          // Extract language
          const langMatch = userAgent.match(/; ([a-z]{2}_[A-Z]{2}); [0-9]+; IABMV/)
          if (langMatch) {
            details.language = langMatch[1]
          }
        }

        // Extract manufacturer for Facebook
        if (details.isFacebookApp) {
          const fbDeviceMatch = userAgent.match(/FBMD\/([^;]+)/)
          if (fbDeviceMatch) {
            details.manufacturer = fbDeviceMatch[1]
          }
        }
      } else if (userAgent.includes("Windows")) {
        os = "Windows"
        platform = "Desktop"
        components.rendering = "DirectWrite"

        // Extract Windows version
        if (userAgent.includes("Windows NT")) {
          const winMatch = userAgent.match(/Windows NT ([0-9.]+)/)
          if (winMatch) {
            const ntVersion = winMatch[1]
            const windowsVersions = {
              "10.0": "Windows 10/11",
              "6.3": "Windows 8.1",
              "6.2": "Windows 8",
              "6.1": "Windows 7",
            }
            details.osVersion = windowsVersions[ntVersion] || `Windows NT ${ntVersion}`
          }
        }
      } else if (userAgent.includes("Mac OS X")) {
        os = "macOS"
        platform = "Desktop"
        components.rendering = "Core Graphics"

        // Extract macOS version
        const macMatch = userAgent.match(/Mac OS X ([0-9_]+)/)
        if (macMatch) {
          details.osVersion = macMatch[1].replace(/_/g, ".")
        }
      }

      // Extract language if not already found
      if (!details.language) {
        const langMatch = userAgent.match(/FBLC\/([a-z]{2}_[A-Z]{2})/)
        if (langMatch) {
          details.language = langMatch[1]
        }
      }

      const security: SecurityAnalysis = {
        riskLevel: "low",
        threats: [],
        isBot: isBotDetected,
        isSuspicious: isSuspicious,
        fingerprinting: {
          resistance: "low",
          uniqueness: 0,
          trackingRisk: "low",
        },
      }

      // Calculate risk level
      if (isBotDetected) {
        security.threats.push("Bot/Crawler detected")
        security.riskLevel = "medium"
      }

      if (isSuspicious) {
        security.threats.push("Suspicious patterns detected")
        security.riskLevel = security.riskLevel === "medium" ? "high" : "medium"
      }

      if (userAgent.length > 800) {
        security.threats.push("Excessively long user agent")
        security.fingerprinting.trackingRisk = "high"
      }

      if (details.isWebView) {
        security.threats.push("WebView detected - potential security risks")
      }

      // Calculate fingerprinting resistance
      const uniqueComponents = [
        details.deviceModel,
        details.buildNumber,
        details.resolution,
        details.dpi,
        details.chipset,
        details.language,
      ].filter(Boolean).length

      security.fingerprinting.uniqueness = uniqueComponents * 10
      security.fingerprinting.resistance = uniqueComponents > 4 ? "low" : uniqueComponents > 2 ? "medium" : "high"
      security.fingerprinting.trackingRisk = uniqueComponents > 4 ? "high" : uniqueComponents > 2 ? "medium" : "low"

      const compatibility: CompatibilityAnalysis = {
        browserSupport: {
          modern: false,
          legacy: false,
          outdated: false,
        },
        securityStatus: {
          hasKnownVulnerabilities: false,
          supportStatus: "active",
          lastUpdate: null,
        },
        performanceImpact: {
          parsingComplexity: "low",
          size: "optimal",
          efficiency: 100,
        },
      }

      // Analyze browser version
      if (browser === "Chrome" && version) {
        const majorVersion = Number.parseInt(version.split(".")[0])
        compatibility.browserSupport.modern = majorVersion >= 100
        compatibility.browserSupport.legacy = majorVersion >= 70 && majorVersion < 100
        compatibility.browserSupport.outdated = majorVersion < 70

        if (majorVersion < 80) {
          compatibility.securityStatus.hasKnownVulnerabilities = true
          compatibility.securityStatus.supportStatus = "deprecated"
        }
      }

      // Analyze user agent complexity
      if (userAgent.length > 500) {
        compatibility.performanceImpact.parsingComplexity = "high"
        compatibility.performanceImpact.size = "excessive"
        compatibility.performanceImpact.efficiency = 60
      } else if (userAgent.length > 300) {
        compatibility.performanceImpact.parsingComplexity = "medium"
        compatibility.performanceImpact.size = "large"
        compatibility.performanceImpact.efficiency = 80
      }

      const recommendations: string[] = []

      if (security.riskLevel === "high" || security.riskLevel === "critical") {
        recommendations.push("🔒 নিরাপত্তা ঝুঁকি রয়েছে - ব্যবহারে সতর্ক থাকুন")
      }

      if (compatibility.browserSupport.outdated) {
        recommendations.push("⚠️ পুরাতন ব্রাউজার ভার্সন - আপডেট করুন")
      }

      if (security.fingerprinting.trackingRisk === "high") {
        recommendations.push("👁️ উচ্চ ট্র্যাকিং ঝুঁকি - প্রাইভেসি সুরক্ষা ব্যবহার করুন")
      }

      if (details.isWebView) {
        recommendations.push("📱 WebView ব্যবহার করা হচ্ছে - নিরাপত্তা সীমাবদ্ধতা থাকতে পারে")
      }

      if (compatibility.performanceImpact.size === "excessive") {
        recommendations.push("🚀 ইউজার এজেন্ট অত্যধিক বড় - পারফরম্যান্স প্রভাবিত হতে পারে")
      }

      if (security.isBot) {
        recommendations.push("🤖 Bot/Crawler সনাক্ত - স্বয়ংক্রিয় ট্রাফিক")
      }

      if (recommendations.length === 0) {
        recommendations.push("✅ কোন সমস্যা পাওয়া যায়নি - নিরাপদ ব্যবহার")
      }

      return {
        browser,
        version,
        os,
        device,
        platform,
        isValid,
        details,
        security,
        compatibility,
        recommendations,
        components,
      }
    } catch (error) {
      return {
        browser: "Error",
        version: "Error",
        os: "Error",
        device: "Error",
        platform: "Error",
        isValid: false,
        details: {
          length: userAgent.length,
          hasVersion: false,
          userAgent: userAgent,
          error: error.message,
        },
        security: {
          riskLevel: "critical",
          threats: ["Parsing error occurred"],
          isBot: false,
          isSuspicious: true,
          fingerprinting: {
            resistance: "low",
            uniqueness: 0,
            trackingRisk: "low",
          },
        },
        compatibility: {
          browserSupport: {
            modern: false,
            legacy: false,
            outdated: true,
          },
          securityStatus: {
            hasKnownVulnerabilities: true,
            supportStatus: "unsupported",
            lastUpdate: null,
          },
          performanceImpact: {
            parsingComplexity: "high",
            size: "excessive",
            efficiency: 0,
          },
        },
        recommendations: ["❌ পার্সিং এরর - ইউজার এজেন্ট সঠিক নয়"],
        components: {
          engine: "Unknown",
          engineVersion: "Unknown",
          layout: "Unknown",
          javascript: "Unknown",
          rendering: "Unknown",
        },
      }
    }
  }

  const handleHistorySelect = (historyId: string) => {
    const selectedHistory = generationHistory.find((h) => h.id === historyId)
    if (selectedHistory) {
      setUserAgents(selectedHistory.user_agents)
      setSelectedHistoryId(historyId)
      toast.success(`${selectedHistory.user_agents.length}টি ইউজার এজেন্ট লোড করা হয়েছে`)
    }
  }

  const handlePastedUserAgents = () => {
    const agents = pastedUserAgents
      .split("\n")
      .map((ua) => ua.trim())
      .filter((ua) => ua.length > 0)

    if (agents.length === 0) {
      toast.error("কোন ইউজার এজেন্ট পাওয়া যায়নি")
      return
    }

    setUserAgents(agents)
    toast.success(`${agents.length}টি ইউজার এজেন্ট যোগ করা হয়েছে`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const agents = content
        .split("\n")
        .map((ua) => ua.trim())
        .filter((ua) => ua.length > 0)

      if (agents.length === 0) {
        toast.error("ফাইলে কোন ইউজার এজেন্ট পাওয়া যায়নি")
        return
      }

      setUserAgents(agents)
      toast.success(`${agents.length}টি ইউজার এজেন্ট আপলোড করা হয়েছে`)
    }
    reader.readAsText(file)
  }

  const checkUserAgents = async () => {
    if (userAgents.length === 0) {
      toast.error("চেক করার জন্য ইউজার এজেন্ট যোগ করুন")
      return
    }

    setIsChecking(true)
    try {
      const results = userAgents.map((ua) => parseUserAgent(ua))
      setCheckResults(results)
      toast.success(`${results.length}টি ইউজার এজেন্ট চেক করা হয়েছে`)
    } catch (error) {
      console.error("Error checking user agents:", error)
      toast.error("ইউজার এজেন্ট চেক করতে সমস্যা হয়েছে")
    } finally {
      setIsChecking(false)
    }
  }

  const copyResults = () => {
    const resultsText = checkResults
      .map(
        (result, index) =>
          `${index + 1}. ${result.isValid ? "✅" : "❌"} ${result.browser} ${result.version} - ${result.os} (${result.platform}) - Risk: ${result.security.riskLevel}`,
      )
      .join("\n")

    navigator.clipboard.writeText(resultsText)
    toast.success("ফলাফল কপি করা হয়েছে")
  }

  const clearAll = () => {
    setUserAgents([])
    setPastedUserAgents("")
    setCheckResults([])
    setSelectedHistoryId("")
    toast.success("সব ডেটা ক্লিয়ার করা হয়েছে")
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">ইউজার এজেন্ট চেকার</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              আপনার ইউজার এজেন্টের বিস্তারিত বিশ্লেষণ এবং নিরাপত্তা মূল্যায়ন
            </p>
          </div>
          <Link href="/check/info">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Info className="w-4 h-4" />
              গাইড ও তথ্য
            </Button>
          </Link>
        </div>

        {/* ... existing input methods code ... */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              হিস্ট্রি থেকে
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <Paste className="w-4 h-4" />
              পেস্ট করুন
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              আপলোড করুন
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  জেনারেশন হিস্ট্রি
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={selectedHistoryId} onValueChange={handleHistorySelect}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="হিস্ট্রি সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {generationHistory.map((history) => (
                        <SelectItem key={history.id} value={history.id}>
                          {history.app_type} - {history.quantity}টি ইউজার এজেন্ট (
                          {new Date(history.generated_at).toLocaleDateString("bn-BD")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={loadGenerationHistory} disabled={isLoadingHistory}>
                    <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                {userAgents.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/90 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{userAgents.length}টি ইউজার এজেন্ট লোড করা হয়েছে</p>
                    <div className="max-h-32 overflow-y-auto text-xs font-mono">
                      {userAgents.slice(0, 3).map((ua, index) => (
                        <div key={index} className="truncate">
                          {ua}
                        </div>
                      ))}
                      {userAgents.length > 3 && (
                        <div className="text-gray-500">... এবং আরো {userAgents.length - 3}টি</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paste className="w-5 h-5" />
                  ইউজার এজেন্ট পেস্ট করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="এখানে ইউজার এজেন্টগুলো পেস্ট করুন (প্রতি লাইনে একটি করে)..."
                  value={pastedUserAgents}
                  onChange={(e) => setPastedUserAgents(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <Button onClick={handlePastedUserAgents} disabled={!pastedUserAgents.trim()}>
                  <Paste className="w-4 h-4 mr-2" />
                  ইউজার এজেন্ট যোগ করুন
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  ফাইল আপলোড করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">ইউজার এজেন্ট ফাইল আপলোড করুন (.txt)</p>
                  <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>ফাইল সিলেক্ট করুন</span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        {userAgents.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 justify-center">
                <Button onClick={checkUserAgents} disabled={isChecking} size="lg">
                  {isChecking ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {isChecking ? "চেক করা হচ্ছে..." : `${userAgents.length}টি ইউজার এজেন্ট চেক করুন`}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <X className="w-4 h-4 mr-2" />
                  ক্লিয়ার করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Results */}
        {checkResults.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                উন্নত বিশ্লেষণ ফলাফল ({checkResults.length}টি)
              </CardTitle>
              <Button variant="outline" onClick={copyResults}>
                <Copy className="w-4 h-4 mr-2" />
                ফলাফল কপি করুন
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {checkResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-50 dark:bg-slate-800/90 rounded-lg space-y-4 border-l-4 border-blue-500"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.isValid ? (
                          <Check className="w-6 h-6 text-green-500" />
                        ) : (
                          <X className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                          <div className="font-bold text-xl">
                            {result.browser} {result.version}
                          </div>
                          <div className="text-sm text-gray-600">
                            {result.os} {result.details.osVersion && `${result.details.osVersion}`} • {result.platform}
                            {result.device && result.device !== "Unknown" && ` • ${result.device}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={result.isValid ? "default" : "destructive"}>
                          {result.isValid ? "বৈধ" : "অবৈধ"}
                        </Badge>
                        <Badge className={getRiskLevelColor(result.security.riskLevel)}>
                          {result.security.riskLevel === "low" && "🟢 নিরাপদ"}
                          {result.security.riskLevel === "medium" && "🟡 মাঝারি"}
                          {result.security.riskLevel === "high" && "🟠 উচ্চ ঝুঁকি"}
                          {result.security.riskLevel === "critical" && "🔴 সংকটজনক"}
                        </Badge>
                        {result.security.isBot && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            🤖 Bot
                          </Badge>
                        )}
                        {result.details.isWebView && <Badge variant="secondary">WebView</Badge>}
                        {result.details.isFacebookApp && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Facebook
                          </Badge>
                        )}
                        {result.details.isInstagramApp && (
                          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                            Instagram
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details" className="flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          বিস্তারিত
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          নিরাপত্তা
                        </TabsTrigger>
                        <TabsTrigger value="compatibility" className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          সামঞ্জস্য
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          সুপারিশ
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          {result.details.deviceModel && (
                            <div>
                              <span className="font-medium text-gray-700">ডিভাইস মডেল:</span>
                              <span className="ml-2 text-gray-600">{result.details.deviceModel}</span>
                            </div>
                          )}
                          {result.details.manufacturer && (
                            <div>
                              <span className="font-medium text-gray-700">প্রস্তুতকারক:</span>
                              <span className="ml-2 text-gray-600">{result.details.manufacturer}</span>
                            </div>
                          )}
                          {result.details.buildNumber && (
                            <div>
                              <span className="font-medium text-gray-700">বিল্ড নম্বর:</span>
                              <span className="ml-2 text-gray-600 font-mono">{result.details.buildNumber}</span>
                            </div>
                          )}
                          {result.components.engine && result.components.engine !== "Unknown" && (
                            <div>
                              <span className="font-medium text-gray-700">ইঞ্জিন:</span>
                              <span className="ml-2 text-gray-600">{result.components.engine}</span>
                            </div>
                          )}
                          {result.components.layout && result.components.layout !== "Unknown" && (
                            <div>
                              <span className="font-medium text-gray-700">লেআউট:</span>
                              <span className="ml-2 text-gray-600">{result.components.layout}</span>
                            </div>
                          )}
                          {result.components.javascript && result.components.javascript !== "Unknown" && (
                            <div>
                              <span className="font-medium text-gray-700">JavaScript:</span>
                              <span className="ml-2 text-gray-600">{result.components.javascript}</span>
                            </div>
                          )}
                          {result.details.chipset && (
                            <div>
                              <span className="font-medium text-gray-700">চিপসেট:</span>
                              <span className="ml-2 text-gray-600">{result.details.chipset}</span>
                            </div>
                          )}
                          {result.details.resolution && (
                            <div>
                              <span className="font-medium text-gray-700">রেজোলিউশন:</span>
                              <span className="ml-2 text-gray-600">{result.details.resolution}</span>
                            </div>
                          )}
                          {result.details.dpi && (
                            <div>
                              <span className="font-medium text-gray-700">DPI:</span>
                              <span className="ml-2 text-gray-600">{result.details.dpi}</span>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="security" className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white dark:bg-slate-700/50 rounded border dark:border-slate-600">
                            <h4 className="font-medium mb-2">🔒 নিরাপত্তা স্থিতি</h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                ঝুঁকি স্তর:{" "}
                                <Badge className={getRiskLevelColor(result.security.riskLevel)}>
                                  {result.security.riskLevel}
                                </Badge>
                              </div>
                              <div>Bot সনাক্তকরণ: {result.security.isBot ? "✅ হ্যাঁ" : "❌ না"}</div>
                              <div>সন্দেহজনক: {result.security.isSuspicious ? "⚠️ হ্যাঁ" : "✅ না"}</div>
                            </div>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-700/50 rounded border dark:border-slate-600">
                            <h4 className="font-medium mb-2">👁️ ফিঙ্গারপ্রিন্টিং</h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                প্রতিরোধ: <Badge variant="outline">{result.security.fingerprinting.resistance}</Badge>
                              </div>
                              <div>অনন্যতা: {result.security.fingerprinting.uniqueness}%</div>
                              <div>
                                ট্র্যাকিং ঝুঁকি:{" "}
                                <Badge variant="outline">{result.security.fingerprinting.trackingRisk}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        {result.security.threats.length > 0 && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">⚠️ সনাক্তকৃত হুমকি</h4>
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                              {result.security.threats.map((threat, i) => (
                                <li key={i}>• {threat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="compatibility" className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white dark:bg-slate-700/50 rounded border dark:border-slate-600">
                            <h4 className="font-medium mb-2">🌐 ব্রাউজার সাপোর্ট</h4>
                            <div className="space-y-1 text-sm">
                              <div>আধুনিক: {result.compatibility.browserSupport.modern ? "✅ হ্যাঁ" : "❌ না"}</div>
                              <div>পুরাতন: {result.compatibility.browserSupport.legacy ? "⚠️ হ্যাঁ" : "✅ না"}</div>
                              <div>অচল: {result.compatibility.browserSupport.outdated ? "🔴 হ্যাঁ" : "✅ না"}</div>
                            </div>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-700/50 rounded border dark:border-slate-600">
                            <h4 className="font-medium mb-2">⚡ পারফরম্যান্স</h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                জটিলতা:{" "}
                                <Badge variant="outline">
                                  {result.compatibility.performanceImpact.parsingComplexity}
                                </Badge>
                              </div>
                              <div>
                                আকার: <Badge variant="outline">{result.compatibility.performanceImpact.size}</Badge>
                              </div>
                              <div>দক্ষতা: {result.compatibility.performanceImpact.efficiency}%</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="recommendations" className="space-y-3">
                        <div className="space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 text-sm"
                            >
                              {rec}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* User agent string */}
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/90 rounded text-xs font-mono break-all">
                      <div className="text-gray-600 mb-1">ইউজার এজেন্ট স্ট্রিং ({result.details.length} অক্ষর):</div>
                      {result.details.userAgent}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/90 dark:to-slate-700/90 rounded-lg border">
                <h3 className="font-bold text-xl mb-4 text-center">📊 উন্নত বিশ্লেষণ সামারি</h3>

                {/* Basic stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{checkResults.length}</div>
                    <div className="text-sm text-gray-600">মোট</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {checkResults.filter((r) => r.isValid).length}
                    </div>
                    <div className="text-sm text-gray-600">বৈধ</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600">
                      {checkResults.filter((r) => !r.isValid).length}
                    </div>
                    <div className="text-sm text-gray-600">অবৈধ</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round((checkResults.filter((r) => r.isValid).length / checkResults.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">সফলতার হার</div>
                  </div>
                </div>

                {/* Security stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {
                        checkResults.filter(
                          (r) => r.security.riskLevel === "high" || r.security.riskLevel === "critical",
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">উচ্চ ঝুঁকি</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {checkResults.filter((r) => r.security.isBot).length}
                    </div>
                    <div className="text-sm text-gray-600">Bot/Crawler</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {checkResults.filter((r) => r.details.isWebView).length}
                    </div>
                    <div className="text-sm text-gray-600">WebView</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {checkResults.filter((r) => r.security.fingerprinting.trackingRisk === "high").length}
                    </div>
                    <div className="text-sm text-gray-600">উচ্চ ট্র্যাকিং</div>
                  </div>
                </div>

                {/* Platform stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-gray-600">
                      {checkResults.filter((r) => r.platform === "Mobile").length}
                    </div>
                    <div className="text-sm text-gray-600">মোবাইল</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {checkResults.filter((r) => r.details.isFacebookApp).length}
                    </div>
                    <div className="text-sm text-gray-600">Facebook</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-pink-600">
                      {checkResults.filter((r) => r.details.isInstagramApp).length}
                    </div>
                    <div className="text-sm text-gray-600">Instagram</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {checkResults.filter((r) => r.compatibility.browserSupport.modern).length}
                    </div>
                    <div className="text-sm text-gray-600">আধুনিক ব্রাউজার</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
