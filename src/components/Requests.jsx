import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, avatarFor } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { removeConnections } from "../utils/connectionSlice";
import { PageHeader, EmptyState, ListSkeleton } from "./ui/States";
import { InboxIcon, CheckIcon, XIcon } from "./ui/Icons";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/recieves", { withCredentials: true });
        dispatch(addRequests(res.data.data));
      } catch (err) {
        console.error("Error fetching requests:", err);
        dispatch(addRequests([]));
      }
    };
    fetchRequests();
  }, [dispatch]);

  const reviewRequest = async (status, requestId) => {
    setBusyId(requestId);
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
      // a new connection may exist now → let Connections refetch fresh data
      if (status === "accepted") dispatch(removeConnections());
    } catch (err) {
      console.error("Error reviewing request:", err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section>
      <PageHeader
        tag="cat requests --pending"
        title="Connection requests"
        subtitle={requests ? `${requests.length} pending` : "Checking your inbox…"}
      />

      {!requests && <ListSkeleton rows={3} />}

      {requests?.length === 0 && (
        <EmptyState
          icon={InboxIcon}
          title="Inbox zero 🎉"
          text="No pending requests. When someone is interested in you, they'll show up here."
          action={<Link to="/" className="btn btn-primary">Browse developers</Link>}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {requests?.map((request, i) => {
          const { firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId;
          const busy = busyId === request._id;
          return (
            <article
              key={request._id}
              className="glass-card rounded-box p-5 flex gap-4 items-start animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <img
                src={photoUrl || avatarFor(firstName, lastName)}
                alt={firstName}
                className="w-16 h-16 rounded-2xl object-cover ring-1 ring-base-content/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg truncate">{firstName} {lastName}</h2>
                  <span className="hidden sm:inline-flex badge badge-accent badge-soft badge-sm">wants to connect</span>
                </div>
                {(age || gender) && (
                  <p className="font-mono text-xs text-base-content/50 uppercase">
                    {[age, gender].filter(Boolean).join(" · ")}
                  </p>
                )}
                {about && <p className="text-sm text-base-content/70 mt-2 line-clamp-2">{about}</p>}
                {skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.slice(0, 4).map((s) => (
                      <span key={s} className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-secondary/10 text-secondary">{s}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-success gap-1"
                    disabled={busy}
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    <CheckIcon className="w-4 h-4" /> Accept
                  </button>
                  <button
                    className="btn btn-sm btn-ghost text-error gap-1"
                    disabled={busy}
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    <XIcon className="w-4 h-4" /> Decline
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Requests;
