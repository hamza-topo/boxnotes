import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Props = {
  onError: (message: string | null) => void;
};

export default function SocialAuthButtons({ onError }: Props) {
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleGoogle = async () => {
    setLoadingProvider("google");
    const { error } = await loginWithGoogle();
    onError(error);
    setLoadingProvider(null);
  };

  const handleGithub = async () => {
    setLoadingProvider("github");
    const { error } = await loginWithGithub();
    onError(error);
    setLoadingProvider(null);
  };

  return (
    <div className="socialAuthButtons">
      <button
        type="button"
        className="socialButton"
        onClick={handleGoogle}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
      </button>

      <button
        type="button"
        className="socialButton"
        onClick={handleGithub}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "github" ? "Connecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
}