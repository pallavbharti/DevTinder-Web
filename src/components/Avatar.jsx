// Photo ho toh photo, warna naam ke initials.
// Pehle bahar ki website (ui-avatars / iran.liara) se image aati thi —
// woh site down ho toh tooti image dikhti thi. Ab sab local hai.

const TONES = ["#c9a27e", "#a8b59a", "#d4a59a", "#9fb4c7", "#c7b38a", "#b8a1c4"];

const toneFor = (name = "") => {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return TONES[sum % TONES.length];
};

const Avatar = ({ user, size = 40, className = "" }) => {
  const first = user?.firstName || "";
  const last = user?.lastName || "";
  const initials = ((first[0] || "") + (last[0] || "")).toUpperCase() || "?";
  const photo = user?.photoUrl;
  // backend ka default "User-Profile-PNG" bhi generic hai — usko initials se behtar dikhate hain
  const hasRealPhoto = photo && !photo.includes("pngall.com");

  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (hasRealPhoto) {
    return (
      <img
        src={photo}
        alt={`${first} ${last}`}
        style={style}
        className={`rounded-full object-cover shrink-0 bg-base-300 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={`${first} ${last}`}
      style={{ ...style, backgroundColor: toneFor(first + last) }}
      className={`rounded-full shrink-0 grid place-items-center font-semibold text-[#2b241e] ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
