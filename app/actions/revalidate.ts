"use server"

import { revalidatePath } from "next/cache"

/**
 * Server action untuk revalidasi cache Next.js secara instan (On-Demand ISR).
 * Dipanggil saat artikel baru ditambahkan, diedit, atau dihapus.
 */
export async function revalidateInsightContent(slug?: string) {
  try {
    // 1. Revalidasi halaman daftar insight
    revalidatePath("/insight")
    revalidatePath("/(dashboard)/insight", "page")

    // 2. Revalidasi artikel spesifik jika slug disertakan
    if (slug) {
      revalidatePath(`/insight/${slug}`)
      revalidatePath(`/(dashboard)/insight/${slug}`, "page")
    }

    // 3. Revalidasi sitemap.xml
    revalidatePath("/sitemap.xml")

    return { success: true }
  } catch (err: any) {
    console.error("Gagal melakukan revalidate on-demand:", err)
    return { success: false, error: err?.message }
  }
}
