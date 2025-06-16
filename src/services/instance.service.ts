import createApiClient from "./apiClient";

export const orgService = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
export const adminService = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
export const eventService = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
export const authService = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
export const gatewayService = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
export const bookingService = createApiClient(process.env.NEXT_PUBLIC_API_URL!);