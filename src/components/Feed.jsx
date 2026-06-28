import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Feed = () => {
  const [users, setUsers] = useState(null);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL+"/user/feed", {
        withCredentials: true,
      });
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!users) return <h1 className="text-center mt-10">Loading...</h1>;

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <figure>
          <img
            src={users[0]?.photoUrl || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"}
            alt="user"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {users[0]?.firstName} {users[0]?.lastName}
          </h2>
          <p>{users[0]?.about || "No bio yet"}</p>
          <div className="card-actions justify-center gap-5 mt-4">
            <button className="btn btn-error">Ignore</button>
            <button className="btn btn-success"> Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;