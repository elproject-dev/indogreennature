"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import {
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  InfoIcon,
  LightbulbIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  QuoteIcon,
  Maximize2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface InsightViewerProps {
  content: string
  className?: string
}

function CodeBlock({
  lang,
  codeString,
}: {
  lang: string
  codeString: string
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString)
    setCopied(true)
    toast.success("Kode / teks berhasil disalin!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-5 overflow-hidden rounded-[5px] border border-[#15803d]/30 bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs">
        <span className="font-mono uppercase tracking-wider text-green-400 font-semibold">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-green-400" />
              <span className="text-green-400">Tersalin</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-zinc-200">
        <code>{codeString}</code>
      </pre>
    </div>
  )
}

function LightboxImage({
  src,
  alt,
  className,
}: {
  src: string
  alt?: string
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <div className="group relative overflow-hidden rounded-[5px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <img
          src={src}
          alt={alt || ""}
          className={cn("w-full transition-transform duration-500 group-hover:scale-[1.02]", className)}
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Perbesar gambar"
          aria-label="Perbesar gambar"
          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-[5px] bg-black/60 px-2.5 py-1 text-xs text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-black/80"
        >
          <Maximize2Icon className="size-3.5" />
          <span>Zoom</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-[92vw] overflow-hidden rounded-[5px] bg-zinc-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-[5px] bg-black/70 p-2 text-white hover:bg-black transition-colors"
              aria-label="Tutup"
            >
              <XIcon className="size-5" />
            </button>
            <img
              src={src}
              alt={alt || ""}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-[5px]"
            />
          </div>
        </div>
      )}
    </>
  )
}

