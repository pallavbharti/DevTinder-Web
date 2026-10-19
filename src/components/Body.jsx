import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    if (userData) return;

    // On page refresh Redux is empty, so ask the backend "who am I?" using the cookie.
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch {
        // No/expired cookie → send to login (unless already there)
        if (location.pathname !== "/login") navigate("/login");
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="app-bg" aria-hidden="true" />
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Body;
