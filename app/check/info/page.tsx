"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Zap, Globe, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckerInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/check">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              চেকার পেজে ফিরে যান
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">ইউজার এজেন্ট চেকার গাইড</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            চেকার কীভাবে কাজ করে এবং প্রতিটি বিশ্লেষণের অর্থ কী তা জানুন
          </p>
        </div>

        {/* How Checker Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              চেকার কীভাবে কাজ করে
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">১. ইউজার এজেন্ট পার্সিং</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  আপনার ইউজার এজেন্ট স্ট্রিং বিশ্লেষণ করে ব্রাউজার, OS, ডিভাইস, ভার্সন এবং অন্যান্য তথ্য বের করে।
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">২. নিরাপত্তা বিশ্লেষণ</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Bot সনাক্তকরণ, সন্দেহজনক প্যাটার্ন এবং নিরাপত্তা ঝুঁকি মূল্যায়ন করে।
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">৩. সামঞ্জস্য পরীক্ষা</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ব্রাউজার সাপোর্ট, পুরাতন ভার্সন এবং নিরাপত্তা আপডেট স্ট্যাটাস চেক করে।
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">৪. প্রাইভেসি মূল্যায়ন</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ফিঙ্গারপ্রিন্টিং প্রতিরোধ এবং ট্র্যাকিং ঝুঁকি বিশ্লেষণ করে।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              নিরাপত্তা বিশ্লেষণ
            </CardTitle>
            <CardDescription>আপনার ইউজার এজেন্টের নিরাপত্তা ঝুঁকি মূল্যায়ন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">Bot সনাক্তকরণ: ❌</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>কী হয়:</strong> আপনার ইউজার এজেন্ট Bot/Crawler হিসেবে চিহ্নিত হয়েছে
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>সমস্যা:</strong> অনেক ওয়েবসাইট Bot ট্রাফিক ব্লক করে, CAPTCHA দেখায় বা সীমিত অ্যাক্সেস দেয়
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">Bot সনাক্তকরণ: ✅</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>ভালো:</strong> স্বাভাবিক ব্রাউজার হিসেবে চিহ্নিত, সব ওয়েবসাইটে সহজ অ্যাক্সেস
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">সন্দেহজনক প্যাটার্ন: ❌</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>কী হয়:</strong> অস্বাভাবিক ক্যারেক্টার, অতিরিক্ত লম্বা বা ছোট স্ট্রিং
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>সমস্যা:</strong> নিরাপত্তা সিস্টেম দ্বারা ব্লক হওয়ার সম্ভাবনা বেশি
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">ঝুঁকির মাত্রা</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      কম
                    </Badge>
                    <span className="text-sm">নিরাপদ ব্যবহার</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      মাঝারি
                    </Badge>
                    <span className="text-sm">সতর্কতার সাথে ব্যবহার করুন</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      উচ্চ
                    </Badge>
                    <span className="text-sm">ব্যবহার এড়িয়ে চলুন</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              প্রাইভেসি বিশ্লেষণ
            </CardTitle>
            <CardDescription>ট্র্যাকিং এবং ফিঙ্গারপ্রিন্টিং ঝুঁকি মূল্যায়ন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">উচ্চ ট্র্যাকিং ঝুঁকি: ❌</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>কী হয়:</strong> অনেক বেশি ডিভাইস তথ্য প্রকাশ করে
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>সমস্যা:</strong> আপনাকে সহজেই ট্র্যাক এবং চিহ্নিত করা যায়, প্রাইভেসি হানি
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">কম ট্র্যাকিং ঝুঁকি: ✅</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>ভালো:</strong> সীমিত তথ্য প্রকাশ, ভালো প্রাইভেসি সুরক্ষা
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">WebView সনাক্তকরণ: ❌</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>কী হয়:</strong> অ্যাপের মধ্যে ব্রাউজার ব্যবহার করছেন
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>সমস্যা:</strong> সীমিত নিরাপত্তা ফিচার, কম প্রাইভেসি নিয়ন্ত্রণ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              সামঞ্জস্য বিশ্লেষণ
            </CardTitle>
            <CardDescription>ব্রাউজার সাপোর্ট এবং আপডেট স্ট্যাটাস</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">পুরাতন ব্রাউজার: ❌</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>কী হয়:</strong> আপনার ব্রাউজার ভার্সন পুরাতন
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>সমস্যা:</strong> নিরাপত্তা দুর্বলতা, আধুনিক ওয়েবসাইট সঠিকভাবে কাজ নাও করতে পারে
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">আধুনিক ব্রাউজার: ✅</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>ভালো:</strong> সর্বশেষ নিরাপত্তা আপডেট, সব ওয়েবসাইট সঠিকভাবে কাজ করবে
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold">অতিরিক্ত বড় সাইজ: ❌</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>কী হয়:</strong> ইউজার এজেন্ট স্ট্রিং অনেক লম্বা
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>সমস্যা:</strong> ধীর লোডিং, সার্ভার লগে বেশি জায়গা নেয়, কিছু সিস্টেম রিজেক্ট করতে পারে
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>সুপারিশসমূহ</CardTitle>
            <CardDescription>আপনার ইউজার এজেন্ট উন্নত করার জন্য পরামর্শ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">নিয়মিত ব্রাউজার আপডেট করুন</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">নিরাপত্তা এবং সামঞ্জস্যের জন্য</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">প্রাইভেসি-ফোকাসড ব্রাউজার ব্যবহার করুন</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Firefox, Brave বা Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">অ্যাড-ব্লকার এবং প্রাইভেসি এক্সটেনশন ব্যবহার করুন</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">uBlock Origin, Privacy Badger</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">সন্দেহজনক ইউজার এজেন্ট এড়িয়ে চলুন</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">বিশেষ করে Bot-এর মতো দেখতে</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
