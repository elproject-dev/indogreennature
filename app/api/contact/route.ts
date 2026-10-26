import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

const SUBJECT_LABELS: Record<string, string> = {
  umum: "Pertanyaan Umum",
  kemitraan: "Permintaan Kemitraan",
  maklon: "Permintaan Maklon / OEM",
  produk: "Informasi Produk",
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body.name || "").trim().slice(0, 200)
    const company = String(body.company || "").trim().slice(0, 200)
    const phone = String(body.phone || "").trim().slice(0, 50)
    const email = String(body.email || "").trim().slice(0, 200)
    const subject = String(body.subject || "umum")
    const message = String(body.message || "").trim().slice(0, 5000)
    const to = String(body.to || "").trim()

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 })
    }

    const {
      RESEND_API_KEY,
      RESEND_FROM,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_RECEIVER_EMAIL,
    } = process.env

    // Penerima dikunci di server agar tidak bisa diarahkan ke alamat sembarang
    const receiver = CONTACT_RECEIVER_EMAIL || "admin@indogreennature.com"
    const label = SUBJECT_LABELS[subject] || "Kontak"
    const mailSubject = `[${label}] Pesan dari ${name}${company ? ` (${company})` : ""}`
    const text = `Nama: ${name}\nPerusahaan: ${company || "-"}\nTelepon: ${phone || "-"}\nEmail: ${email}\nTopik: ${label}\n\nPesan:\n${message}`
    const html = `<h3>${esc(label)}</h3>
<p><b>Nama:</b> ${esc(name)}<br><b>Perusahaan:</b> ${esc(company || "-")}<br><b>Telepon:</b> ${esc(phone || "-")}<br><b>Email:</b> ${esc(email)}</p>
<p style="white-space:pre-line">${esc(message)}</p>`

    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM || "Website Indo Green Nature <onboarding@resend.dev>",
          to: [receiver],
          reply_to: email,
          subject: mailSubject,
          text,
          html,
        }),
      })
      if (!res.ok) {
        console.error("Resend error:", await res.text())
        return NextResponse.json({ error: "Gagal mengirim email" }, { status: 500 })
      }
      return NextResponse.json({ ok: true })
    }

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json(
        { error: "Pengiriman email belum dikonfigurasi di server" },
        { status: 500 }
      )
    }

    const port = Number(SMTP_PORT || 465)
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from: `"${name.replace(/"/g, "")} - Indo Green Nature" <${SMTP_USER}>`,
      to: receiver,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: mailSubject,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact email error:", err)
    return NextResponse.json({ error: "Gagal mengirim email" }, { status: 500 })
  }
}
