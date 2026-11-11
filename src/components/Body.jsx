import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { addRequests } from "../utils/requestSlice"
import { useEffect, useState } from 'react'

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);

  // BUG FIX: pehle page turant render ho jata tha, aur cookie check baad mein hota tha.
  // Logged-out user ko ek second ke liye Feed/Profile dikh jata tha.
  // Ab jab tak "kaun logged in hai" pata nahi chalta, page render hi nahi hota.
  const [checking, setChecking] = useState(!userData);

  useEffect(() => {
    if (userData) return;
    axios
      .get(BASE_URL + "/profile/view", { withCredentials: true, timeout: 10000 })
      .then((res) => dispatch(addUser(res.data)))
      .catch(() => {
        if (location.pathname !== "/login") navigate("/login", { replace: true });
      })
      .finally(() => setChecking(false));
    // sirf pehli baar chalana hai
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logged-in user /login khole → home. Logout ke baad protected page → login.
  useEffect(() => {
    if (checking) return;
    const onLogin = location.pathname === "/login";
    if (userData && onLogin) navigate("/", { replace: true });
    if (!userData && !onLogin) navigate("/login", { replace: true });
  }, [userData, checking, location.pathname, navigate]);

  // NavBar mein Requests ka count dikhane ke liye ek baar fetch
  useEffect(() => {
    if (!userData || requests) return;
    axios
      .get(BASE_URL + "/user/requests/recieves", { withCredentials: true })
      .then((res) => dispatch(addRequests(res.data.data)))
      .catch(() => {});
  }, [userData, requests, dispatch]);

  // Messages screen poori height leta hai — wahan footer nahi
  const isChatScreen =
    location.pathname.startsWith("/chat") || location.pathname === "/connections";

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className={isChatScreen ? "flex-1" : "flex-1 w-full max-w-5xl mx-auto px-4 py-8"}>
        {checking ? (
          <div className="flex justify-center py-24">
            <span className="loading loading-spinner loading-md opacity-60" />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      {!isChatScreen && <Footer />}
    </div>
  );
}

export default Body;
