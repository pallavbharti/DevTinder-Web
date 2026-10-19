import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, avatarFor } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { PageHeader, EmptyState, ListSkeleton } from "./ui/States";
import { UsersIcon, ChatIcon, SearchIcon } from "./ui/Icons";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
        dispatch(addConnections(res.data.data));
      } catch (err) {
        console.error(err);
        dispatch(addConnections([]));
      }
    };
    fetchConnections();
  }, [dispatch]);

  // useMemo: only re-filter when the list or the search text changes
  const filtered = useMemo(() => {
    if (!connections) return [];
    const q = query.trim().toLowerCase();
    if (!q) return connections;
    return connections.filter((c) =>
      [c.firstName, c.lastName, c.about, ...(c.skills || [])]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [connections, query]);

  return (
    <section>
      <PageHeader
        tag="ls connections"
        title="Your connections"
        subtitle={connections ? `${connections.length} developers in your network` : "Loading your network…"}
        right={
          connections?.length > 0 && (
            <label className="input w-full sm:w-72 bg-base-200/60">
              <SearchIcon className="w-4 h-4 opacity-50" />
              <input
                type="search"
                placeholder="Search name or skill"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          )
        }
      />

      {!connections && <ListSkeleton rows={6} />}

      {connections?.length === 0 && (
        <EmptyState
          icon={UsersIcon}
          title="No connections yet"
          text="Head to the feed and tap the heart on developers you'd like to meet."
          action={<Link to="/" className="btn btn-primary">Go to feed</Link>}
        />
      )}

      {connections?.length > 0 && filtered.length === 0 && (
        <p className="text-center text-base-content/60 py-10 font-mono text-sm">
          no results for "{query}"
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <article
            key={c._id}
            className="glass-card rounded-box p-5 flex flex-col hover:-translate-y-1 hover:border-primary/40 transition animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center gap-4">
              <img
                alt={c.firstName}
                className="w-16 h-16 rounded-2xl object-cover ring-1 ring-base-content/10"
                src={c.photoUrl || avatarFor(c.firstName, c.lastName)}
              />
              <div className="min-w-0">
                <h2 className="font-semibold text-lg truncate">
                  {c.firstName} {c.lastName}
                </h2>
                {(c.age || c.gender) && (
                  <p className="font-mono text-xs text-base-content/50 uppercase">
                    {[c.age, c.gender].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-base-content/70 mt-4 line-clamp-2 flex-1">{c.about}</p>

            {c.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.skills.slice(0, 4).map((s) => (
                  <span key={s} className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-secondary/10 text-secondary">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <Link to={"/chat/" + c._id} className="btn btn-primary btn-sm mt-5 gap-2">
              <ChatIcon className="w-4 h-4" /> Message
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Connections;
