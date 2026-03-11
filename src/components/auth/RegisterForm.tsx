import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SocialAuthButtons from "./SocialAuthButtons";

type Props = {
  onSuccess: () => void;
};

export default function RegisterForm({ onSuccess }: Props) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    const { error } = await register(fullName.trim(), email.trim(), password);

    if (error) {
      setErrorMessage(error);
      setSubmitting(false);
      return;
    }

    setInfoMessage("Account created. Check your email if confirmation is required.");
    setSubmitting(false);
    onSuccess();
  };

  return (
    <div className="authPanelBody">
      <SocialAuthButtons onError={setErrorMessage} />

      <div className="authDivider">
        <span>or create an account with email</span>
      </div>

      <form className="authForm" onSubmit={handleSubmit}>
        <div className="fieldGroup">
          <label htmlFor="register-fullname">Full name</label>
          <input
            id="register-fullname"
            type="text"
            placeholder="Hamza Ait Sidi Said"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="fieldGroup">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="fieldGroup">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="fieldGroup">
          <label htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage ? <p className="authError">{errorMessage}</p> : null}
        {infoMessage ? <p className="authInfo">{infoMessage}</p> : null}

        <button className="saveButton" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}