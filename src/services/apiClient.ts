/* Package System */
import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";

/* Package Application */
import { authOptions } from "lib/authOptions";

let cachedSession: Awaited<ReturnType<typeof getSession>> | null = null;

// Check if code is running on server or client
const isServer = typeof window === 'undefined';

// --- Retry delay management for DEV mode ---
let currentRetryDelay = 1000; // Start with 1s
const isDev = process.env.NODE_ENV === "development";

const resetRetryDelay = () => {
  currentRetryDelay = 1000;
}

const increaseRetryDelay = () => {
  // max 10s delay in dev, less aggressive
  if (isDev) {
    currentRetryDelay = Math.min(currentRetryDelay + 1000, 10000);
  }
};

const createApiClient = (baseUrl: string): AxiosInstance => {
  const apiClient = axios.create({ baseURL: baseUrl });

  axiosRetry(apiClient, {
    retries: 2,

    retryDelay: (retryCount) => {
      return currentRetryDelay;
    },

    retryCondition: (error) => {
      const shouldRetry = axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
      if (shouldRetry) {
        resetRetryDelay();
      } else {
        increaseRetryDelay();
      }

      return shouldRetry;
    }
  });

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!cachedSession) cachedSession = await getSession();

      const token = cachedSession?.user?.accessToken;
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          cachedSession = isServer
            ? await getServerSession(authOptions)
            : await getSession();

          const refreshToken = cachedSession?.user?.refreshToken;
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh-token`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token } = refreshResponse.data.data;

          if (cachedSession?.user) {
            cachedSession.user.accessToken = access_token;
            cachedSession.user.refreshToken = refresh_token;
          }

          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }

          originalRequest.headers.set("Authorization", `Bearer ${access_token}`);

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("🔒 Refresh token failed", refreshError);
          cachedSession = null;

          await signOut({
            redirect: true,
            callbackUrl: "/login",
          });

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}

export default createApiClient;