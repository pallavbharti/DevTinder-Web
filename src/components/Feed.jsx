import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  // feed null hai → fetch karo. "Check again" bhi bas feed ko null karta hai.
  useEffect(() => {
    if (feed) return;
    axios
      .get(BASE_URL + "/user/feed", { withCredentials: true })
      .then((res) => {
        setError("");
        dispatch(addFeed(res?.data?.data || []));
      })
      .catch(() => setError("Couldn't load developers. Try again in a moment."));
  }, [feed, dispatch]);

  const refresh = () => {
    setError("");
    dispatch(removeFeed());
  };

  if (error) {
    return (
      <Empty title="Something went wrong" text={error}>
        <button className="btn btn-primary btn-sm" onClick={refresh}>Try again</button>
      </Empty>
    );
  }

  if (!feed) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-md opacity-60" />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <Empty
        title="You're all caught up"
        text="You've seen everyone for now. New developers join every day, so check back later."
      >
        <button className="btn btn-primary btn-sm" onClick={refresh}>Check again</button>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm flex items-baseline justify-between mb-3">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <span className="text-sm opacity-60">{feed.length} to go</span>
      </div>
      {/* key = user id → naya card aate hi component reset hota hai */}
      <UserCard key={feed[0]._id} user={feed[0]} />
    </div>
  );
};

export const Empty = ({ title, text, children }) => (
  <div className="max-w-sm mx-auto text-center py-20">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="mt-2 opacity-70">{text}</p>
    {children && <div className="mt-5">{children}</div>}
  </div>
);

export default Feed;
