import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const readError = (err) => {
  const data = err?.response?.data;
  if (typeof data === "string") return data.replace(/^ERROR\s*:\s*/i, "");
  return data?.message || "Something went wrong!";
};

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  // backend ka default (generic) photo link box mein dikhane ka fayda nahi
  const [photoUrl, setPhotoUrl] = useState(
    user.photoUrl && !user.photoUrl.includes("pngall.com") ? user.photoUrl : ""
  );
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  // skills array hai, input mein comma se likhte hain: "React, Node, Docker"
  const [skillsText, setSkillsText] = useState((user.skills || []).join(", "));

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const skills = skillsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // BUG FIX: khaali photoUrl bhejne pe backend ka URL validator fail hota tha,
    // aur khaali age Number("") = 0 ban jaati thi. Ab sirf bhari hui fields jaati hain.
    const body = { firstName, lastName, about, skills };
    if (photoUrl.trim()) body.photoUrl = photoUrl.trim();
    if (age !== "") body.age = Number(age);
    if (gender) body.gender = gender;

    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", body, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      setError(readError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
        <form onSubmit={saveProfile} className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Your profile</h1>
              <p className="text-sm opacity-70">This is what other developers see on your card.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name">
                <input className="input w-full" value={firstName} required onChange={(e) => setFirstName(e.target.value)} />
              </Field>
              <Field label="Last name">
                <input className="input w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </Field>
            </div>

            <Field label="Photo URL" hint="Paste a link to an image. Leave empty to use your initials.">
              <input
                type="url"
                className="input w-full"
                placeholder="https://…"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Age">
                <input
                  type="number"
                  min="16"
                  max="100"
                  className="input w-full"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Field>
              {/* BUG FIX: pehle text box tha — backend sirf male/female/others leta hai */}
              <Field label="Gender">
                <select className="select w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Other</option>
                </select>
              </Field>
            </div>

            <Field label="Skills" hint="Separate with commas, e.g. React, Node.js, Docker">
              <input className="input w-full" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
            </Field>

            <Field label="About">
              <textarea
                className="textarea w-full h-28"
                maxLength={300}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              <span className="text-xs opacity-50 self-end">{about.length}/300</span>
            </Field>

            {error && <p role="alert" className="text-error text-sm">{error}</p>}

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving && <span className="loading loading-spinner loading-xs" />}
                Save changes
              </button>
            </div>
          </div>
        </form>

        {/* Live preview — type karte hi card update hota hai */}
        <div className="lg:w-80 lg:sticky lg:top-20">
          <p className="text-sm opacity-60 mb-2">Preview</p>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about, skills }}
            showActions={false}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile saved.</span>
          </div>
        </div>
      )}
    </>
  );
};

const Field = ({ label, hint, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium opacity-80">{label}</span>
    {children}
    {hint && <span className="text-xs opacity-55">{hint}</span>}
  </label>
);

export default EditProfile;
