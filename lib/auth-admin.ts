/**
 * Helper sentral untuk memverifikasi hak akses Admin & Staff.
 * Email admin dapat dikonfigurasi melalui environment variable `NEXT_PUBLIC_ADMIN_EMAILS`
 * di file `.env.local` (dipisahkan koma), ataupun ditambahkan langsung di DEFAULT_ADMIN_EMAILS.
 */

export const DEFAULT_ADMIN_EMAILS: string[] = [
  "indogreennature.web@gmail.com",
  "elproject.dev@gmail.com",
  "sbagiamu.pos@gmail.com",
]

export function getAdminEmails(): string[] {
  const envEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const combined = [...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...envEmails]
  return Array.from(new Set(combined))
}

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false
  const normalizedEmail = email.trim().toLowerCase()
  const adminList = getAdminEmails()

  return adminList.includes(normalizedEmail)
}
