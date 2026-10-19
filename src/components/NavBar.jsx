import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, avatarFor } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";
import useTheme from "../hooks/useTheme";
import {
  SunIcon, MoonIcon, FlameIcon, UsersIcon, InboxIcon, CrownIcon,
  UserIcon, LogoutIcon, MenuIcon,
} from "./ui/Icons";

const links = [
  { to: "/", label: "Feed", icon: FlameIcon, end: true },
  { to: "/connections", label: "Connections", icon: UsersIcon },
  { to: "/requests", label: "Requests", icon: InboxIcon },
  { to: "/premium", label: "Premium", icon: CrownIcon },
];

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="DevTinder home">
    <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content font-mono font-bold text-sm shadow-lg shadow-primary/30 group-hover:scale-105 transition">
      {"</>"}
    </span>
    <span className="font-display font-bold text-lg tracking-tight">
      Dev<span className="text-gradient">Tinder</span>
    </span>
  </Link>
);

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle btn-sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear every slice so the next user doesn't see stale data
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(clearRequests());
      navigate("/login");
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-primary/15 text-primary"
        : "text-base-content/70 hover:text-base-content hover:bg-base-content/5"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100/70 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
        <Logo />

        {user && (
          <ul className="hidden md:flex items-center gap-1 ml-6">
            {links.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={linkClass}>
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {user && (
            <>
              {/* Mobile menu */}
              <div className="dropdown dropdown-end md:hidden">
                <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm" aria-label="Open menu">
                  <MenuIcon />
                </button>
                <ul tabIndex={0} className="menu dropdown-content glass-card rounded-box z-50 mt-3 w-56 p-2 shadow-xl">
                  {links.map(({ to, label, icon: Icon, end }) => (
                    <li key={to}>
                      <NavLink to={to} end={end}>
                        <Icon className="w-4 h-4" /> {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avatar menu */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-2 pl-1 pr-1 sm:pr-3 py-1 rounded-full hover:bg-base-content/5 transition cursor-pointer">
                  <div className="avatar">
                    <div className="w-9 rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-base-100">
                      <img
                        alt={user.firstName}
                        src={user.photoUrl || avatarFor(user.firstName, user.lastName)}
                      />
                    </div>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.firstName}</span>
                </div>
                <ul tabIndex={0} className="menu dropdown-content glass-card rounded-box z-50 mt-3 w-56 p-2 shadow-xl">
                  <li className="menu-title font-mono text-xs">
                    signed in as {user.firstName}
                  </li>
                  <li>
                    <Link to="/profile"><UserIcon className="w-4 h-4" /> Edit profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      <LogoutIcon className="w-4 h-4" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
