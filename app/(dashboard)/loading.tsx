import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <LoadingSpinner text="Loading" />
    </div>
  )
}
