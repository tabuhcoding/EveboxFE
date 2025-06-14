/* Package Application */
import { BaseApiResponse } from "types/baseApiResponse";
import { Category, Event, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";

import { END_POINT_LIST } from "./endpoint";
import { orgService } from "./instance.service";
import { OrgPaymentInfoData } from "types/models/org/orgPaymentInfo.interface";

export async function getOrgPaymentInfo(): Promise<OrgPaymentInfoData> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/payment`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`, // Adjust if SSR uses cookies/session
        },
        next: { revalidate: 60 }, // Optional SSR caching
      }
    );
    if (!res.ok) throw new Error("Failed to fetch organizer payment info");
    const json: BaseApiResponse<OrgPaymentInfoData> = await res.json();
    return json.data;
  } else {
    const res = await orgService.get<BaseApiResponse<OrgPaymentInfoData>>(
      END_POINT_LIST.ORG_PAYMENT.PAYMENT
    );
    if (!res) throw new Error("Failed to fetch organizer payment info");
    return res.data.data;
  }
}

