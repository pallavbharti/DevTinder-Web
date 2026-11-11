import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { removeConnections } from "../utils/connectionSlice";
import Avatar from "./Avatar";
import { Empty } from "./Feed";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [busyId, setBusyId] = useState(null);

  // Har baar page khulne pe fresh list (koi naya request aaya ho)
  useEffect(() => {
    axios
      .get(BASE_URL + "/user/requests/recieves", { withCredentials: true })
      .then((res) => dispatch(addRequests(res.data.data)))
      .catch((err) => console.error("Error fetching requests:", err));
  }, [dispatch]);

  const reviewRequest = async (status, requestId) => {
    setBusyId(requestId);
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
      // BUG FIX: accept ke baad Messages mein naya connection nahi dikhta tha
      // (purani list cache mein thi). Ab cache clear → Messages fresh fetch karega.
      if (status === "accepted") dispatch(removeConnections());
    } catch (err) {
      console.error("Error reviewing request:", err);
    } finally {
      setBusyId(null);
    }
  };

  if (!requests) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-md opacity-60" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Empty title="No pending requests" text="When someone wants to connect with you, they'll show up here.">
        <Link to="/" className="btn btn-primary btn-sm">Discover developers</Link>
      </Empty>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Requests</h1>
      <p className="text-sm opacity-70 mb-5">
        {requests.length} {requests.length === 1 ? "person wants" : "people want"} to connect with you.
      </p>

      <ul className="flex flex-col gap-3">
        {requests.map((request) => {
          const from = request.fromUserId;
          // user delete ho chuka ho toh populate null deta hai
          if (!from) return null;
          const { firstName, lastName, age, gender, about, skills } = from;
          const busy = busyId === request._id;
          const details = [age, gender].filter(Boolean).join(" · ");

          return (
            <li key={request._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4 sm:flex-row sm:items-center gap-4">
                <Avatar user={from} size={56} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{firstName} {lastName}</p>
                  {details && <p className="text-sm opacity-60 capitalize">{details}</p>}
                  {about && <p className="text-sm opacity-80 mt-1 line-clamp-2">{about}</p>}
                  {skills?.length > 0 && (
                    <p className="text-xs opacity-60 mt-1">{skills.slice(0, 4).join(" · ")}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={busy}
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    Decline
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={busy}
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Requests;
