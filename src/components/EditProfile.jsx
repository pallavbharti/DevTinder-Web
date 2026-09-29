import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");

  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age: Number(age),
          gender,
          about,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res?.data?.data));

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 my-8 px-4">

        {/* Edit Form */}
        <div className="card bg-base-300 w-full max-w-md shadow-lg">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-3">
              Edit Profile
            </h2>

            <label className="form-control w-full">
              <span className="label-text mb-1">First Name</span>
              <input
                type="text"
                value={firstName}
                className="input input-bordered w-full"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Last Name</span>
              <input
                type="text"
                value={lastName}
                className="input input-bordered w-full"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Photo URL</span>
              <input
                type="text"
                value={photoUrl}
                className="input input-bordered w-full"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="form-control w-full">
                <span className="label-text mb-1">Age</span>
                <input
                  type="number"
                  value={age}
                  className="input input-bordered w-full"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1">Gender</span>
                <input
                  type="text"
                  value={gender}
                  className="input input-bordered w-full"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1">About</span>
              <textarea
                value={about}
                className="textarea textarea-bordered w-full h-24"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            {error && (
              <p className="text-error text-sm text-center">
                {error}
              </p>
            )}

            <button
              className="btn btn-primary w-full mt-2"
              onClick={saveProfile}
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <p className="text-sm opacity-60 mb-2 text-center">
            Profile Preview
          </p>

          <UserCard
            user={{
              firstName,
              lastName,
              photoUrl,
              age,
              gender,
              about,
            }}
            showActions={false}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;