export function InsightViewer({ content, className }: InsightViewerProps) {
  // Preprocess custom inline syntax
  const processed = React.useMemo(() => {
    if (!content) return ""
    return content
      // Highlight Warna Teks (murni ubah warna teks tanpa badge dan tanpa icon)
      .replace(/@g\s*([\s\S]*?)\s*@g/g, "[$1](#color-green)")
      .replace(/@bl\s*([\s\S]*?)\s*@bl/g, "[$1](#color-blue)")
      .replace(/@w\s*([\s\S]*?)\s*@w/g, "[$1](#color-warning)")
      .replace(/@r\s*([\s\S]*?)\s*@r/g, "[$1](#color-alert)")
      .replace(/@p\s*([\s\S]*?)\s*@p/g, "[$1](#color-purple)")
      .replace(/@o\s*([\s\S]*?)\s*@o/g, "[$1](#color-orange)")
      .replace(/@gray\s*([\s\S]*?)\s*@gray/g, "[$1](#color-gray)")
      // Sizing
      .replace(/@sm\s*([\s\S]*?)\s*@sm/g, "[$1](#size-sm)")
      .replace(/@lg\s*([\s\S]*?)\s*@lg/g, "[$1](#size-lg)")
      .replace(/@xl\s*([\s\S]*?)\s*@xl/g, "[$1](#size-xl)")
      .replace(/@xxl\s*([\s\S]*?)\s*@xxl/g, "[$1](#size-xxl)")
      // Clear fix
      .replace(/@@/g, "[ ](#clear-both)")
      // Link badge format: @link https://example.com Label @link or @link https://example.com
      .replace(/@link\s+(\S+)(?:\s+(.*?))?@link/g, (_match, url, label) => {
        const fullUrl = url.startsWith("http") ? url : `https://${url}`
        const text = (label && label.trim()) || url
        return `[${text}](${fullUrl}#is-link-badge)`
      })
      .replace(/@link\s+(\S+)/g, (_match, url) => {
        const fullUrl = url.startsWith("http") ? url : `https://${url}`
        return `[${url}](${fullUrl}#is-link-badge)`
      })
  }, [content])

  return (
    <div
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none leading-relaxed",
        "prose-headings:scroll-mt-20 prose-headings:font-bold",
        "prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:tracking-tight prose-h1:text-foreground",
        "prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:text-foreground prose-h2:mt-8 prose-h2:mb-4",
        "prose-h3:text-lg sm:prose-h3:text-xl prose-h3:text-green-800 dark:prose-h3:text-green-400 prose-h3:mt-6 prose-h3:mb-3",
        "prose-p:text-foreground/85 prose-p:my-3 prose-p:leading-relaxed",
        "prose-strong:font-semibold prose-strong:text-foreground",
        "prose-hr:my-8 prose-hr:border-[#15803d]/20",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground my-6" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8 mb-4" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-400 mt-6 mb-3" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, node, ...props }: any) => {
            const hasBlockChild = node?.children?.some(
              (child: any) =>
                child.tagName === "img" ||
                (child.tagName === "a" && child.properties?.href === "#clear-both")
            )
            if (hasBlockChild) {
              return <div className="my-3 leading-relaxed text-xs sm:text-[13.5px] text-foreground/85 dark:text-zinc-300">{children}</div>
            }
            return (
              <p className="text-foreground/85 dark:text-zinc-300 my-3 leading-relaxed text-xs sm:text-[13.5px]" {...props}>
                {children}
              </p>
            )
          },
          a: ({ href, children, ...props }) => {
            // Intercept custom color tokens (hanya ubah warna teks, tanpa badge dan tanpa icon)
            if (href === "#color-green" || href === "#color-success") {
              return (
                <span className="text-[#15803d] dark:text-green-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#color-blue") {
              return (
                <span className="text-sky-600 dark:text-sky-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#color-warning" || href === "#color-yellow") {
              return (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#color-alert" || href === "#color-red") {
              return (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#color-purple") {
              return (
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#color-orange") {
              return (
                <span className="text-orange-600 dark:text-orange-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#color-gray") {
              return (
                <span className="text-zinc-500 dark:text-zinc-400 font-semibold">
                  {children}
                </span>
              )
            }
            if (href === "#size-sm") {
              return <span className="text-xs text-muted-foreground">{children}</span>
            }
            if (href === "#size-lg") {
              return <span className="text-lg font-medium text-foreground">{children}</span>
            }
            if (href === "#size-xl") {
              return <span className="text-xl font-bold text-foreground">{children}</span>
            }
            if (href === "#size-xxl") {
              return <span className="text-2xl font-extrabold text-foreground">{children}</span>
            }
            if (href === "#clear-both") {
              return <span className="block clear-both my-2" />
            }
            if (href && href.endsWith("#is-link-badge")) {
              const cleanHref = href.replace("#is-link-badge", "")
              return (
                <a
                  href={cleanHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 mx-1 my-0.5 rounded-[5px] text-xs font-semibold bg-[#15803d]/10 hover:bg-[#15803d]/20 text-green-800 dark:text-green-300 border border-[#15803d]/25 transition-all no-underline shadow-xs"
                >
                  <span>{children}</span>
                  <ExternalLinkIcon className="size-3 text-[#15803d] shrink-0" />
                </a>
              )
            }

            return (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-[#15803d] dark:text-green-400 hover:text-[#166534] font-medium underline underline-offset-4 decoration-[#15803d]/40 hover:decoration-[#15803d] transition-colors"
                {...props}
              >
                {children}
              </a>
            )
          },
          blockquote: ({ children, node }) => {
            // Check for callout markers: [!TIP], [!INFO], [!WARNING], [!BPOM]
            const rawText = String((node as any)?.children?.[0]?.children?.[0]?.value || "").trim()

            if (rawText.startsWith("[!TIP]") || rawText.startsWith("[!TIPS]")) {
              return (
                <div className="my-5 rounded-[5px] border border-[#15803d]/30 bg-green-50/60 dark:bg-green-950/25 p-4 sm:p-5 text-green-950 dark:text-green-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-green-800 dark:text-green-400 text-sm">
                    <LightbulbIcon className="size-4 shrink-0" />
                    <span>Tips Formulasi Herbal</span>
                  </div>
                  <div className="text-sm leading-relaxed">{children}</div>
                </div>
              )
            }

            if (rawText.startsWith("[!BPOM]") || rawText.startsWith("[!LEGAL]")) {
              return (
                <div className="my-5 rounded-[5px] border border-teal-500/30 bg-teal-50/60 dark:bg-teal-950/25 p-4 sm:p-5 text-teal-950 dark:text-teal-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-teal-800 dark:text-teal-400 text-sm">
                    <ShieldCheckIcon className="size-4 shrink-0" />
                    <span>Catatan Regulasi BPOM & Halal</span>
                  </div>
                  <div className="text-sm leading-relaxed">{children}</div>
                </div>
              )
            }

            if (rawText.startsWith("[!WARNING]") || rawText.startsWith("[!PERINGATAN]")) {
              return (
                <div className="my-5 rounded-[5px] border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/25 p-4 sm:p-5 text-amber-950 dark:text-amber-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-amber-800 dark:text-amber-400 text-sm">
                    <AlertTriangleIcon className="size-4 shrink-0" />
                    <span>Peringatan & Hal Penting</span>
                  </div>
                  <div className="text-sm leading-relaxed">{children}</div>
                </div>
              )
            }

            if (rawText.startsWith("[!INFO]") || rawText.startsWith("[!CATATAN]")) {
              return (
                <div className="my-5 rounded-[5px] border border-sky-500/30 bg-sky-50/60 dark:bg-sky-950/25 p-4 sm:p-5 text-sky-950 dark:text-sky-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 font-bold text-sky-800 dark:text-sky-400 text-sm">
                    <InfoIcon className="size-4 shrink-0" />
                    <span>Informasi Tambahan</span>
                  </div>
                  <div className="text-sm leading-relaxed">{children}</div>
                </div>
              )
            }

            return (
              <div className="my-5 flex gap-3 rounded-[5px] border-l-4 border-[#15803d] bg-muted/40 p-4 sm:p-5 italic text-muted-foreground">
                <QuoteIcon className="size-5 shrink-0 text-[#15803d]/70 not-italic mt-0.5" />
                <div className="text-sm sm:text-base leading-relaxed text-foreground/80">{children}</div>
              </div>
            )
          },
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            if (!inline && match) {
              const codeString = String(children).replace(/\n$/, "")
              return <CodeBlock lang={match[1]} codeString={codeString} />
            }
            return (
              <code
                className="rounded-[5px] bg-[#15803d]/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-green-800 dark:text-green-300 border border-[#15803d]/20"
                {...props}
              >
                {children}
              </code>
            )
          },
          img: ({ src, alt }: any) => {
            if (!src) return null
            const srcStr = String(src)
            const [url, hash] = srcStr.split("#")
            const hashParts = (hash || "").split("&")
            const ratioPart = hashParts.find((p) => p.startsWith("ratio="))
            const ratio = ratioPart ? ratioPart.split("=")[1] : "16:9"
            const widthPart = hashParts.find((p) => p.startsWith("w="))
            const widthPct = widthPart ? Number(widthPart.split("=")[1]) : 100

            let ratioClass = "aspect-video object-cover"
            if (ratio === "4:5") ratioClass = "aspect-[4/5] object-cover"
            else if (ratio === "1:1") ratioClass = "aspect-square object-cover"

            const widthStyle = widthPct < 100 ? { width: `${widthPct}%` } : undefined

            return (
              <div className="my-6" style={widthStyle}>
                <LightboxImage src={url} alt="" className={ratioClass} />
              </div>
            )
          },
          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto rounded-[5px] border border-border shadow-xs">
              <table className="w-full border-collapse text-sm text-left" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted/80 text-foreground font-semibold border-b border-border" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 border-b border-border/50 text-foreground/90 text-sm" {...props}>
              {children}
            </td>
          ),
          ul: ({ children, ...props }) => (
            <ul className="my-3 space-y-1.5 list-none pl-0 text-foreground/85 dark:text-zinc-300 text-xs sm:text-[13.5px]" {...props}>
              {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child
                const props = child.props as any
                return (
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 rounded-full bg-[#15803d] shrink-0" />
                    <span className="flex-1">{props?.children}</span>
                  </li>
                )
              })}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-3 space-y-1.5 list-decimal pl-5 text-foreground/85 dark:text-zinc-300 text-xs sm:text-[13.5px]" {...props}>
              {children}
            </ol>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  )
}
