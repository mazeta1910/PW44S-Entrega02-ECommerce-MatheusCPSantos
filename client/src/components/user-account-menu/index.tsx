import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import type { AuthenticatedUser } from "@/commons/types";
import {
  getUserAvatarUrl,
  getUserInitial,
  USER_AVATAR_UPDATED_EVENT,
} from "@/utils/auth-utils";
import "./styles.css";

const HOVER_CLOSE_DELAY_MS = 200;

interface UserAccountMenuProps {
  userLabel: string;
  authenticatedUser?: AuthenticatedUser;
}

export function UserAccountMenu({
  userLabel,
  authenticatedUser,
}: UserAccountMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const avatarUrl = getUserAvatarUrl(authenticatedUser);

  useEffect(() => {
    const refreshAvatar = () => setAvatarVersion((value) => value + 1);
    window.addEventListener(USER_AVATAR_UPDATED_EVENT, refreshAvatar);
    return () =>
      window.removeEventListener(USER_AVATAR_UPDATED_EVENT, refreshAvatar);
  }, []);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  };

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div
      className="user-account-menu"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="user-account-menu__trigger"
        aria-label={`Conta de ${userLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => goTo("/account")}
      >
        <span className="user-account-menu__name hidden sm:block">{userLabel}</span>
        {avatarUrl ? (
          <Avatar
            key={avatarVersion}
            image={avatarUrl}
            shape="circle"
            className="top-menu-user-avatar"
            aria-hidden
          />
        ) : (
          <Avatar
            label={getUserInitial(authenticatedUser)}
            shape="circle"
            className="bg-primary top-menu-user-avatar"
            aria-hidden
          />
        )}
      </button>

      {open && (
        <div className="user-account-menu__panel" role="menu">
          <button
            type="button"
            className="user-account-menu__item"
            role="menuitem"
            onClick={() => goTo("/account")}
          >
            <span className="pi pi-user" aria-hidden />
            Meu Perfil
          </button>
          <button
            type="button"
            className="user-account-menu__item"
            role="menuitem"
            onClick={() => goTo("/account/orders")}
          >
            <span className="pi pi-shopping-bag" aria-hidden />
            Meus Pedidos
          </button>
          <button
            type="button"
            className="user-account-menu__item"
            role="menuitem"
            onClick={() => goTo("/account/addresses")}
          >
            <span className="pi pi-map-marker" aria-hidden />
            Meus Endereços
          </button>
        </div>
      )}
    </div>
  );
}
