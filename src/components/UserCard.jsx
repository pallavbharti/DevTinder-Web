import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
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
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-base-300">
      <img
        className="w-full"
        src={photoUrl || "https://avatar.iran.liara.run/public"}
        alt="user"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {firstName} {lastName}
        </div>
        <p className="text-base">
          {age && gender ? `${age}, ${gender}` : ""}
        </p>
        <p className="text-base mt-2">
          {about || "No bio yet"}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {skills?.map((skill, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{skill}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-5 pb-6">
        <button
          className="btn btn-error"
          onClick={() => handleSendRequest("ignored", _id)}
        >
          ❌ Ignore
        </button>
        <button
          className="btn btn-success"
          onClick={() => handleSendRequest("interested", _id)}
        >
          ✅ Interested
        </button>
      </div>
    </div>
  );
};

export default UserCard;