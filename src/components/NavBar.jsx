import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";
import useTheme from "../hooks/useTheme";
import Avatar from "./Avatar";

const links = [
  { to: "/", label: "Discover", end: true },
  { to: "/connections", label: "Messages" },
  { to: "/requests", label: "Requests" },
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // BUG FIX: pehle sirf user + feed clear hota tha.
      // Doosra user login kare toh pichle user ke connections/requests dikhte the.
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(clearRequests());
      navigate("/login");
    }
  };

  const pendingCount = requests?.length || 0;

  const linkClass = ({ isActive }) =>
    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors " +
    (isActive ? "bg-base-200 text-base-content" : "opacity-70 hover:opacity-100 hover:bg-base-200");

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 min-h-14 sticky top-0 z-30">
      <div className="flex-1 flex items-center gap-6">
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight">
          dev<span className="text-accent">tinder</span>
        </Link>

        {user && (
          <nav className="hidden sm:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
                {l.to === "/requests" && pendingCount > 0 && (
                  <span className="ml-1.5 badge badge-sm badge-accent">{pendingCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 px-1.5">
              <Avatar user={user} size={30} />
              <span className="hidden md:inline text-sm font-medium">{user.firstName}</span>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-box z-40 mt-2 w-52 p-2 shadow-sm"
            >
              {/* mobile pe upar ke links yahan aate hain */}
              {links.map((l) => (
                <li key={l.to} className="sm:hidden">
                  <Link to={l.to}>
                    {l.label}
                    {l.to === "/requests" && pendingCount > 0 && (
                      <span className="badge badge-sm badge-accent">{pendingCount}</span>
                    )}
                  </Link>
                </li>
              ))}
              <li><Link to="/profile">Edit profile</Link></li>
              <li><Link to="/premium">Premium</Link></li>
              <li className="border-t border-base-300 mt-1 pt-1">
                <button onClick={handleLogout}>Log out</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default NavBar;
