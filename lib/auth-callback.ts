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

  const hash = window.location.hash || ""
  const search = window.location.search || ""

  // 1. Cek apakah ada error pada URL (misal user membatalkan consent atau provider error)
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

  // 2. Cek Implicit Grant Flow (#access_token=...&refresh_token=...)
  const accessToken = hashParams.get("access_token")
  const refreshToken = hashParams.get("refresh_token")

  if (accessToken && refreshToken) {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        console.error("[AuthCallback] Gagal menetapkan sesi dari token URL:", error)
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
      console.error("[AuthCallback] Error saat memproses hash token:", err)
      return { success: false, error: err?.message || "Gagal memproses sesi login" }
    }
  }

  // 3. Cek PKCE Authorization Code Flow (?code=...)
  const code = searchParams.get("code")
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[AuthCallback] Gagal exchange code for session:", error)
        return { success: false, error: error.message }
      }

      // Bersihkan code & flow params dari search query
      searchParams.delete("code")
      searchParams.delete("state")
      searchParams.delete("sb_flow_id")
      const remainingSearch = searchParams.toString()
      const cleanUrl = window.location.pathname + (remainingSearch ? `?${remainingSearch}` : "")
      window.history.replaceState(null, "", cleanUrl)

      const user = data.user || data.session?.user
      if (user) {
        syncUserToStorageAndBroadcast(user)
      }

      return { success: true, user }
    } catch (err: any) {
      console.error("[AuthCallback] Error saat exchange auth code:", err)
      return { success: false, error: err?.message || "Gagal memproses kode otentikasi" }
    }
  }

  return { success: false }
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
