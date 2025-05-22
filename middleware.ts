// middleware.ts
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createApiClient from 'services/apiClient';

// Role mapping...
const routePermissions: { [key: string]: keyof RolePermissions } = {
  'summary-revenue': 'isSummarized',
  'vouchers/voucher-list': 'viewVoucher',
  'orders': 'viewOrder',
  'seatmap': 'viewSeatmap',
  'check-in': 'checkin',
  'member': 'viewMember',
  'edit': 'isEdited',
  'marketing':'marketing'
};

type RolePermissions = {
  [permission: string]: boolean;
};

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // Redirect to /login if not authenticated
  if (!token || !token.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;
  const match = pathname.match(/\/organizer\/events\/(\d+)\/([^\/]+)/);

  if (!match) return NextResponse.next();

  const [, eventId, routeKey] = match;
  const requiredPermission = routePermissions[routeKey] as keyof RolePermissions | undefined;

  if (!requiredPermission) return NextResponse.next();

  try {
    const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || "");
    const memberRes = await apiClient.get(`/org/member/${eventId}`, {
      params: { email: token.email },
      headers: { Authorization: `Bearer ${token.accessToken}` }
    });

    const member = memberRes.data?.data?.[0];
    if (!member) return NextResponse.redirect(new URL(`/organizer/events/${eventId}/unauthorized`, req.url));

    const roleRes = await apiClient.get(`/api/event/role/${member.role}`, {
      headers: { Authorization: `Bearer ${token.accessToken}` }
    });

    const permissions: RolePermissions = roleRes.data;
    if (!requiredPermission || !permissions[requiredPermission]) {
      return NextResponse.redirect(new URL(`/organizer/events/${eventId}/unauthorized`, req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL(`/organizer/events/${eventId}/unauthorized`, req.url));
  }
}

export const config = {
  matcher: [
    '/:path*', // Apply withAuth globally
    '/organizer/events/:eventId/:path*',
  ]
};