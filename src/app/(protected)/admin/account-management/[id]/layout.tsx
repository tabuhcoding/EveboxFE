import { Suspense, ReactNode } from "react"
import Loading from "./loading"

export default function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
      <Suspense fallback={<Loading />}>
        <main>{children}</main>
      </Suspense>
  )
}