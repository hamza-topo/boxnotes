import { useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthMode = "login" | "register";

type Props = {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onChangeMode: (mode: AuthMode) => void;
};

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onChangeMode,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="authModal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication modal"
      >
        <button className="modalCloseButton" type="button" onClick={onClose}>
          ×
        </button>

        <div className="authModalHeader">
          <p className="eyebrow">Account</p>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p>
            {mode === "login"
              ? "Log in to sync and manage your notes."
              : "Sign up to save your notes and grow your command library."}
          </p>
        </div>

        <div className="authTabs">
          <button
            type="button"
            className={`authTabButton ${mode === "login" ? "authTabButtonActive" : ""}`}
            onClick={() => onChangeMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`authTabButton ${mode === "register" ? "authTabButtonActive" : ""}`}
            onClick={() => onChangeMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
}