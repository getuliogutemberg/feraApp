import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios, { AxiosInstance } from "axios";

// Tipagem para o User
interface User {
  customIcon: string;
  id: string;
  name: string;
  email: string;
  category: string;
  className: string;
  bio: string;
}

// Tipagem para o contexto
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  accessToken: string;
}

// Criando contexto com valores iniciais
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  accessToken: "",
});

// Tipagem para o Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>(localStorage.getItem("accessToken") || "");

  // Instância do axios
  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post("/logout");
    } catch {
      // Se falhar, só remove os tokens
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken("");
    setUser(null);
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", { email, password });
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
    } catch (err) {
      console.error("Erro no login", axios.isAxiosError(err) ? err.response?.data?.message : err);
    }
  };

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const { data } = await axios.post("http://localhost:5000/refresh", { refreshToken });
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    } catch (err) {
      await logout();
      return false;
    }
  }, [logout]);

  // Verifica token de acesso para login imediato
  useEffect(() => {
    const initializeAuth = async () => {
      if (!accessToken) return;
  
      try {
        await api.get("/me").then(({ data }) => setUser(data));
      } catch (error) {
        // Tenta renovar se o accessToken estiver expirado
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            await api.get("/me").then(({ data }) => setUser(data));
          } catch {
            await logout();
          }
        }
      }
    };
  
    initializeAuth();
  }, [accessToken, refreshAccessToken, logout]);

  // Interceptor para tratar erros 401
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        // Se erro for 401 e não foi tentado renovar ainda
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest); // Repete a requisição original
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};