import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { CardSkeleton } from "./ui/States";

const Profile = () => {
  const user = useSelector((store) => store.user);
  if (!user) return <div className="flex justify-center"><CardSkeleton /></div>;
  // key={user._id}: if a different user logs in, the form resets with their data
  return <EditProfile key={user._id} user={user} />;
};

export default Profile;
