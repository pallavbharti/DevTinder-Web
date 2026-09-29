import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showActions = true }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    skills,
  } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-80 rounded-xl overflow-hidden shadow-lg bg-base-300">
      <img
        className="w-full h-80 object-cover"
        src={
          photoUrl ||
          `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
        }
        alt={`${firstName} ${lastName}`}
      />

      <div className="px-6 py-4">
        <div className="font-bold text-xl">
          {firstName} {lastName}
        </div>

        {age && gender && (
          <p className="text-sm opacity-70 mt-1">
            {age}, {gender}
          </p>
        )}

        <p className="mt-3">
          {about || "No bio yet"}
        </p>

        {skills?.length > 0 && (
          <div className="mt-4">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="badge badge-outline mr-2 mb-2"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex justify-center gap-4 px-6 pb-6">
          <button
            className="btn btn-error"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            ✕ Ignore
          </button>

          <button
            className="btn btn-success"
            onClick={() => handleSendRequest("interested", _id)}
          >
            ✓ Interested
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;