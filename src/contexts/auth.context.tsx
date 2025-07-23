/* Package System */
import { jwtDecode } from 'jwt-decode'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'


/* Package Application */
import createApiClient, { clearSessionCache } from 'services/apiClient'
import { SessionExpiredDialog } from 'components/common/sessionExpiredDialog'

interface JwtPayload {
  accessToken: string;
  id: string;
  email: string;
  role: number;
  refreshToken: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: number;
  phone: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: JwtPayload | null;
  session: any;
  getUserInfo: () => Promise<UserInfo | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  session: null,
  logout: async () => { },
  getUserInfo: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Đợi NextAuth load xong
    
    // Check for refresh token errors
    if ((session as any)?.error === "RefreshAccessTokenError") {
      console.log("🚨 Refresh token failed, showing dialog...");
      setShowSessionExpiredDialog(true);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    if (status === 'authenticated' && session?.user?.accessToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(session.user.accessToken);
        const newUser = { ...decoded, accessToken: session.user.accessToken };

        // Chỉ cập nhật nếu token thực sự khác (tránh re-render không cần thiết)
        if (!user || user.accessToken !== newUser.accessToken || user.id !== newUser.id) {
          setUser(newUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid JWT token:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else if (status === 'unauthenticated') {
      // Chỉ clear khi thực sự unauthenticated
      if (user || isAuthenticated) {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    
    setIsLoading(false);
  }, [status, session?.user?.accessToken]); // Chỉ theo dõi những giá trị thực sự cần thiết

  // Listen for refresh token failure events from apiClient
  useEffect(() => {
    const handleRefreshTokenFailure = () => {
      console.log("🚨 Received refresh token failure event, showing dialog...");
      setShowSessionExpiredDialog(true);
      setUser(null);
      setIsAuthenticated(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('refresh-token-failed', handleRefreshTokenFailure);
      
      return () => {
        window.removeEventListener('refresh-token-failed', handleRefreshTokenFailure);
      };
    }
  }, []);

  const getUserInfo = async (): Promise<UserInfo | null> => {
    const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || '');
    try {
      const response = await apiClient.get('/api/user/me');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      setShowSessionExpiredDialog(false); // Đóng dialog nếu đang mở

      clearSessionCache();
      localStorage.clear();

      await signOut({ 
        redirect: true,
        callbackUrl: '/login'
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleSessionExpiredLogin = useCallback(async (): Promise<void> => {
    setShowSessionExpiredDialog(false);
    await logout();
  }, [logout]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    session,
    logout,
    getUserInfo
  }), [isAuthenticated, user, session, logout]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600 text-sm">Kiểm tra đăng nhập</span>
      </div>
    );
  }

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
      
      {/* Session Expired Dialog */}
      <SessionExpiredDialog 
        open={showSessionExpiredDialog}
        onLogin={handleSessionExpiredLogin}
      />
    </>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};