import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link, NavLink, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import Chat from "./Chat";

// Messages screen: left = connections list, right = chat (WhatsApp Web jaisa).
// /connections        → sirf list (desktop pe right side "pick a chat")
// /chat/:targetUserId → list + us user ki chat
const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const { targetUserId } = useParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (connections) return; // already loaded → dobara API call nahi
    axios
      .get(BASE_URL + "/user/connections", { withCredentials: true })
      .then((res) => dispatch(addConnections(res.data.data)))
      .catch((err) => console.error(err));
  }, [connections, dispatch]);

  // search sirf tab dobara chalega jab list ya query badle
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!connections) return [];
    if (!q) return connections;
    return connections.filter((c) =>
      `${c.firstName} ${c.lastName || ""}`.toLowerCase().includes(q)
    );
  }, [connections, query]);

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex bg-base-100">
      {/* ---------- Left: list ---------- */}
      <aside
        className={
          "w-full md:w-80 lg:w-96 border-r border-base-300 flex-col " +
          (targetUserId ? "hidden md:flex" : "flex")
        }
      >
        <div className="p-4 border-b border-base-300">
          <h1 className="text-xl font-semibold mb-3">Messages</h1>
          <input
            type="search"
            placeholder="Search connections"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-sm w-full bg-base-200 border-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll">
          {!connections && (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-sm opacity-60" />
            </div>
          )}

          {connections?.length === 0 && (
            <div className="p-6 text-center">
              <p className="font-medium">No connections yet</p>
              <p className="text-sm opacity-70 mt-1">Connect with people on Discover to start chatting.</p>
              <Link to="/" className="btn btn-primary btn-sm mt-4">Discover</Link>
            </div>
          )}

          {connections?.length > 0 && filtered.length === 0 && (
            <p className="p-6 text-sm opacity-70 text-center">No one matches “{query}”.</p>
          )}

          <ul>
            {filtered.map((connection) => (
              <li key={connection._id}>
                <NavLink
                  to={"/chat/" + connection._id}
                  className={({ isActive }) =>
                    "flex items-center gap-3 px-4 py-3 border-b border-base-300/60 transition-colors " +
                    (isActive ? "bg-base-200" : "hover:bg-base-200/60")
                  }
                >
                  <Avatar user={connection} size={44} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {connection.firstName} {connection.lastName}
                    </p>
                    <p className="text-sm opacity-60 truncate">
                      {connection.about || connection.skills?.join(", ") || "Say hi 👋"}
                    </p>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ---------- Right: chat ---------- */}
      <section className={"flex-1 min-w-0 " + (targetUserId ? "flex" : "hidden md:flex")}>
        {targetUserId ? (
          // key → dusri chat kholne pe Chat component poora reset (purane messages nahi dikhte)
          <Chat key={targetUserId} />
        ) : (
          <div className="m-auto text-center px-6">
            <p className="font-serif text-2xl">Pick a conversation</p>
            <p className="opacity-60 mt-1">Choose someone from the list to start chatting.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Connections;
