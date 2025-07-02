import DashboardLoading from "@/app/(dashboard)/loading"
import { Suspense } from "react"

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <main>{children}</main>
    </Suspense>
  )
}