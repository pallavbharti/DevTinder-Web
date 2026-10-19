import { avatarFor } from "../utils/constants";
import { XIcon, HeartIcon } from "./ui/Icons";

/**
 * Pure presentational card. It does NOT call the API itself —
 * the parent (Feed) passes onIgnore / onInterested. That keeps the
 * card reusable (Feed + Profile preview) and easy to test.
 */
const UserCard = ({ user, onIgnore, onInterested, swipe = "", disabled = false }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const showActions = Boolean(onIgnore && onInterested);

  return (
    <article
      className={`swipe-card ${swipe} w-full max-w-sm glass-card ring-gradient rounded-box overflow-hidden shadow-2xl shadow-black/20`}
    >
      <div className="relative h-96">
        <img
          className="w-full h-full object-cover"
          src={photoUrl || avatarFor(firstName, lastName)}
          alt={`${firstName} ${lastName || ""}`}
          onError={(e) => {
            e.currentTarget.src = avatarFor(firstName, lastName);
          }}
        />
        {/* gradient so text is readable on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-2xl font-bold">
            {firstName || "Your"} {lastName || "Name"}
            {age ? <span className="font-normal opacity-80">, {age}</span> : null}
          </h2>
          {gender && (
            <p className="font-mono text-xs uppercase tracking-wider opacity-70 mt-1">{gender}</p>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-base-content/75 leading-relaxed line-clamp-3">
          {about || "No bio yet"}
        </p>

        {skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="font-mono text-xs px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/20"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {showActions && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              className="btn btn-circle btn-lg btn-outline border-error/40 text-error hover:bg-error hover:text-error-content hover:border-error"
              onClick={onIgnore}
              disabled={disabled}
              aria-label="Ignore"
              title="Ignore (←)"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <button
              className="btn btn-circle btn-lg border-0 bg-gradient-to-br from-accent to-primary text-white shadow-lg shadow-accent/30 hover:scale-105"
              onClick={onInterested}
              disabled={disabled}
              aria-label="Interested"
              title="Interested (→)"
            >
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default UserCard;
