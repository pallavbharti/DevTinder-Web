import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { EyeIcon, EyeOffIcon } from "./ui/Icons";

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="font-mono text-xs text-base-content/60">{label}</span>
    <input {...props} className="input w-full mt-1.5 bg-base-100/60 focus:border-primary" />
  </label>
);

const CodeHero = () => (
  <div className="hidden lg:flex flex-col justify-center">
    <p className="font-mono text-sm text-secondary mb-4">// where developers match</p>
    <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05]">
      Find devs who <br />
      <span className="text-gradient">speak your stack.</span>
    </h1>
    <p className="mt-5 text-lg text-base-content/60 max-w-md">
      Swipe through developer profiles, connect with people you vibe with, and chat in real time.
    </p>

    <div className="mt-10 glass-card rounded-box overflow-hidden max-w-md shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-base-content/10">
        <span className="w-3 h-3 rounded-full bg-error/80" />
        <span className="w-3 h-3 rounded-full bg-warning/80" />
        <span className="w-3 h-3 rounded-full bg-success/80" />
        <span className="ml-3 font-mono text-xs text-base-content/50">match.js</span>
      </div>
      <pre className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
        <code>
          <span className="text-primary">const</span> match = <span className="text-primary">await</span> devTinder.<span className="text-secondary">find</span>({"{"}{"\n"}
          {"  "}stack: <span className="text-success">"MERN"</span>,{"\n"}
          {"  "}vibe: <span className="text-success">"ships on Fridays"</span>,{"\n"}
          {"  "}coffee: <span className="text-accent">true</span>,{"\n"}
          {"}"});{"\n\n"}
          <span className="text-base-content/50">// → 1 new connection 💜</span>
          <span className="caret" />
        </code>
      </pre>
    </div>
  </div>
);

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // One submit handler for both modes → Enter key works too
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLoginForm) {
        const res = await axios.post(
          BASE_URL + "/login",
          { emailId, password },
          { withCredentials: true }
        );
        dispatch(addUser(res.data));
        navigate("/");
      } else {
        const res = await axios.post(
          BASE_URL + "/signup",
          { firstName, lastName, emailId, password },
          { withCredentials: true }
        );
        dispatch(addUser(res.data.data));
        navigate("/profile");
      }
    } catch (err) {
      const msg = err?.response?.data;
      setError(typeof msg === "string" ? msg.replace(/^ERROR\s*:\s*/, "") : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginForm((v) => !v);
    setError("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
      <CodeHero />

      <div className="w-full max-w-md mx-auto animate-fade-up">
        <div className="glass-card ring-gradient rounded-box p-7 sm:p-9 shadow-2xl">
          <p className="font-mono text-xs text-secondary">
            $ devtinder {isLoginForm ? "login" : "signup"}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">
            {isLoginForm ? "Welcome back 👋" : "Create your account"}
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            {isLoginForm ? "Log in to keep swiping." : "Join and start matching with devs."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
                <Field label="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
              </div>
            )}

            <Field
              label="email"
              type="email"
              placeholder="you@dev.io"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              autoComplete="email"
            />

            <label className="block">
              <span className="font-mono text-xs text-base-content/60">password</span>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pr-11 bg-base-100/60 focus:border-primary"
                  required
                  autoComplete={isLoginForm ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {!isLoginForm && (
                <span className="text-xs text-base-content/50 mt-1 block">
                  8+ chars with upper, lower, number & symbol
                </span>
              )}
            </label>

            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-glow w-full" disabled={loading}>
              {loading && <span className="loading loading-spinner loading-sm" />}
              {isLoginForm ? "Login" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-base-content/60">
            {isLoginForm ? "New to DevTinder?" : "Already have an account?"}{" "}
            <button onClick={switchMode} className="link link-primary font-medium">
              {isLoginForm ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
