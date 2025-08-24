import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Only create client if both URL and key are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : null

export const isSupabaseAvailable = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey
}

// Database entity classes
export class BaseEntity {
  static tableName = ""

  static async list(orderBy = "id") {
    if (!isSupabaseAvailable()) {
      console.warn(`Supabase not available for ${this.tableName}`)
      return []
    }

    console.log(`Fetching data from ${this.tableName}...`)

    const { data, error } = await supabase!
      .from(this.tableName)
      .select("*")
      .order(orderBy.startsWith("-") ? orderBy.slice(1) : orderBy, {
        ascending: !orderBy.startsWith("-"),
      })

    console.log(`${this.tableName} data:`, data)
    console.log(`${this.tableName} error:`, error)

    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error)
      throw error
    }
    return data || []
  }

  static async create(data: any) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log(`Creating ${this.tableName}:`, data)

    const { data: result, error } = await supabase!.from(this.tableName).insert(data).select().single()

    console.log(`${this.tableName} create result:`, result)
    console.log(`${this.tableName} create error:`, error)

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      throw error
    }
    return result
  }

  static async update(id: string, data: any) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log(`Updating ${this.tableName} ${id}:`, data)

    const { data: result, error } = await supabase!.from(this.tableName).update(data).eq("id", id).select().single()

    console.log(`${this.tableName} update result:`, result)
    console.log(`${this.tableName} update error:`, error)

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error)
      throw error
    }
    return result
  }

  static async delete(id: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log(`Deleting ${this.tableName} ${id}`)

    const { error } = await supabase!.from(this.tableName).delete().eq("id", id)

    console.log(`${this.tableName} delete error:`, error)

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error)
      throw error
    }
    return true
  }

  static async filter(filters: any, orderBy = "id") {
    if (!isSupabaseAvailable()) {
      console.warn(`Supabase not available for ${this.tableName}`)
      return []
    }

    console.log(`Filtering ${this.tableName}:`, filters)

    let query = supabase!.from(this.tableName).select("*")

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    const { data, error } = await query.order(orderBy.startsWith("-") ? orderBy.slice(1) : orderBy, {
      ascending: !orderBy.startsWith("-"),
    })

    console.log(`${this.tableName} filter result:`, data)
    console.log(`${this.tableName} filter error:`, error)

    if (error) {
      console.error(`Error filtering ${this.tableName}:`, error)
      throw error
    }
    return data || []
  }
}

export class DeviceModel extends BaseEntity {
  static tableName = "device_models"

  static async list(orderBy = "-created_date") {
    return super.list(orderBy)
  }

  static async filter(filters: any, orderBy = "-created_date") {
    return super.filter(filters, orderBy)
  }
}

export class IOSVersion extends BaseEntity {
  static tableName = "ios_versions"
}

export class AppVersion extends BaseEntity {
  static tableName = "app_versions"
}

export class Configuration extends BaseEntity {
  static tableName = "configurations"
}

export class GenerationHistory extends BaseEntity {
  static tableName = "generation_history"
}

export class BlacklistedUserAgent extends BaseEntity {
  static tableName = "blacklisted_user_agents"
}

export class AndroidDeviceModel extends BaseEntity {
  static tableName = "android_device_models"
}

export class AndroidBuildNumber extends BaseEntity {
  static tableName = "android_build_numbers"
}

export class AndroidAppVersion extends BaseEntity {
  static tableName = "android_app_versions"
}

// Instagram-specific database entity classes
export class InstagramDeviceModel extends BaseEntity {
  static tableName = "instagram_device_models"
}

export class InstagramVersion extends BaseEntity {
  static tableName = "instagram_versions"
}

export class ChromeVersion extends BaseEntity {
  static tableName = "chrome_versions"
}

export class ResolutionDpi extends BaseEntity {
  static tableName = "resolution_dpis"
}

export class User extends BaseEntity {
  static tableName = "users"

  static async me() {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      throw new Error("Not authenticated")
    }

