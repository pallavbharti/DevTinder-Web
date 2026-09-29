import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log("CONNECTION DATA:", res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <h1 className="text-center my-10">
        No Connections Found
      </h1>
    );
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">
        Connections
      </h1>

      {connections.map((connection) => {
        const {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        } = connection;

        return (
          <div
            key={connection._id}
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={
                  photoUrl ||
                  `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
                }
              />
            </div>

            <div className="text-left mx-4 flex-1">
              <h2 className="font-bold text-xl">
                {firstName} {lastName}
              </h2>

              {age && gender && (
                <p>
                  {age}, {gender}
                </p>
              )}

              <p>{about}</p>

              <Link
                to={"/chat/" + connection._id}
                className="btn btn-primary btn-sm mt-2"
              >
                💬 Chat
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;