import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import { PageHeader } from "./ui/States";
import { XIcon } from "./ui/Icons";

const inputCls = "input w-full mt-1.5 bg-base-100/60 focus:border-primary";
const Label = ({ children }) => (
  <span className="font-mono text-xs text-base-content/60">{children}</span>
);

const EditProfile = ({ user }) => {
  // One state object instead of 7 separate useState calls
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    photoUrl: user.photoUrl || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    skills: user.skills || [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  // Generic change handler: input's `name` must match the key in `form`
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s) || form.skills.length >= 10) return;
    setForm((prev) => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      if (!payload.gender) delete payload.gender; // backend rejects empty gender
      const res = await axios.patch(BASE_URL + "/profile/edit", payload, { withCredentials: true });
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const msg = err?.response?.data;
      setError(typeof msg === "string" ? msg.replace(/^ERROR\s*:\s*/, "") : "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <PageHeader tag="vim profile.json" title="Edit profile" subtitle="This is how other developers will see you." />

      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
        <form onSubmit={saveProfile} className="glass-card rounded-box p-6 sm:p-8 space-y-5 animate-fade-up">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <Label>first_name</Label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} required />
            </label>
            <label className="block">
              <Label>last_name</Label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} />
            </label>
          </div>

          <label className="block">
            <Label>photo_url</Label>
            <input name="photoUrl" type="url" value={form.photoUrl} onChange={handleChange} className={inputCls} placeholder="https://…" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <Label>age</Label>
              <input name="age" type="number" min="18" max="100" value={form.age} onChange={handleChange} className={inputCls} />
            </label>
            <label className="block">
              <Label>gender</Label>
              <select name="gender" value={form.gender} onChange={handleChange} className="select w-full mt-1.5 bg-base-100/60">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </label>
          </div>

          <label className="block">
            <div className="flex justify-between">
              <Label>about</Label>
              <span className="font-mono text-xs text-base-content/40">{form.about.length}/300</span>
            </div>
            <textarea
              name="about"
              value={form.about}
              maxLength={300}
              onChange={handleChange}
              className="textarea w-full mt-1.5 h-28 bg-base-100/60 focus:border-primary"
            />
          </label>

          <div>
            <Label>skills ({form.skills.length}/10)</Label>
            <div className="flex gap-2 mt-1.5">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="input flex-1 bg-base-100/60 focus:border-primary"
                placeholder="React, Node.js… press Enter"
              />
              <button type="button" onClick={addSkill} className="btn btn-outline btn-secondary">Add</button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 font-mono text-xs pl-2.5 pr-1 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-error p-0.5" aria-label={`Remove ${s}`}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <div role="alert" className="alert alert-error alert-soft text-sm py-2">{error}</div>}

          <button type="submit" className="btn btn-primary btn-glow w-full" disabled={saving}>
            {saving && <span className="loading loading-spinner loading-sm" />}
            Save profile
          </button>
        </form>

        {/* Live preview — same UserCard as the feed, without action buttons */}
        <div className="lg:sticky lg:top-24 w-full lg:w-[24rem] mx-auto">
          <p className="font-mono text-xs text-base-content/50 mb-3 text-center">// live preview</p>
          <UserCard user={form} />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-lg">Profile saved successfully ✓</div>
        </div>
      )}
    </section>
  );
};

export default EditProfile;
