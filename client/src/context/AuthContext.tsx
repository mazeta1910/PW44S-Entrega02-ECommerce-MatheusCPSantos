import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostLoginPath } from "@/utils/auth-utils";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<any>;
  handleLogout: () => void;
  refreshAuthenticatedUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

function getStoredToken(): string | null {
  const stored = localStorage.getItem("token");
  if (!stored) return null;
  try {
    return stored.startsWith('"') ? JSON.parse(stored) : stored;
  } catch {
    return stored;
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = getStoredToken();
    if (storedUser && token) {
      const user = JSON.parse(storedUser) as AuthenticatedUser;
      setAuthenticatedUser(user);
      setAuthenticated(true);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const authOnlyPaths = ["/login", "/register"];
      if (authOnlyPaths.includes(location.pathname)) {
        navigate(getPostLoginPath(user), { replace: true });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (
    authenticationResponse: AuthenticationResponse
  ) => {
    try {
      localStorage.setItem("token", authenticationResponse.token);
      localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
      api.defaults.headers.common["Authorization"] =
        `Bearer ${authenticationResponse.token}`;

      setAuthenticatedUser(authenticationResponse.user);
      setAuthenticated(true);
    } catch {
      setAuthenticatedUser(undefined);
      setAuthenticated(false);
    }
  };

  const refreshAuthenticatedUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return;
    }

    try {
      setAuthenticatedUser(JSON.parse(storedUser) as AuthenticatedUser);
    } catch {
      setAuthenticatedUser(undefined);
    }
  };

  useEffect(() => {
    const handleUserUpdated = () => refreshAuthenticatedUser();
    window.addEventListener("authUserUpdated", handleUserUpdated);
    return () => window.removeEventListener("authUserUpdated", handleUserUpdated);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.common["Authorization"] = "";

    setAuthenticated(false);
    setAuthenticatedUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        authenticatedUser,
        handleLogin,
        handleLogout,
        refreshAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
