"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Zap,
  Download,
  Copy,
  Settings,
  Sparkles,
  Loader2,
  Instagram,
  Facebook,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  X,
  Cpu,
  Bell,
  Calendar,
  Activity,
} from "lucide-react"
import CustomModal from "@/components/CustomModal"

import {
  DeviceModel,
  IOSVersion,
  AppVersion,
  Configuration,
  BlacklistedUserAgent,
  AndroidDeviceModel,
  AndroidBuildNumber,
  AndroidAppVersion,
  InstagramDeviceModel,
  InstagramVersion,
  ChromeVersion,
  ResolutionDpi,
  AccessKey,
  UserGeneration,
  AdminNotice,
} from "@/lib/supabase"

// Enhanced Progress Modal Component
function ProgressModal({ isOpen, title, message, progress, onCancel, showCancel = false, type = "info" }) {
  const [pulseAnimation, setPulseAnimation] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setPulseAnimation((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) return null

  const iconMap = {
    info: Loader2,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
  }

  const colorMap = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
  }

  const Icon = iconMap[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!showCancel ? undefined : onCancel} />
      <div className="relative z-10 w-full max-w-lg transform transition-all duration-500 animate-in zoom-in-95">
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

          <div className="px-6 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                  <Icon
                    className={`w-6 h-6 ${colorMap[type]} ${type === "info" ? "animate-spin" : ""}`}
                    style={{ animationDuration: type === "info" ? "2s" : "1s" }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                          style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: "1s",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{pulseAnimation} সেকেন্ড চলছে...</span>
                  </div>
                </div>
              </div>
              {showCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="px-6 py-6 bg-white dark:bg-slate-800">
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-base">{message}</p>
            {progress !== undefined && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    প্রগ্রেস
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{
                          animation: "shimmer 2s ease-in-out infinite",
                          transform: "translateX(-100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>উচ্চ গতি</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 animate-spin text-blue-500" style={{ animationDuration: "3s" }} />
                    <span>প্রসেসিং...</span>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>💡 টিপস: প্রতিটি ইউজার এজেন্ট ইউনিক এবং সম্পূর্ণ বৈধ হবে!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default function UserGeneratorPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [platform, setPlatform] = useState("")
  const [appType, setAppType] = useState("")
  const [quantity, setQuantity] = useState(100)
  const [userAgents, setUserAgents] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [history, setHistory] = useState([])
  const [notices, setNotices] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [activeSection, setActiveSection] = useState("generator")
  const [generatedUserAgents, setGeneratedUserAgents] = useState([])

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
    showCancel: false,
  })

  const [progressModal, setProgressModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    progress: 0,
    type: "info",
    showCancel: false,
  })

  // Data for generation
  const [deviceModels, setDeviceModels] = useState([])
  const [iosVersions, setIosVersions] = useState([])
  const [appVersions, setAppVersions] = useState([])
  const [configurations, setConfigurations] = useState({})
  const [blacklistedUAs, setBlacklistedUAs] = useState(new Set())
  const [androidDeviceModels, setAndroidDeviceModels] = useState([])
  const [androidBuildNumbers, setAndroidBuildNumbers] = useState([])
  const [androidAppVersions, setAndroidAppVersions] = useState([])
  const [instagramDeviceModels, setInstagramDeviceModels] = useState([])
  const [instagramVersions, setInstagramVersions] = useState([])
  const [chromeVersions, setChromeVersions] = useState([])
  const [resolutionDpis, setResolutionDpis] = useState([])

  const [allCopied, setAllCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  useEffect(() => {
    checkAuthentication()
    loadData()
    loadUserHistory()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadNotices()
    }
  }, [currentUser])

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

  const showModal = (title, message, type = "info", onConfirm = () => {}, showCancel = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel,
    })
  }

  const showProgressModal = (title, message, progress = 0, type = "info", showCancel = false) => {
    setProgressModal({
      isOpen: true,
      title,
      message,
      progress,
      type,
      showCancel,
    })
  }

  const hideProgressModal = () => {
    setProgressModal((prev) => ({ ...prev, isOpen: false }))
  }

  const loadData = async () => {
    try {
      const [
        devices,
        ios,
        apps,
        configs,
        blacklisted,
        androidDevices,
        androidBuilds,
        androidApps,
        instagramDevices,
        instagramVers,
        chromeVers,
        resDpis,
      ] = await Promise.all([
        DeviceModel.list(),
        IOSVersion.list(),
        AppVersion.list(),
        Configuration.list(),
        BlacklistedUserAgent.list(),
        AndroidDeviceModel.list(),
        AndroidBuildNumber.list(),
        AndroidAppVersion.list(),
        InstagramDeviceModel.list(),
        InstagramVersion.list(),
        ChromeVersion.list(),
        ResolutionDpi.list(),
      ])

      setDeviceModels(devices.filter((d) => d.is_active))
      setIosVersions(ios.filter((v) => v.is_active))
      setAppVersions(apps.filter((a) => a.is_active))
      setAndroidDeviceModels(androidDevices.filter((d) => d.is_active))
      setAndroidBuildNumbers(androidBuilds.filter((b) => b.is_active))
      setAndroidAppVersions(androidApps.filter((a) => a.is_active))
      setInstagramDeviceModels(instagramDevices.filter((d) => d.is_active))
      setInstagramVersions(instagramVers.filter((v) => v.is_active))
      setChromeVersions(chromeVers.filter((v) => v.is_active))
      setResolutionDpis(resDpis.filter((r) => r.is_active))

      const configsObj = {}
      configs.forEach((config) => {
        try {
          configsObj[config.config_key] = JSON.parse(config.config_value)
        } catch (e) {
          configsObj[config.config_key] = config.config_value
        }
      })
      setConfigurations(configsObj)

      const blacklistSet = new Set(blacklisted.map((b) => b.user_agent))
      setBlacklistedUAs(blacklistSet)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const loadUserHistory = async () => {
    if (!currentUser) return

    try {
      setIsLoadingHistory(true)
      const userHistory = await UserGeneration.getUserHistory(currentUser.access_key, 20)
      setHistory(userHistory)
    } catch (error) {
      console.error("Error loading user history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadNotices = async () => {
    if (!currentUser) return

    try {
      const activeNotices = await AdminNotice.getActiveNotices(currentUser.user_name)
      setNotices(activeNotices)
    } catch (error) {
      console.error("Error loading notices:", error)
    }
  }

  const handleGenerate = async () => {
    if (!currentUser) return

    if (!AccessKey.canGenerate(currentUser)) {
      showModal(
        "⚠️ লিমিট শেষ!",
        `আপনার জেনারেশন লিমিট শেষ হয়ে গেছে। বর্তমান লিমিট: ${currentUser.generation_limit}`,
        "warning",
      )
      return
    }

    if (!platform) {
      showModal("⚠️ প্ল্যাটফর্ম নির্বাচন করুন!", "অনুগ্রহ করে একটি প্ল্যাটফর্ম নির্বাচন করুন।", "warning")
      return
    }

    if (!appType) {
      showModal("⚠️ অ্যাপ টাইপ নির্বাচন করুন!", "অনুগ্রহ করে একটি অ্যাপ টাইপ নির্বাচন করুন।", "warning")
      return
    }

    const remainingGenerations = AccessKey.getRemainingGenerations(currentUser)
    const requestedQuantity = Math.min(quantity, remainingGenerations === "Unlimited" ? quantity : remainingGenerations)

    if (requestedQuantity < 1) {
      showModal("⚠️ লিমিট শেষ!", "আপনার আর কোন জেনারেশন বাকি নেই।", "warning")
      return
    }

    if (requestedQuantity < quantity) {
      showModal(
        "⚠️ লিমিট সীমাবদ্ধতা",
        `আপনি ${quantity}টি চেয়েছেন কিন্তু শুধু ${requestedQuantity}টি জেনারেট করা যাবে।`,
        "warning",
        () => {
          setModal((prev) => ({ ...prev, isOpen: false }))
          performGeneration(requestedQuantity)
        },
        true,
      )
      return
    }

    performGeneration(requestedQuantity)
  }

  const performGeneration = async (actualQuantity) => {
    if (!currentUser) {
      showModal("❌ অনুমতি নেই!", "আপনি লগইন করেননি।", "error")
      return
    }

    const validationResult = validateDataForGeneration()
    if (!validationResult.isValid) {
      showModal("❌ ডেটা সমস্যা!", validationResult.message, "error")
      return
    }

    if (!AccessKey.canGenerate(currentUser)) {
      showModal("❌ জেনারেশন সীমা শেষ!", "আপনার দৈনিক জেনারেশন সীমা শেষ হয়ে গেছে। আগামীকাল আবার চেষ্টা করুন।", "error")
      return
    }

    if (actualQuantity < 1 || actualQuantity > 100) {
      showModal("❌ ভুল পরিমাণ!", "১ থেকে ১০০ এর মধ্যে সংখ্যা দিন।", "error")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setProgressModal({
      isOpen: true,
      title: "🚀 জেনারেশন চলছে...",
      message: "অনুগ্রহ করে অপেক্ষা করুন...",
      progress: 0,
    })

    try {
      const newUserAgents = []
      const batchSize = 10
      const totalBatches = Math.ceil(actualQuantity / batchSize)

      console.log("[v0] Starting generation with validation and duplicate check")
      console.log("[v0] Blacklisted UAs count:", blacklistedUAs.size)

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIndex = batchIndex * batchSize
        const endIndex = Math.min(startIndex + batchSize, actualQuantity)
        const currentBatchSize = endIndex - startIndex

        const batchPromises = []
        for (let i = 0; i < currentBatchSize; i++) {
          const globalIndex = startIndex + i
          batchPromises.push(
            generateUserAgent(platform, appType)
              .then((userAgent) => ({
                success: true,
                userAgent,
                index: globalIndex,
              }))
              .catch((error) => ({
                success: false,
                error: error.message,
                index: globalIndex,
              })),
          )
        }

        const batchResults = await Promise.all(batchPromises)

        for (const result of batchResults) {
          if (result.success && result.userAgent) {
            if (!blacklistedUAs.has(result.userAgent)) {
              newUserAgents.push({
                id: Date.now() + result.index,
                userAgent: result.userAgent,
                platform,
                appType,
                generatedAt: new Date().toISOString(),
              })
            } else {
              console.log("[v0] Skipped duplicate user agent:", result.userAgent.substring(0, 50) + "...")
            }
          } else if (result.error) {
            console.error("[v0] Generation error:", result.error)
          }
        }

        const progress = Math.round(((batchIndex + 1) / totalBatches) * 100)
        setGenerationProgress(progress)
        setProgressModal((prev) => ({
          ...prev,
          progress,
          message: `✨ ${newUserAgents.length}/${actualQuantity} ইউজার এজেন্ট তৈরি হয়েছে...`,
        }))

        if (batchIndex < totalBatches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      setProgressModal((prev) => ({ ...prev, isOpen: false }))

      if (newUserAgents.length === 0) {
        showModal("❌ জেনারেশন ব্যর্থ!", "কোন নতুন ইউজার এজেন্ট তৈরি করা যায়নি। সব ইউজার এজেন্ট ইতিমধ্যে ব্যবহৃত হয়েছে।", "error")
        return
      }

      await AccessKey.incrementGeneration(currentUser.access_key)

      // Add new user agents to blacklist to prevent future duplicates
      const blacklistPromises = newUserAgents.map((ua) =>
        BlacklistedUserAgent.create({
          user_agent: ua.userAgent,
          hash: btoa(ua.userAgent).substring(0, 32),
          downloaded_by: currentUser.user_name,
          app_type: appType,
        }),
      )

      await Promise.all(blacklistPromises)

      // Update local blacklist set
      newUserAgents.forEach((ua) => blacklistedUAs.add(ua.userAgent))

      setGeneratedUserAgents(newUserAgents)
      setIsGenerating(false)

      showModal("✅ জেনারেশন সফল!", `${newUserAgents.length}টি ইউজার এজেন্ট সফলভাবে তৈরি হয়েছে।`, "success", () => {
        setModal((prev) => ({ ...prev, isOpen: false }))
        loadData() // Refresh data to update remaining generations
      })

      console.log("[v0] Generation completed successfully:", newUserAgents.length)
    } catch (error) {
      console.error("[v0] Generation failed:", error)
      setProgressModal((prev) => ({ ...prev, isOpen: false }))
      setIsGenerating(false)

      showModal("❌ জেনারেশন ব্যর্থ!", `ইউজার এজেন্ট তৈরি করতে সমস্যা হয়েছে: ${error.message}`, "error")
    }
  }

  const validateDataForGeneration = () => {
    console.log("[v0] Validating data for generation...")
    console.log("[v0] Platform:", platform, "AppType:", appType)

    if (platform === "iOS") {
      if (!deviceModels || deviceModels.length === 0) {
        return { isValid: false, message: "iOS device models data missing. Please contact admin." }
      }
      if (!iosVersions || iosVersions.length === 0) {
        return { isValid: false, message: "iOS versions data missing. Please contact admin." }
      }
      if (!appVersions || appVersions.length === 0) {
        return { isValid: false, message: "App versions data missing. Please contact admin." }
      }
    } else if (platform === "Android") {
      if (appType === "Instagram") {
        if (!instagramDeviceModels || instagramDeviceModels.length === 0) {
          return { isValid: false, message: "Instagram device models data missing. Please contact admin." }
        }
        if (!instagramVersions || instagramVersions.length === 0) {
          return { isValid: false, message: "Instagram versions data missing. Please contact admin." }
        }
        if (!chromeVersions || chromeVersions.length === 0) {
          return { isValid: false, message: "Chrome versions data missing. Please contact admin." }
        }
      } else if (appType === "Facebook") {
        if (!androidDeviceModels || androidDeviceModels.length === 0) {
          return { isValid: false, message: "Android device models data missing. Please contact admin." }
        }
        if (!androidBuildNumbers || androidBuildNumbers.length === 0) {
          return { isValid: false, message: "Android build numbers data missing. Please contact admin." }
        }
        if (!androidAppVersions || androidAppVersions.length === 0) {
          return { isValid: false, message: "Android app versions data missing. Please contact admin." }
        }
      }
    }

    console.log("[v0] Data validation passed")
    return { isValid: true, message: "All data is valid" }
  }

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const extractModelIdentifier = (modelName) => {
    if (!modelName) return modelName
    const match = modelName.match(/^([^\s(]+)/)
    return match ? match[1] : modelName
  }

  const generateAndroidInstagramUserAgent = async () => {
    try {
      console.log("[v0] Generating Android Instagram user agent...")

      if (!instagramDeviceModels.length) {
        console.error("[v0] No Instagram device models available")
        return null
      }
      if (!instagramVersions.length) {
        console.error("[v0] No Instagram versions available")
        return null
      }
      if (!chromeVersions.length) {
        console.error("[v0] No Chrome versions available")
        return null
      }

      const versionPairs = {
        "11": "30/11",
        "12": "31/12",
        "13": "33/13",
        "14": "34/14",
        "15": "35/15",
      }

      const buildNumbers = {
        "11": "RP1A.200720.012",
        "12": "SP1A.210812.016",
        "13": "TP1A.220624.014",
        "14": "UP1A.231005.007",
        "15": "AP3A.240905.015.A2",
      }

      const languages = ["en_US", "en_GB", "es_US"]

      const device = instagramDeviceModels[Math.floor(Math.random() * instagramDeviceModels.length)]
      const androidVersion = device.android_version.toString()
      const versionPair = versionPairs[androidVersion]
      const buildNumber = buildNumbers[androidVersion]

      if (!versionPair || !buildNumber) {
        console.error(`[v0] No version pair or build number for Android ${androidVersion}`)
        return null
      }

      const resolutions = Array.isArray(device.resolutions)
        ? device.resolutions
        : device.resolutions.split(",").map((r) => r.trim())
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)]

      const matchingDpis = resolutionDpis.filter((rd) => rd.resolution === resolution)
      const dpiOptions = matchingDpis.length > 0 ? matchingDpis[0].dpis.map((d) => `${d}dpi`) : ["420dpi"]
      const dpi = dpiOptions[Math.floor(Math.random() * dpiOptions.length)]

      const language = languages[Math.floor(Math.random() * languages.length)]
      const instagramVersion = instagramVersions[Math.floor(Math.random() * instagramVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const userAgent =
        `Mozilla/5.0 (Linux; Android ${androidVersion}; ${device.model} Build/${buildNumber}; wv) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `Instagram ${instagramVersion.version} Android (${versionPair}; ${dpi}; ${resolution}; ${device.manufacturer}; ` +
        `${device.model}; ${device.code}; ${device.chipset}; ${language}; ${instagramVersion.unique_id}; IABMV/1)`

      console.log("[v0] Successfully generated Android Instagram user agent")
      return userAgent
    } catch (error) {
      console.error("[v0] Error generating Instagram Android user agent:", error)
      return null
    }
  }

  const generateAndroidUserAgent = async () => {
    try {
      if (appType === "instagram") {
        return await generateAndroidInstagramUserAgent()
      }

      console.log("[v0] Generating Android Facebook user agent...")

      const device = androidDeviceModels[Math.floor(Math.random() * androidDeviceModels.length)]
      if (!device) {
        console.error("[v0] No Android device models available")
        return null
      }

      const buildNumber = androidBuildNumbers.find((b) => b.android_version === device.android_version)
      if (!buildNumber) {
        console.error(`[v0] No build number found for Android ${device.android_version}`)
        return null
      }

      const fbVersions = androidAppVersions.filter((a) => a.app_type === "facebook")
      const chromeVersions = androidAppVersions.filter((a) => a.app_type === "chrome")

      if (fbVersions.length === 0) {
        console.error("[v0] No Facebook versions available")
        return null
      }
      if (chromeVersions.length === 0) {
        console.error("[v0] No Chrome versions available")
        return null
      }

      const fbVersion = fbVersions[Math.floor(Math.random() * fbVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]
      const modelIdentifier = extractModelIdentifier(device.model_name)

      const userAgent =
        `Mozilla/5.0 (Linux; ${device.android_version}; ${modelIdentifier} Build/${buildNumber.build_number}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `[FB_IAB/FB4A;FBAV/${fbVersion.version};IABMV/${fbVersion.iabmv};]`

      console.log("[v0] Successfully generated Android Facebook user agent")
      return userAgent
    } catch (error) {
      console.error("[v0] Error generating Android user agent:", error)
      return null
    }
  }

  const generateUserAgent = async (platform, appType) => {
    if (platform === "android") {
      return await generateAndroidUserAgent()
    } else {
      try {
        console.log("[v0] Generating iOS user agent...")

        const device = getRandomElement(deviceModels)
        if (!device) {
          console.error("[v0] No iOS device models available")
          return null
        }

        const validIOSVersions = iosVersions.filter((ios) => {
          const versionCompareMin = compareVersions(ios.version, device.min_ios_version)
          const versionCompareMax = compareVersions(ios.version, device.max_ios_version)
          return versionCompareMin >= 0 && versionCompareMax <= 0
        })

        if (validIOSVersions.length === 0) {
          console.warn(`[v0] No valid iOS versions for device ${device.model_name}, retrying...`)
          return generateUserAgent()
        }

        const iosVersion = getRandomElement(validIOSVersions)
        const appVersionsForType = appVersions.filter((app) => app.app_type === appType)

        if (appVersionsForType.length === 0) {
          console.error(`[v0] No app versions available for ${appType}`)
          return null
        }

        const appVersion = getRandomElement(appVersionsForType)
        const languages = configurations.languages || ["en_US", "es_US"]
        const deviceResolutions =
          device.resolutions && device.resolutions.length > 0 ? device.resolutions : ["828x1792", "1170x2532"]
        const deviceScaling =
          device.screen_scaling && device.screen_scaling.length > 0 ? device.screen_scaling : ["2.00", "3.00"]

        const language = getRandomElement(languages)
        const scale = getRandomElement(deviceScaling)
        const resolution = getRandomElement(deviceResolutions)
        const iosVersionUA = iosVersion.version.replace(/\./g, "_")
        const modelIdentifier = extractModelIdentifier(device.model_name)

        let userAgent

        if (appType === "instagram") {
          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `Instagram ${appVersion.version} (${modelIdentifier}; iOS ${iosVersionUA}; ${language}; ${language.replace("_", "-")}; ` +
            `scale=${scale}; ${resolution}; ${appVersion.build_number})`
        } else {
          const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
          const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

          let fbrv = appVersion.fbrv
          if (fbrv) {
            fbrv = fbrv.toString()
          } else {
            fbrv = (Math.floor(Math.random() * 999999) + 700000000).toString()
          }

          const fbrv_part = extra ? "" : `;FBOP/5;FBRV/${fbrv}`
          const iabmv = Math.random() < 0.9 ? ";IABMV/1" : ""

          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `[FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${modelIdentifier};FBMD/iPhone;FBSN/iOS;` +
            `FBSV/${iosVersion.version};FBSS/${fbss};FBID/phone;FBLC/${language}${extra}${fbrv_part}${iabmv}]`
        }

        console.log("[v0] Successfully generated iOS user agent")
        return userAgent
      } catch (error) {
        console.error("[v0] Error generating iOS user agent:", error)
        return null
      }
    }
  }

  const parseIOSVersion = (version) => {
    return version.split(".").map(Number)
  }

  const compareVersions = (v1, v2) => {
    const version1 = parseIOSVersion(v1)
    const version2 = parseIOSVersion(v2)

    for (let i = 0; i < Math.max(version1.length, version2.length); i++) {
      const a = version1[i] || 0
      const b = version2[i] || 0
      if (a < b) return -1
      if (a > b) return 1
    }
    return 0
  }

  const handleDownload = async () => {
    if (!userAgents.length) return

    try {
      const content = userAgents.join("\n")
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${appType}_user_agents_${new Date().getTime()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showModal("✅ ডাউনলোড সফল!", `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড করা হয়েছে।`, "success")
    } catch (error) {
      console.error("Error downloading:", error)
      showModal("❌ ডাউনলোড ব্যর্থ!", "ডাউনলোড করতে সমস্যা হয়েছে!", "error")
    }
  }

  const handleCopyAll = async () => {
    if (!userAgents.length) return

    try {
      const content = userAgents.join("\n")
      await navigator.clipboard.writeText(content)
      setAllCopied(true)
      showModal("✅ কপি সফল!", `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে কপি করা হয়েছে।`, "success")
      setTimeout(() => setAllCopied(false), 2000)
    } catch (error) {
      console.error("Error copying:", error)
      showModal("❌ কপি ব্যর্থ!", "কপি করতে সমস্যা হয়েছে!", "error")
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleHistoryDownload = async (historyItem) => {
    if (!historyItem.generated_data?.user_agents || historyItem.generated_data.user_agents.length === 0) {
      showModal("❌ ডেটা নেই!", "এই হিস্ট্রিতে কোন ইউজার এজেন্ট নেই।", "error")
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

      showModal(
        "✅ ডাউনলোড সফল!",
        `${historyItem.generated_data.user_agents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড করা হয়েছে।`,
        "success",
      )
    } catch (error) {
      console.error("Error downloading from history:", error)
      showModal("❌ ডাউনলোড ব্যর্থ!", "ডাউনলোড করতে সমস্যা হয়েছে!", "error")
    }
  }

  const handleHistoryCopy = async (historyItem) => {
    if (!historyItem.generated_data?.user_agents || historyItem.generated_data.user_agents.length === 0) {
      showModal("❌ ডেটা নেই!", "এই হিস্ট্রিতে কোন ইউজার এজেন্ট নেই।", "error")
      return
    }

    try {
      const content = historyItem.generated_data.user_agents.join("\n")
      await navigator.clipboard.writeText(content)
      showModal(
        "✅ কপি সফল!",
        `${historyItem.generated_data.user_agents.length}টি ইউজার এজেন্ট সফলভাবে কপি করা হয়েছে।`,
        "success",
      )
    } catch (error) {
      console.error("Error copying from history:", error)
      showModal("❌ কপি ব্যর্থ!", "কপি করতে সমস্যা হয়েছে!", "error")
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      {/* Notice Section */}
      {notices.length > 0 && (
        <div className="mb-6 space-y-3">
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

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">ইউজার জেনারেটর</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">User Agent Generator</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          আপনার ব্যক্তিগত ইউজার এজেন্ট জেনারেটর এবং হিস্ট্রি ট্র্যাকার
        </p>
      </div>

      {/* Navigation Tabs */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl mb-8">
        <CardContent className="p-0">
          <div className="flex border-b border-slate-200 dark:border-slate-600">
            <button
              onClick={() => setActiveSection("generator")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                activeSection === "generator"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                জেনারেটর
              </div>
            </button>
            <button
              onClick={() => setActiveSection("history")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                activeSection === "history"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-5 h-5" />
                আমার হিস্ট্রি ({history.length})
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {activeSection === "generator" && (
        <>
          {/* Generator Controls */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                জেনারেশন সেটিংস
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    প্ল্যাটফর্ম
                  </Label>
                  <Select value={platform} onValueChange={setPlatform} disabled={isGenerating}>
                    <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                      <SelectValue placeholder="প্ল্যাটফর্ম নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ios">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📱</span>
                          iOS
                        </div>
                      </SelectItem>
                      <SelectItem value="android">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Android
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appType" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    অ্যাপ টাইপ
                  </Label>
                  <Select value={appType} onValueChange={setAppType} disabled={isGenerating}>
                    <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                      <SelectValue placeholder="অ্যাপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </div>
                      </SelectItem>
                      <SelectItem value="facebook">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    সংখ্যা
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={
                      AccessKey.getRemainingGenerations(currentUser) === "Unlimited"
                        ? 10000
                        : AccessKey.getRemainingGenerations(currentUser)
                    }
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    disabled={isGenerating}
                    className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !AccessKey.canGenerate(currentUser)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>তৈরি হচ্ছে...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>জেনারেট করুন</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {generatedUserAgents.length > 0 && (
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    জেনারেট করা ইউজার এজেন্ট ({generatedUserAgents.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyAll}
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                      {allCopied ? "কপি হয়েছে!" : "সব কপি করুন"}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4" />
                      ডাউনলোড
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {generatedUserAgents.map((ua, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1 mr-4 break-all">
                        {ua.userAgent}
                      </span>
                      <Button
                        onClick={() => copyToClipboard(ua.userAgent, index)}
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedIndex === index ? "কপি হয়েছে!" : "কপি"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeSection === "history" && (
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              আমার জেনারেশন হিস্ট্রি
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-slate-600 dark:text-slate-400">হিস্ট্রি লোড হচ্ছে...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">এখনো কোন জেনারেশন হিস্ট্রি নেই।</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
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
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
        onCancel={() => setModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <ProgressModal
        isOpen={progressModal.isOpen}
        title={progressModal.title}
        message={progressModal.message}
        progress={progressModal.progress}
        type={progressModal.type}
        showCancel={progressModal.showCancel}
        onCancel={hideProgressModal}
      />
    </div>
  )
}
