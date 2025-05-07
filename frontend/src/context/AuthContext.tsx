import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios, { AxiosInstance } from "axios";

// Tipagem para o User
interface User {
  customIcon: string;
  _id: string;
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

  // Verifica login ao iniciar
  useEffect(() => {
    if (accessToken) {
      api.get("/me")
        .then(({ data }) => setUser(data))
        .catch(() => logout());
    }
  }, [accessToken, logout]);

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

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