    // Check localStorage
    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem("current_user")
      }
    }
    throw new Error("Not authenticated")
  }

  static async loginWithEmail(email: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    try {
      console.log("Attempting admin login with email:", email)

      // First check if user exists
      const { data: existingUser, error: selectError } = await supabase!
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      console.log("Existing user:", existingUser)
      console.log("Select error:", selectError)

      if (existingUser) {
        // User exists, store in localStorage (only on client side)
        if (typeof window !== "undefined") {
          localStorage.setItem("current_user", JSON.stringify(existingUser))
        }
        return existingUser
      }

      // User doesn't exist, create new admin user
      if (selectError && selectError.code === "PGRST116") {
        const newUserData = {
          email: email,
          is_approved: true, // All users are admin and approved
        }

        console.log("Creating new admin user:", newUserData)

        const { data: newUser, error: insertError } = await supabase!
          .from("users")
          .insert(newUserData)
          .select()
          .single()

        console.log("New admin user created:", newUser)
        console.log("Insert error:", insertError)

        if (insertError) {
          console.error("Insert error:", insertError)
          throw new Error(`Failed to create user: ${insertError.message}`)
        }

        // Store new user in localStorage (only on client side)
        if (typeof window !== "undefined") {
          localStorage.setItem("current_user", JSON.stringify(newUser))
        }
        return newUser
      }

      throw selectError
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  static async login() {
    if (typeof window === "undefined") return

    const email = prompt("Enter your email for testing:")
    if (email && email.trim()) {
      try {
        const user = await this.loginWithEmail(email.trim())
        alert(`Login successful! Welcome ${user.email}`)
        window.location.reload()
      } catch (error) {
        console.error("Login failed:", error)
        alert("Login failed: " + error.message)
      }
    }
  }

  static async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("current_user")
      window.location.reload()
    }
  }

  // Check if user is logged in
  static async getCurrentUser() {
    if (typeof window === "undefined") {
      return null
    }

    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem("current_user")
      }
    }
    return null
  }
}

