/* Package System */
import { Suspense, ReactNode } from "react";

/* Package Application */
import AccountSkeletonLoading from "./loading";

export default function DefaultLayout ({
  children
}: {
  children: ReactNode
}) {
  return (
    <Suspense fallback={<AccountSkeletonLoading />}>
      <main>{children}</main>
    </Suspense>
  )
}