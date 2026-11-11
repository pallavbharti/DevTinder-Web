import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

// Backend kabhi string bhejta hai ("ERROR : ..."), kabhi object ({message}).
// BUG FIX: pehle object seedha JSX mein jaata tha → React crash.
const readError = (err) => {
  const data = err?.response?.data;
  if (!err?.response) return "Can't reach the server. Check your connection.";
  if (typeof data === "string") return data.replace(/^ERROR\s*:\s*/i, "");
  return data?.message || data?.error || "Something went wrong";
};

const Login = () => {
  // BUG FIX: pehle elon@gmail.com / Elon@123 pehle se bhara hota tha
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await axios.post(
      BASE_URL + "/login",
      { emailId, password },
      { withCredentials: true }
    );
    dispatch(addUser(res.data));
    navigate("/");
  };

  const handleSignup = async () => {
    const res = await axios.post(
      BASE_URL + "/signup",
      { firstName, lastName, emailId, password },
      { withCredentials: true }
    );
    dispatch(addUser(res.data.data));
    navigate("/profile"); // naye user ko pehle profile complete karwao
  };

  // <form> + onSubmit → Enter dabane se bhi submit hota hai (pehle sirf button click se hota tha)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLoginForm) await handleLogin();
      else await handleSignup();
    } catch (err) {
      setError(readError(err));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginForm(!isLoginForm);
    setError("");
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto py-6 md:py-14">
      <div className="hidden md:block">
        <h1 className="text-5xl font-semibold leading-tight">
          Find people who<br />build like you do.
        </h1>
        <p className="mt-4 text-lg opacity-75 max-w-sm">
          Browse developer profiles, connect with the ones you click with, and keep
          the conversation going in chat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 w-full max-w-sm mx-auto">
        <div className="card-body gap-3">
          <h2 className="text-2xl font-semibold">
            {isLoginForm ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm opacity-70 -mt-2 mb-2">
            {isLoginForm ? "Log in to see who's new." : "It takes less than a minute."}
          </p>

          {!isLoginForm && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <input
                  type="text"
                  value={firstName}
                  required
                  autoComplete="given-name"
                  className="input w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Field>
              <Field label="Last name">
                <input
                  type="text"
                  value={lastName}
                  autoComplete="family-name"
                  className="input w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Field>
            </div>
          )}

          <Field label="Email">
            <input
              type="email"
              value={emailId}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              required
              autoComplete={isLoginForm ? "current-password" : "new-password"}
              className="input w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {error && (
            <p role="alert" className="text-error text-sm">{error}</p>
          )}

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading && <span className="loading loading-spinner loading-xs" />}
            {isLoginForm ? "Log in" : "Sign up"}
          </button>

          <p className="text-sm text-center mt-1 opacity-80">
            {isLoginForm ? "New here? " : "Already have an account? "}
            <button type="button" onClick={switchMode} className="link link-hover font-medium text-accent">
              {isLoginForm ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium opacity-80">{label}</span>
    {children}
  </label>
);

export default Login;
