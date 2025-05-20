/* Package System */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'


/* Package Application */
import createApiClient from 'services/apiClient'

interface JwtPayload {
  accessToken: string;
  id: string;
  email: string;
  role: string;
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
  login: (token: string, refresh_token: string) => void;
  logout: () => void;
  getUserInfo: () => Promise<UserInfo | null>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: () => { },
  logout: () => { },
  getUserInfo: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.accessToken) {
      const decoded = jwtDecode<JwtPayload>(session.user.accessToken);
      const newUser = { ...decoded, accessToken: session.user.accessToken };

      // Chỉ cập nhật nếu token thực sự khác
      if (!user || user.accessToken !== newUser.accessToken) {
        setUser(newUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }

    // Fallback nếu không đăng nhập bằng session (hoặc khi bị mất session)
    if (status === 'unauthenticated' && !user) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedUser = jwtDecode<JwtPayload>(token);
          setUser({ ...decodedUser, accessToken: token });
          setIsAuthenticated(true);
        } catch {
          console.error('Invalid token in localStorage');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    }
  }, [status, session]);

  const login = (token: string, refresh_token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh-token', refresh_token);

    try {
      const decodedUser = jwtDecode<JwtPayload>(token);
      setIsAuthenticated(true);
      setUser({ ...decodedUser, accessToken: token });
    } catch {
      console.error('Invalid token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600 text-sm">Kiểm tra đăng nhập</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, getUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};