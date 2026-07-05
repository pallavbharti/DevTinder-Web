import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [reviewedMap, setReviewedMap] = useState({});

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieves", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      setReviewedMap((prev) => ({ ...prev, [requestId]: status }));
      dispatch(removeRequest(requestId)); 
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests || requests.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <h2 className="text-xl font-bold">No pending requests</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-10 gap-4">
      <h2 className="text-2xl font-bold mb-4">Connection Requests</h2>
      {requests.map((request) => {
        const { firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;
        const reviewed = reviewedMap[request._id];

        return (
          <div
            key={request._id}
            className="flex items-center justify-between bg-base-300 w-96 p-4 rounded-xl shadow gap-4"
          >
            <img
              src={photoUrl || "https://avatar.iran.liara.run/public"}
              alt="user"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-bold">{firstName} {lastName}</p>
              {age && gender && <p className="text-sm">{age}, {gender}</p>}
              {about && <p className="text-sm">{about}</p>}
            </div>

            {reviewed ? (
              <p className={`font-semibold text-sm ${
                reviewed === "accepted" ? "text-green-500" : "text-red-500"
              }`}>
                {reviewed === "accepted" ? "Accepted ✅" : "Rejected ❌"}
              </p>
            ) : (
              <div className="flex gap-2">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Requests;