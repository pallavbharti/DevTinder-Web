import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { CardSkeleton, EmptyState } from "./ui/States";
import { FlameIcon, RefreshIcon } from "./ui/Icons";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [swipe, setSwipe] = useState(""); // "" | "swipe-left" | "swipe-right"
  const [error, setError] = useState("");

  // Fetch + store. setState only runs in the async callback (after the request),
  // never synchronously inside the effect body.
  const getFeed = useCallback(
    () =>
      axios
        .get(BASE_URL + "/user/feed", { withCredentials: true })
        .then((res) => {
          setError("");
          dispatch(addFeed(res?.data?.data || []));
        })
        .catch(() => setError("Couldn't load the feed. Is the backend running?")),
    [dispatch]
  );

  // Fetch once the user is known and the feed isn't cached in Redux yet
  useEffect(() => {
    if (user && !feed) getFeed();
  }, [user, feed, getFeed]);

  const current = feed?.[0];

  const handleSendRequest = useCallback(
    async (status) => {
      if (!current || swipe) return;
      setSwipe(status === "interested" ? "swipe-right" : "swipe-left");
      try {
        await axios.post(
          `${BASE_URL}/request/send/${status}/${current._id}`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error(err);
      }
      // wait for the CSS animation, then remove the card from Redux
      setTimeout(() => {
        dispatch(removeUserFromFeed(current._id));
        setSwipe("");
      }, 350);
    },
    [current, swipe, dispatch]
  );

  // Keyboard shortcuts: ← ignore, → interested
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest("input, textarea")) return;
      if (e.key === "ArrowLeft") handleSendRequest("ignored");
      if (e.key === "ArrowRight") handleSendRequest("interested");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // cleanup!
  }, [handleSendRequest]);

  if (error) {
    return (
      <EmptyState
        icon={FlameIcon}
        title="Feed unavailable"
        text={error}
        action={<button className="btn btn-primary" onClick={getFeed}>Try again</button>}
      />
    );
  }

  if (!feed) {
    return (
      <div className="flex justify-center">
        <CardSkeleton />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <EmptyState
        icon={FlameIcon}
        title="You're all caught up"
        text="No more developers right now. Check back later for new profiles."
        action={
          <button className="btn btn-primary gap-2" onClick={getFeed}>
            <RefreshIcon className="w-4 h-4" /> Refresh feed
          </button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="font-mono text-xs text-base-content/50 mb-6">
        <span className="text-secondary">{feed.length}</span> devs in queue · use ← → keys
      </p>

      {/* Stack effect: faded cards behind the current one */}
      <div className="relative w-full max-w-sm">
        {feed.length > 2 && (
          <div className="absolute inset-x-6 -bottom-4 top-6 rounded-box bg-base-300/50 border border-base-content/5" />
        )}
        {feed.length > 1 && (
          <div className="absolute inset-x-3 -bottom-2 top-3 rounded-box bg-base-300/70 border border-base-content/5" />
        )}
        <div className="relative">
          <UserCard
            key={current._id}
            user={current}
            swipe={swipe}
            disabled={Boolean(swipe)}
            onIgnore={() => handleSendRequest("ignored")}
            onInterested={() => handleSendRequest("interested")}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;
