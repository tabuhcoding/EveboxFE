/* Package System */
import { Suspense } from "react";

/* Package Application */
import LocationManagementClient from "./_components/locationManagementPage";
import LocationTableSkeleton from "./_components/locationSkeletonLoading";

export default async function Page() {
  return (
    <Suspense fallback={<LocationTableSkeleton />}>
      <LocationManagementClient />
    </Suspense>
  )
}