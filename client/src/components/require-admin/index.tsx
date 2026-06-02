import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { isAdmin } from "@/utils/auth-utils";

export function RequireAdmin() {
  const { authenticated, authenticatedUser } = useContext(AuthContext);
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin(authenticatedUser)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
