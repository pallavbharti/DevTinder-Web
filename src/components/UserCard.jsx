import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import Avatar from "./Avatar";

const UserCard = ({ user, showActions = true }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();
  const [busy, setBusy] = useState(false);

  const handleSendRequest = async (status, userId) => {
    // BUG FIX: pehle double-click se do request jaati thi → backend "already exists" error
    if (busy) return;
    setBusy(true);
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  const hasPhoto = photoUrl && !photoUrl.includes("pngall.com");
  const details = [age, gender].filter(Boolean).join(" · ");

  return (
    <article className="card bg-base-100 border border-base-300 w-full max-w-sm overflow-hidden">
      {hasPhoto ? (
        <img
          className="w-full h-72 object-cover bg-base-300"
          src={photoUrl}
          alt={`${firstName} ${lastName || ""}`}
        />
      ) : (
        <div className="h-48 bg-base-200 grid place-items-center">
          <Avatar user={{ firstName, lastName }} size={96} />
        </div>
      )}

      <div className="card-body gap-2">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">
            {firstName} {lastName}
          </h2>
          {details && <p className="text-sm opacity-60 capitalize">{details}</p>}
        </div>

        <p className="opacity-85">{about || "No bio yet."}</p>

        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {skills.map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded-md bg-base-200 text-sm">
                {skill}
              </span>
            ))}
          </div>
        )}

        {showActions && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              className="btn btn-outline"
              disabled={busy}
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Pass
            </button>
            <button
              className="btn btn-primary"
              disabled={busy}
              onClick={() => handleSendRequest("interested", _id)}
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default UserCard;
