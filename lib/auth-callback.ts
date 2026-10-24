import { supabase } from "@/lib/supabase"

export interface AuthProcessResult {
  success: boolean
  user?: any
  error?: string | null
}

/**
 * Memproses token otentikasi dari URL (baik implicit flow via fragment #access_token=...
 * maupun PKCE flow via query param ?code=...).
 * Membersihkan URL setelah token berhasil diproses agar address bar kembali rapi.
 */
export async function processAuthTokensFromUrl(): Promise<AuthProcessResult> {
  if (typeof window === "undefined") {
    return { success: false }
  }

  // 1. Cek terlebih dahulu apakah sesi sudah aktif (misal sudah di-recover otomatis oleh Supabase detectSessionInUrl)
  try {
    const { data: currentData } = await supabase.auth.getSession()
    if (currentData?.session?.user) {
      if (window.location.hash.includes("access_token")) {
        const cleanUrl = window.location.pathname + (window.location.search ? window.location.search : "")
        window.history.replaceState(null, "", cleanUrl)
      }
      syncUserToStorageAndBroadcast(currentData.session.user)
      return { success: true, user: currentData.session.user }
    }
  } catch (e) {
    // Abaikan jika belum ada sesi
  }

  const hash = window.location.hash || ""
  const search = window.location.search || ""

  // 2. Cek apakah ada error pada URL (misal user membatalkan consent atau provider error)
  const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash)
  const searchParams = new URLSearchParams(search)

  const errorDesc =
    hashParams.get("error_description") ||
    searchParams.get("error_description") ||
    hashParams.get("error") ||
    searchParams.get("error")

  if (errorDesc) {
    const cleanUrl = window.location.pathname
    window.history.replaceState(null, "", cleanUrl)
    return {
      success: false,
      error: decodeURIComponent(errorDesc.replace(/\+/g, " ")),
    }
  }

  // 3. Cek Implicit Grant Flow (#access_token=...&refresh_token=...)
  const rawAccessToken = hashParams.get("access_token")
  const rawRefreshToken = hashParams.get("refresh_token")

  if (rawAccessToken && rawRefreshToken) {
    // Bersihkan token dari spasi, newline, carriage return, dan tanda kutip
    const accessToken = decodeURIComponent(rawAccessToken).trim().replace(/[\r\n"']/g, "")
    const refreshToken = decodeURIComponent(rawRefreshToken).trim().replace(/[\r\n"']/g, "")

    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        console.warn("[AuthCallback] Warning setSession:", error)
        // Fallback: cek apakah _initialize() internal Supabase sudah berhasil membuat sesi
        const { data: secondCheck } = await supabase.auth.getSession()
        if (secondCheck?.session?.user) {
          const cleanUrl = window.location.pathname + (window.location.search ? window.location.search : "")
          window.history.replaceState(null, "", cleanUrl)
          syncUserToStorageAndBroadcast(secondCheck.session.user)
          return { success: true, user: secondCheck.session.user }
        }
        return { success: false, error: error.message }
      }

      // Bersihkan hash dari URL address bar tanpa reload
      const cleanUrl = window.location.pathname + (window.location.search ? window.location.search : "")
      window.history.replaceState(null, "", cleanUrl)

      const user = data.user || data.session?.user
      if (user) {
        syncUserToStorageAndBroadcast(user)
      }

      return { success: true, user }
    } catch (err: any) {
      console.warn("[AuthCallback] Tangkap error setSession, mencoba verifikasi sesi fallback:", err)
      try {
        const { data: fallbackCheck } = await supabase.auth.getSession()
        if (fallbackCheck?.session?.user) {
          const cleanUrl = window.location.pathname + (window.location.search ? window.location.search : "")
          window.history.replaceState(null, "", cleanUrl)
          syncUserToStorageAndBroadcast(fallbackCheck.session.user)
          return { success: true, user: fallbackCheck.session.user }
        }
      } catch (e) {}

      return { success: false, error: err?.message || "Gagal memproses sesi login" }
    }
  }

  // 4. Cek PKCE Authorization Code Flow (?code=...)
  const rawCode = searchParams.get("code")
  if (rawCode) {
    const code = rawCode.trim().replace(/[\r\n"']/g, "")
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.warn("[AuthCallback] Gagal exchange code for session:", error)
        const { data: secondCheck } = await supabase.auth.getSession()
        if (secondCheck?.session?.user) {
          cleanQueryParams(searchParams)
          syncUserToStorageAndBroadcast(secondCheck.session.user)
          return { success: true, user: secondCheck.session.user }
        }
        return { success: false, error: error.message }
      }

      cleanQueryParams(searchParams)

      const user = data.user || data.session?.user
      if (user) {
        syncUserToStorageAndBroadcast(user)
      }

      return { success: true, user }
    } catch (err: any) {
      console.warn("[AuthCallback] Error saat exchange auth code, mencoba cek sesi:", err)
      try {
        const { data: fallbackCheck } = await supabase.auth.getSession()
        if (fallbackCheck?.session?.user) {
          cleanQueryParams(searchParams)
          syncUserToStorageAndBroadcast(fallbackCheck.session.user)
          return { success: true, user: fallbackCheck.session.user }
        }
      } catch (e) {}

      return { success: false, error: err?.message || "Gagal memproses kode otentikasi" }
    }
  }

  return { success: false }
}

function cleanQueryParams(searchParams: URLSearchParams) {
  searchParams.delete("code")
  searchParams.delete("state")
  searchParams.delete("sb_flow_id")
  const remainingSearch = searchParams.toString()
  const cleanUrl = window.location.pathname + (remainingSearch ? `?${remainingSearch}` : "")
  window.history.replaceState(null, "", cleanUrl)
}

/**
 * Menyimpan profil user ke localStorage dan memancarkan event agar komponen UI (TopBar, Sidebar, dsb) langsung update seketika.
 */
export function syncUserToStorageAndBroadcast(user: any) {
  if (typeof window === "undefined" || !user) return

  const userData = {
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Pengguna",
    email: user.email || "",
    avatar:
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      "",
  }

  try {
    localStorage.setItem("topbar_cached_user", JSON.stringify(userData))
  } catch (e) {}

  window.dispatchEvent(
    new CustomEvent("auth-state-changed", {
      detail: { user: userData, rawUser: user },
    })
  )
}
