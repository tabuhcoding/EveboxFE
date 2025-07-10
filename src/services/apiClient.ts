/* Package System */
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

/* Package Application */
import { authOptions } from "lib/authOptions";

let cachedSession: Awaited<ReturnType<typeof getSession>> | null = null;
let sessionPromise: Promise<any> | null = null;
let lastSessionFetch = 0;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

// Check if code is running on server or client
const isServer = typeof window === "undefined";

// Session cache duration (15 phút - tăng từ 5 phút)
const SESSION_CACHE_DURATION = 15 * 60 * 1000;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const getOptimizedSession = async (): Promise<
  Awaited<ReturnType<typeof getSession>>
> => {
  const now = Date.now();

  if (cachedSession && now - lastSessionFetch < SESSION_CACHE_DURATION) {
    return cachedSession;
  }

  if (sessionPromise) {
    return sessionPromise;
  }

  // Tạo mới session request
  sessionPromise = (async () => {
    try {
      const session = isServer
        ? await getServerSession(authOptions)
        : await getSession();

      cachedSession = session;
      lastSessionFetch = now;
      return session;
    } catch (error) {
      console.error("Session fetch error:", error);
      return null;
    } finally {
      sessionPromise = null;
    }
  })();

  return sessionPromise;
};

const clearSessionCache = () => {
  cachedSession = null;
  sessionPromise = null;
  lastSessionFetch = 0;
};

const createApiClient = (baseUrl: string): AxiosInstance => {
  const apiClient = axios.create({ baseURL: baseUrl });

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Chỉ fetch session khi cần thiết và chưa có cache
      const session = await getOptimizedSession();

      const token = session?.user?.accessToken;
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
        if (isRefreshing) {
          // Nếu đang refresh, đưa request vào queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (!originalRequest.headers) {
                originalRequest.headers = new AxiosHeaders();
              }
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log("🔒 Refreshing token...: isServer:", isServer);

          clearSessionCache();

          const session = await getOptimizedSession();
          const refreshToken = session?.user?.refreshToken;

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh-token`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token } = refreshResponse.data.data;

          // Cập nhật cached session
          if (cachedSession?.user) {
            cachedSession.user.accessToken = access_token;
            cachedSession.user.refreshToken = refresh_token;
          }

          // Cập nhật NextAuth session với token mới
          if (!isServer) {
            // Trigger session update để NextAuth nhận token mới
            const event = new CustomEvent("nextauth.session.update", {
              detail: {
                accessToken: access_token,
                refreshToken: refresh_token,
              },
            });
            window.dispatchEvent(event);
          }

          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }

          originalRequest.headers.set(
            "Authorization",
            `Bearer ${access_token}`
          );

          processQueue(null, access_token);

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("🔒 Refresh token failed", refreshError);

          processQueue(refreshError, null);

          clearSessionCache();

          // Emit event to notify AuthContext about refresh token failure
          if (!isServer) {
            const event = new CustomEvent("refresh-token-failed", {
              detail: { error: refreshError },
            });
            window.dispatchEvent(event);
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export { clearSessionCache };
export default createApiClient;
