import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostLoginPath } from "@/utils/auth-utils";
import {
  clearAuthData,
  getStoredToken,
  getStoredUser,
  persistAuthData,
} from "@/utils/auth-storage";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (
    authenticationResponse: AuthenticationResponse,
    rememberMe?: boolean,
  ) => Promise<void>;
  handleLogout: () => void;
  refreshAuthenticatedUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (user && token) {
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
    authenticationResponse: AuthenticationResponse,
    rememberMe = true,
  ) => {
    try {
      persistAuthData(
        authenticationResponse.token,
        authenticationResponse.user,
        rememberMe,
      );
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
    const user = getStoredUser();
    if (!user) {
      return;
    }

    setAuthenticatedUser(user);
  };

  useEffect(() => {
    const handleUserUpdated = () => refreshAuthenticatedUser();
    window.addEventListener("authUserUpdated", handleUserUpdated);
    return () => window.removeEventListener("authUserUpdated", handleUserUpdated);
  }, []);

  const handleLogout = async () => {
    clearAuthData();
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
