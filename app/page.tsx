"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Download,
  Copy,
  Settings,
  Sparkles,
  TrendingUp,
  Loader2,
  Instagram,
  Facebook,
  Smartphone,
  Shield,
  CheckCircle,
  AlertTriangle,
  X,
  Cpu,
} from "lucide-react"
import CustomModal from "@/components/CustomModal" // Import CustomModal component

import {
  DeviceModel,
  IOSVersion,
  AppVersion,
  Configuration,
  GenerationHistory,
  BlacklistedUserAgent,
  AndroidDeviceModel,
  AndroidBuildNumber,
  AndroidAppVersion,
  InstagramDeviceModel,
  InstagramVersion,
  ChromeVersion,
  ResolutionDpi,
} from "@/lib/supabase"

// Enhanced Progress Modal Component with Clean, Solid Backgrounds
function ProgressModal({ isOpen, title, message, progress, onCancel, showCancel = false, type = "info" }) {
  const [pulseAnimation, setPulseAnimation] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Pulse animation counter
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

  const gradientMap = {
    info: "from-blue-400 via-indigo-500 to-purple-500",
    success: "from-green-400 via-emerald-500 to-teal-500",
    warning: "from-amber-400 via-orange-500 to-red-500",
    error: "from-red-400 via-rose-500 to-pink-500",
  }

  const Icon = iconMap[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Simple Dark Backdrop - No Gradients */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!showCancel ? undefined : onCancel} />

      {/* Main Modal with Completely Clean Background */}
      <div className="relative z-10 w-full max-w-lg transform transition-all duration-500 animate-in zoom-in-95">
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Simple Colored Top Border */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

          {/* Header Section - Clean White/Dark Background */}
          <div className="px-6 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Simple Icon Container */}
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

              {/* Close Button */}
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

          {/* Content Section - Clean White/Dark Background */}
          <div className="px-6 py-6 bg-white dark:bg-slate-800">
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-base">{message}</p>

            {/* Progress Section */}
            {progress !== undefined && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    প্রগ্রেস
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>

                {/* Clean Progress Bar */}
                <div className="relative">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Simple shimmer effect */}
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

                {/* Status Indicator */}
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

            {/* Simple Info Box */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>💡 টিপস: প্রতিটি ইউজার এজেন্ট ইউনিক এবং সম্পূর্ণ বৈধ হবে!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple CSS Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default function UserAgentGenerator() {
  const [platform, setPlatform] = useState("")
  const [appType, setAppType] = useState("")
  const [quantity, setQuantity] = useState(100)
  const [userAgents, setUserAgents] = useState([])
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [history, setHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
    showCancel: false,
  })

  // Progress Modal state
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

  const [activeSection, setActiveSection] = useState("generator")

  // New state variables
  const [allCopied, setAllCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const [instagramDeviceModels, setInstagramDeviceModels] = useState<any[]>([])
  const [instagramVersions, setInstagramVersions] = useState<any[]>([])
  const [chromeVersions, setChromeVersions] = useState<any[]>([])
  const [resolutionDpis, setResolutionDpis] = useState<any[]>([])

  useEffect(() => {
    loadData()
    loadHistory()
  }, [])

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

      // Create blacklist set for faster lookup
      const blacklistSet = new Set(blacklisted.map((b) => b.user_agent))
      setBlacklistedUAs(blacklistSet)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const historyData = await GenerationHistory.list()

      const userHistory = historyData
        .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
        .slice(0, 20) // Show last 20 generations

      setHistory(userHistory)
    } catch (error) {
      console.error("Error loading history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleHistoryDownload = async (historyItem) => {
    if (!historyItem.user_agents || historyItem.user_agents.length === 0) {
      showModal("❌ ডেটা নেই!", "এই হিস্ট্রিতে কোন ইউজার এজেন্ট নেই।", "error")
      return
    }

    showModal(
      "📥 হিস্ট্রি ডাউনলোড",
      `আপনি কি ${historyItem.user_agents.length}টি ইউজার এজেন্ট আবার ডাউনলোড করতে চান?`,
      "info",
      async () => {
        setModal((prev) => ({ ...prev, isOpen: false }))

        try {
          // Create download file
          const content = historyItem.user_agents.join("\n")
          const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url

          const appTypeDisplay = historyItem.app_type.replace("android_", "android-")
          const timestamp = new Date(historyItem.generated_at).toISOString().slice(0, 19).replace(/:/g, "-")
          a.download = `${appTypeDisplay}_user_agents_${timestamp}.txt`

          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          showModal(
            "✅ ডাউনলোড সফল!",
            `${historyItem.user_agents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড করা হয়েছে।`,
            "success",
          )
        } catch (error) {
          console.error("Error downloading from history:", error)
          showModal("❌ ডাউনলোড ব্যর্থ!", "ডাউনলোড করতে সমস্যা হয়েছে!", "error")
        }
      },
      true,
    )
  }

  const handleHistoryCopy = async (historyItem) => {
    if (!historyItem.user_agents || historyItem.user_agents.length === 0) {
      showModal("❌ ডেটা নেই!", "এই হিস্ট্রিতে কোন ইউজার এজেন্ট নেই।", "error")
      return
    }

    try {
      const content = historyItem.user_agents.join("\n")
      await navigator.clipboard.writeText(content)

      showModal("✅ কপি সফল!", `${historyItem.user_agents.length}টি ইউজার এজেন্ট সফলভাবে কপি করা হয়েছে।`, "success")
    } catch (error) {
      console.error("Error copying from history:", error)
      showModal("❌ কপি ব্যর্থ!", "কপি করতে সমস্যা হয়েছে!", "error")
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

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const extractModelIdentifier = (modelName) => {
    if (!modelName) return modelName
    // Extract everything before the first space and opening parenthesis
    const match = modelName.match(/^([^\s(]+)/)
    return match ? match[1] : modelName
  }

  const generateAndroidInstagramUserAgent = async () => {
    try {
      if (!instagramDeviceModels.length || !instagramVersions.length || !chromeVersions.length) {
        console.error("Missing Instagram configuration data")
        return null
      }

      // Android version mappings (keep these as they're system constants)
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

      // Parse resolutions from device (handle both array and string formats)
      const resolutions = Array.isArray(device.resolutions)
        ? device.resolutions
        : device.resolutions.split(",").map((r) => r.trim())
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)]

      // Find matching DPIs for this resolution
      const matchingDpis = resolutionDpis.filter((rd) => rd.resolution === resolution)
      const dpiOptions = matchingDpis.length > 0 ? matchingDpis[0].dpis.map((d) => `${d}dpi`) : ["420dpi"]
      const dpi = dpiOptions[Math.floor(Math.random() * dpiOptions.length)]

      const language = languages[Math.floor(Math.random() * languages.length)]

      // Select random versions from cached data
      const instagramVersion = instagramVersions[Math.floor(Math.random() * instagramVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      // Generate Instagram Android user agent
      const userAgent =
        `Mozilla/5.0 (Linux; Android ${androidVersion}; ${device.model} Build/${buildNumber}; wv) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `Instagram ${instagramVersion.version} Android (${versionPair}; ${dpi}; ${resolution}; ${device.manufacturer}; ` +
        `${device.model}; ${device.code}; ${device.chipset}; ${language}; ${instagramVersion.unique_id}; IABMV/1)`

      return userAgent
    } catch (error) {
      console.error("Error generating Instagram Android user agent:", error)
      return null
    }
  }

  const generateAndroidUserAgent = async () => {
    try {
      if (appType === "instagram") {
        return await generateAndroidInstagramUserAgent()
      }

      const device = androidDeviceModels[Math.floor(Math.random() * androidDeviceModels.length)]
      if (!device) throw new Error("No Android device models available")

      const buildNumber = androidBuildNumbers.find((b) => b.android_version === device.android_version)
      if (!buildNumber) throw new Error(`No build number found for ${device.android_version}`)

      const fbVersions = androidAppVersions.filter((a) => a.app_type === "facebook")
      const chromeVersions = androidAppVersions.filter((a) => a.app_type === "chrome")

      if (fbVersions.length === 0 || chromeVersions.length === 0) {
        throw new Error("No Facebook or Chrome versions available")
      }

      const fbVersion = fbVersions[Math.floor(Math.random() * fbVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const modelIdentifier = extractModelIdentifier(device.model_name)

      // Generate Android Facebook user agent based on Python logic
      const userAgent =
        `Mozilla/5.0 (Linux; ${device.android_version}; ${modelIdentifier} Build/${buildNumber.build_number}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `[FB_IAB/FB4A;FBAV/${fbVersion.version};IABMV/${fbVersion.iabmv};]`

      return userAgent
    } catch (error) {
      console.error("Error generating Android user agent:", error)
      return null
    }
  }

  const generateUserAgent = async () => {
    if (platform === "android") {
      return await generateAndroidUserAgent()
    } else {
      // Existing iOS generation logic
      try {
        const device = getRandomElement(deviceModels)
        if (!device) throw new Error("No device models available")

        const validIOSVersions = iosVersions.filter((ios) => {
          const versionCompareMin = compareVersions(ios.version, device.min_ios_version)
          const versionCompareMax = compareVersions(ios.version, device.max_ios_version)
          return versionCompareMin >= 0 && versionCompareMax <= 0
        })

        if (validIOSVersions.length === 0) {
          return generateUserAgent()
        }

        const iosVersion = getRandomElement(validIOSVersions)
        const appVersionsForType = appVersions.filter((app) => app.app_type === appType)

        if (appVersionsForType.length === 0) {
          throw new Error(`No app versions available for ${appType}`)
        }

        const appVersion = getRandomElement(appVersionsForType)

        // Get device-specific resolutions and screen scaling
        const languages = configurations.languages || ["en_US", "es_US"]
        const deviceResolutions =
          device.resolutions && device.resolutions.length > 0 ? device.resolutions : ["828x1792", "1170x2532"] // fallback
        const deviceScaling =
          device.screen_scaling && device.screen_scaling.length > 0 ? device.screen_scaling : ["2.00", "3.00"] // fallback

        const language = getRandomElement(languages)
        const scale = getRandomElement(deviceScaling)
        const resolution = getRandomElement(deviceResolutions)
        const iosVersionUA = iosVersion.version.replace(/\./g, "_")

        let userAgent

        const modelIdentifier = extractModelIdentifier(device.model_name)

        if (appType === "instagram") {
          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `Instagram ${appVersion.version} (${modelIdentifier}; iOS ${iosVersionUA}; ${language}; ${language.replace("_", "-")}; ` +
            `scale=${scale}; ${resolution}; ${appVersion.build_number})`
        } else {
          const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
          const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

          // Fixed FBRV handling
          let fbrv = appVersion.fbrv
          if (fbrv) {
            // Use the exact FBRV from database
            fbrv = fbrv.toString()
          } else {
            // Generate random FBRV if not provided
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

        return userAgent
      } catch (error) {
        console.error("Error generating user agent:", error)
        return null
      }
    }
  }

  const handleGenerate = async () => {
    if (!platform) {
      showModal("⚠️ প্ল্যাটফর্ম নির্বাচন করুন!", "অনুগ্রহ করে একটি প্ল্যাটফর্ম নির্বাচন করুন।", "warning")
      return
    }

    if (!appType) {
      showModal("⚠️ অ্যাপ টাইপ নির্বাচন করুন!", "অনুগ্রহ করে একটি অ্যাপ টাইপ নির্বাচন করুন।", "warning")
      return
    }

    if (quantity < 1 || quantity > 10000) {
      showModal("⚠️ সংখ্যা সীমা!", "অনুগ্রহ করে ১ থেকে ১০,০০০ এর মধ্যে সংখ্যা দিন।", "warning")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setUserAgents([])

    showProgressModal("🚀 ইউজার এজেন্ট তৈরি হচ্ছে", "আপনার ইউনিক ইউজার এজেন্ট তৈরি করা হচ্ছে...", 0)

    try {
      const newUserAgents = []
      const batchSize = Math.min(50, quantity)
      const totalBatches = Math.ceil(quantity / batchSize)

      for (let batch = 0; batch < totalBatches; batch++) {
        const batchStart = batch * batchSize
        const batchEnd = Math.min(batchStart + batchSize, quantity)
        const currentBatchSize = batchEnd - batchStart

        const batchPromises = []
        for (let i = 0; i < currentBatchSize; i++) {
          batchPromises.push(generateUserAgent())
        }

        const batchResults = await Promise.all(batchPromises)
        const validResults = batchResults.filter((ua) => ua && !blacklistedUAs.has(ua))

        newUserAgents.push(...validResults)

        const progress = Math.round(((batch + 1) / totalBatches) * 100)
        setGenerationProgress(progress)
        setProgressModal((prev) => ({
          ...prev,
          progress,
          message: `✨ ${newUserAgents.length}/${quantity} ইউজার এজেন্ট তৈরি হয়েছে...`,
        }))

        if (batch < totalBatches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50)) // Reduced from 100ms to 50ms
        }
      }

      setUserAgents(newUserAgents)

      const finalAppType = platform === "android" ? `android_${appType}` : appType

      // Save to history (not downloaded yet)
      const historyEntry = await GenerationHistory.create({
        app_type: finalAppType,
        quantity: newUserAgents.length,
        user_agents: newUserAgents,
        is_downloaded: false,
        generated_at: new Date().toISOString(),
        created_by: "anonymous@example.com", // Default email since no authentication
      })

      setCurrentHistoryId(historyEntry.id)

      // Check if we got the requested quantity
      if (newUserAgents.length < quantity) {
        hideProgressModal()
        // Show warning modal for incomplete generation
        showModal(
          "⚠️ জেনারেশন আংশিক সম্পন্ন!",
          `অনুরোধ: ${quantity}টি ইউজার এজেন্ট\n` +
            `জেনারেট হয়েছে: ${newUserAgents.length}টি\n` +
            `কারণ: ডুপ্লিকেট এবং ব্ল্যাকলিস্ট এড়ানোর জন্য\n\n` +
            `আপনি কি ${newUserAgents.length}টি ইউজার এজেন্ট নিতে চান?`,
          "warning",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      } else {
        hideProgressModal()
        // Show success modal for complete generation
        showModal(
          "🎉 জেনারেশন সম্পন্ন!",
          `সফলভাবে ${newUserAgents.length}টি ইউনিক ইউজার এজেন্ট তৈরি করা হয়েছে।`,
          "success",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      }
    } catch (error) {
      console.error("Error generating user agents:", error)
      hideProgressModal()
      showModal("❌ জেনারেশন ব্যর্থ!", "ইউজার এজেন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error")
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const processAndBlacklistUAs = async () => {
    if (!userAgents.length || !currentHistoryId) return false

    try {
      console.log(`Adding ${userAgents.length} user agents to blacklist...`)

      // Show processing progress
      showProgressModal("⚙️ প্রসেসিং চলছে", "ইউজার এজেন্টগুলো ব্ল্যাকলিস্ট করা হচ্ছে...", 0, "info", false)

      const finalAppType = platform === "android" ? `android_${appType}` : appType

      // Add all user agents to blacklist with progress tracking
      const blacklistPromises = userAgents.map(async (ua, index) => {
        try {
          const hash = btoa(ua)
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 32)

          const result = await BlacklistedUserAgent.create({
            user_agent: ua,
            hash,
            downloaded_by: "anonymous@example.com", // Default email since no authentication
            app_type: finalAppType,
          })

          // Update progress
          const progress = Math.round(((index + 1) / userAgents.length) * 100)
          setProgressModal((prev) => ({
            ...prev,
            progress,
            message: `🔒 ${index + 1}/${userAgents.length} ইউজার এজেন্ট প্রসেস করা হয়েছে...`,
          }))

          return result
        } catch (error) {
          console.error(`Error blacklisting UA ${index + 1}:`, error)
          throw error
        }
      })

      await Promise.all(blacklistPromises)
      console.log(`Successfully blacklisted ${userAgents.length} user agents`)

      // Update history as downloaded
      await GenerationHistory.update(currentHistoryId, { is_downloaded: true })

      // Refresh blacklist state
      await loadData()

      hideProgressModal()
      return true
    } catch (error) {
      console.error("Error during blacklisting process:", error)
      hideProgressModal()
      return false
    }
  }

  const handleDownload = async () => {
    if (!userAgents.length || !currentHistoryId) return

    showModal(
      "📥 ডাউনলোড নিশ্চিতকরণ",
      `আপনি কি ${userAgents.length}টি ইউজার এজেন্ট ডাউনলোড করতে চান? এগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে।`,
      "warning",
      async () => {
        setModal((prev) => ({ ...prev, isOpen: false }))

        try {
          const success = await processAndBlacklistUAs()
          if (!success) {
            showModal("❌ ব্ল্যাকলিস্ট ব্যর্থ!", "ব্ল্যাকলিস্ট করতে সমস্যা হয়েছে!", "error")
            return
          }

          // Download file
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

          // Show success message
          showModal(
            "✅ ডাউনলোড সফল!",
            `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড এবং ব্ল্যাকলিস্ট করা হয়েছে।`,
            "success",
          )

          // Clear current results and reload history
          setUserAgents([])
          setCurrentHistoryId(null)
          loadHistory()
        } catch (error) {
          console.error("Error creating download file:", error)
          showModal("❌ ডাউনলোড ব্যর্থ!", "ডাউনলোড করতে সমস্যা হয়েছে!", "error")
        }
      },
      true,
    )
  }

  const handleCopyAll = async () => {
    if (!userAgents.length || !currentHistoryId) return

    showModal(
      "📋 কপি নিশ্চিতকরণ",
      `আপনি কি ${userAgents.length}টি ইউজার এজেন্ট কপি করতে চান? এগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে।`,
      "warning",
      async () => {
        setModal((prev) => ({ ...prev, isOpen: false }))

        try {
          setAllCopied(true)

          const success = await processAndBlacklistUAs()
          if (!success) {
            showModal("❌ ব্ল্যাকলিস্ট ব্যর্থ!", "ব্ল্যাকলিস্ট করতে সমস্যা হয়েছে!", "error")
            setAllCopied(false)
            return
          }

          // Copy to clipboard
          const content = userAgents.join("\n")
          await navigator.clipboard.writeText(content)

          // Show success message
          showModal("✅ কপি সফল!", `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে কপি এবং ব্ল্যাকলিস্ট করা হয়েছে।`, "success")

          // Clear current results and reload history
          setUserAgents([])
          setCurrentHistoryId(null)
          loadHistory()

          setTimeout(() => setAllCopied(false), 2000)
        } catch (error) {
          console.error("Error copying to clipboard:", error)
          showModal("❌ কপি ব্যর্থ!", "কপি করতে সমস্যা হয়েছে!", "error")
          setAllCopied(false)
        }
      },
      true,
    )
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">প্রফেশনাল গ্রেড</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">User agent generator</h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          হাজার হাজার ইউনিক, iOS এবং Android ইউজার এজেন্ট তৈরি করুন Instagram এবং Facebook এর জন্য
        </p>
      </div>

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
                <TrendingUp className="w-5 h-5" />
                হিস্ট্রি ({history.length})
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {activeSection === "generator" && (
        <>
          {/* Generator Controls */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
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
                      {platform === "android" && (
                        <>
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
                        </>
                      )}
                      {platform === "ios" && (
                        <>
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
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    পরিমাণ
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10000"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    placeholder="পরিমাণ লিখুন (১-১০,০০০)"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !platform || !appType}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 shadow-lg h-12 text-base font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {quantity} টি ইউজার এজেন্ট তৈরি করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {quantity} টি {platform === "android" ? "Android" : "iOS"} ইউজার এজেন্ট তৈরি করুন
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {userAgents.length > 0 && (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    তৈরিকৃত ইউজার এজেন্ট ({userAgents.length} টি)
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleCopyAll}
                      variant="outline"
                      className="shadow-md bg-transparent dark:bg-slate-700 dark:border-slate-600"
                      disabled={isGenerating}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      সবগুলো কপি
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 shadow-lg"
                      disabled={isGenerating}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      সবগুলো ডাউনলোড
                    </Button>
                  </div>
                </div>

                {/* Blacklist Warning */}
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      ⚠️ গুরুত্বপূর্ণ: কপি বা ডাউনলোড করলে এই ইউজার এজেন্টগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে এবং পরবর্তীতে আর জেনারেট হবে
                      না।
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {userAgents.slice(0, 10).map((ua, index) => (
                  <div
                    key={index}
                    className="group relative p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed break-all">
                          {ua}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(ua, index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-600"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {userAgents.length > 10 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      এবং আরও {userAgents.length - 10} টি... সবগুলো দেখতে ডাউনলোড করুন
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeSection === "history" && (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              জেনারেশন হিস্ট্রি ({history.length} টি)
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-slate-600 dark:text-slate-300">হিস্ট্রি লোড হচ্ছে...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  এখনো কোন হিস্ট্রি নেই। প্রথমে কিছু ইউজার এজেন্ট জেনারেট করুন।
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {item.app_type.includes("android") ? (
                            <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <span className="text-lg">📱</span>
                          )}
                          <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                            {item.app_type.replace("android_", "Android ").replace("_", " ")}
                          </span>
                          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                            {item.quantity} টি
                          </span>
                          {item.is_downloaded && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                              ডাউনলোড হয়েছে
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(item.generated_at).toLocaleString("bn-BD", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleHistoryCopy(item)}
                          className="hover:bg-slate-100 dark:hover:bg-slate-600"
                          title="কপি করুন"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleHistoryDownload(item)}
                          className="hover:bg-slate-100 dark:hover:bg-slate-600"
                          title="ডাউনলোড করুন"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Progress Modal */}
      <ProgressModal
        isOpen={progressModal.isOpen}
        title={progressModal.title}
        message={progressModal.message}
        progress={progressModal.progress}
        type={progressModal.type}
        showCancel={progressModal.showCancel}
        onCancel={() => hideProgressModal()}
      />

      {/* Custom Modal */}
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
      />
    </div>
  )
}
