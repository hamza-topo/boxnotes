import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SocialAuthButtons from "./SocialAuthButtons";

type Props = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const { error } = await login(email.trim(), password);

    if (error) {
      setErrorMessage(error);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
  };

  return (
    <div className="authPanelBody">
      <SocialAuthButtons onError={setErrorMessage} />

      <div className="authDivider">
        <span>or continue with email</span>
      </div>

      <form className="authForm" onSubmit={handleSubmit}>
        <div className="fieldGroup">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="fieldGroup">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage ? <p className="authError">{errorMessage}</p> : null}

        <button className="saveButton" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}