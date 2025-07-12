import DashboardLoading from "@/app/(frontpage)/loading"
import { Suspense } from "react"
import { Toaster } from "react-hot-toast"

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <main>{children}</main>
       <Toaster reverseOrder={false} />
    </Suspense>
  )
}