import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch , useSelector} from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect } from 'react'

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch(err) {
      console.error("Error fetching user data:", err);
      navigate("/login");  // ← cookie nahi hai toh login pe bhejo
    }
  }

  useEffect(() => {
  if(!userData) {
    fetchUser();
  }
}, []);

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer/>
    </>
  );
}

export default Body;