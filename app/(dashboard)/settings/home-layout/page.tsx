"use client"

import * as React from "react"
import { HomeLayoutEditor } from "@/components/home-layout-editor"

export default function HomeLayoutSettingsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:py-6 px-4 lg:px-6 w-full min-h-screen">
      <HomeLayoutEditor />
    </div>
  )
}
