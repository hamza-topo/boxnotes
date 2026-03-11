import { useState } from "react";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openModal = (nextMode: AuthMode) => {
    setMode(nextMode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <>
      <header className="topHeader">
        <div className="brandMini">
          <span className="eyebrow">Sketch Notes</span>
        </div>

        <div className="headerActions">
          {loading ? null : user ? (
            <>
              <span className="userGreeting">Hi, {displayName}</span>
              <button className="headerGhostButton" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="headerGhostButton"
                type="button"
                onClick={() => openModal("login")}
              >
                Login
              </button>
              <button
                className="headerPrimaryButton"
                type="button"
                onClick={() => openModal("register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isModalOpen}
        mode={mode}
        onClose={closeModal}
        onChangeMode={setMode}
      />
    </>
  );
}