// Helper function to get a random element from an array
function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Example usage of the updated generateUserAgent function
async function generateUserAgent() {
  const deviceScaling = ["1.00", "2.00", "3.00"]
  const iosVersionUA = "15.0"
  const iosVersion = {
    webkit_version: "605.1.15",
    build_number: "19A5365",
    version: "15.0",
  }
  const appVersion = {
    version: "324.0",
    build_number: "123456789",
    fbrv: null, // This should be fetched from the database
  }
  const device = {
    model_name: "iPhone 12",
  }
  const language = "en_US"

  let userAgent = ""

  if (Math.random() < 0.5) {
    userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} [FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${device.model_name};FBMD/iPhone;FBSN/iOS;FBSV/${iosVersion.version};FBSS/2;FBID/phone;FBLC/${language}]`
  } else {
    const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
    const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

    // Use FBRV from database or generate random
    let fbrv = appVersion.fbrv
    if (!fbrv) {
      // Fallback to random generation if no FBRV in database
      fbrv = Math.floor(Math.random() * 999999) + 700000000
    } else {
      // Handle partial FBRV completion
      const fbrvStr = fbrv.toString()
      if (fbrvStr.length < 9) {
        // Complete partial FBRV with random numbers
        const remainingDigits = 9 - fbrvStr.length
        const randomPart = Math.floor(Math.random() * Math.pow(10, remainingDigits))
          .toString()
          .padStart(remainingDigits, "0")
        fbrv = fbrvStr + randomPart
      }
    }

    const fbrv_part = extra ? "" : `;FBOP/5;FBRV/${fbrv}`
    const iabmv = Math.random() < 0.9 ? ";IABMV/1" : ""

    userAgent =
      `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
      `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
      `[FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${device.model_name};FBMD/iPhone;FBSN/iOS;` +
      `FBSV/${iosVersion.version};FBSS/${fbss};FBID/phone;FBLC/${language}${extra}${fbrv_part}${iabmv}]`
  }

  console.log("Generated User Agent:", userAgent)
  return userAgent
}

// AccessKey entity class for authentication system
export class AccessKey extends BaseEntity {
  static tableName = "access_keys"

  static async authenticate(accessKey: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log("Authenticating with key:", accessKey)

    const { data: user, error } = await supabase!
      .from(this.tableName)
      .select("*")
      .eq("access_key", accessKey)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      console.error("Authentication failed:", error)
      throw new Error("Invalid access key")
    }

    if (user.expires_at && new Date(user.expires_at) < new Date()) {
      throw new Error("Access key has expired")
    }

    // Update last login
    await this.update(user.id, { last_login: new Date().toISOString() })

    console.log("Authentication successful:", user)
    return user
  }

  // Get current authenticated user from localStorage
  static getCurrentUser() {
    if (typeof window === "undefined") return null

    const storedUser = localStorage.getItem("authenticated_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        return user
      } catch (e) {
        localStorage.removeItem("authenticated_user")
      }
    }
    return null
  }

  static async validateCurrentUser() {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return null

    try {
      // Re-authenticate with database to get fresh data
      const validatedUser = await this.authenticate(currentUser.access_key)
      this.setCurrentUser(validatedUser)
      return validatedUser
    } catch (error) {
      // Key is invalid, deleted, or expired
      this.logout()
      return null
    }
  }

  // Store authenticated user
  static setCurrentUser(user: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authenticated_user", JSON.stringify(user))
    }
  }

  // Logout user
  static logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authenticated_user")
      window.location.href = "/login"
    }
  }

  static isAdmin(user?: any) {
    const currentUser = user || this.getCurrentUser()
    return currentUser && currentUser.user_role === "admin"
  }

  static isUser(user?: any) {
    const currentUser = user || this.getCurrentUser()
    return currentUser && currentUser.user_role === "user"
  }

  static canGenerate(user?: any) {
    const currentUser = user || this.getCurrentUser()
    if (!currentUser) return false

    // Admin has unlimited generations
    if (currentUser.user_role === "admin") return true

    // Check user limits
    return (currentUser.used_generations || 0) < (currentUser.generation_limit || 0)
  }

  static getRemainingGenerations(user?: any) {
    const currentUser = user || this.getCurrentUser()
    if (!currentUser) return 0

    // Admin has unlimited
    if (currentUser.user_role === "admin") return "Unlimited"

    const remaining = (currentUser.generation_limit || 0) - (currentUser.used_generations || 0)
    return Math.max(0, remaining)
  }

  // Get remaining days for user
  static getRemainingDays(user?: any) {
    const currentUser = user || this.getCurrentUser()
    if (!currentUser?.expires_at) return "Unlimited"

    const expiryDate = new Date(currentUser.expires_at)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return "Expired"
    return `${diffDays} days`
  }

  static async incrementGeneration(accessKey: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    // First get current count, then increment it
    const { data: currentUser, error: fetchError } = await supabase!
      .from(this.tableName)
      .select("used_generations")
      .eq("access_key", accessKey)
      .single()

    if (fetchError) {
      console.error("Error fetching current generation count:", fetchError)
      throw fetchError
    }

    const newCount = (currentUser.used_generations || 0) + 1

    const { data, error } = await supabase!
      .from(this.tableName)
      .update({
        used_generations: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq("access_key", accessKey)
      .select()
      .single()

    if (error) {
      console.error("Error incrementing generation count:", error)
      throw error
    }

    // Update localStorage with new count
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("authenticated_user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          user.used_generations = data.used_generations
          localStorage.setItem("authenticated_user", JSON.stringify(user))
        } catch (e) {
          console.error("Error updating localStorage:", e)
        }
      }
    }

    return data
  }
}

export class UserGeneration extends BaseEntity {
  static tableName = "user_generations"

  static async createGeneration(accessKey: string, userName: string, generatedData: any, platform: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    const generationData = {
      access_key: accessKey,
      user_name: userName,
      generated_data: generatedData,
      platform: platform,
      created_at: new Date().toISOString(),
    }

    return await this.create(generationData)
  }

  static async getUserHistory(accessKey: string, limit = 50) {
    if (!isSupabaseAvailable()) {
      return []
    }

    const { data, error } = await supabase!
      .from(this.tableName)
      .select("*")
      .eq("access_key", accessKey)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching user history:", error)
      return []
    }

    return data || []
  }
}

export class AdminNotice extends BaseEntity {
  static tableName = "admin_notices"

  static async getActiveNotices(targetUser?: string) {
    if (!isSupabaseAvailable()) {
      return []
    }

    let query = supabase!.from(this.tableName).select("*").eq("is_active", true)

    // Get notices for specific user or global notices
    if (targetUser) {
      query = query.or(`target_user.eq.${targetUser},target_user.is.null`)
    } else {
      query = query.is("target_user", null)
    }

    // Filter out expired notices
    query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notices:", error)
      return []
    }

    return data || []
  }

  static async createNotice(title: string, message: string, targetUser?: string, expiresAt?: string) {
    const noticeData = {
      title,
      message,
      target_user: targetUser || null,
      expires_at: expiresAt || null,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    return await this.create(noticeData)
  }
}
