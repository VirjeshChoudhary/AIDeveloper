
import axios from "../config/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const UserProtectedWrapper = ({children}) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isLoading,setIsLoading]=useState(true);
  useEffect(() => {
    if(!token) {
      console.log("No token found, redirecting to login...");
      navigate("/login");
      return;
    }
    axios.get(`/users/profile`)
      .then((response) => {
        // console.log("User profile data:", response.data.user);
        if(response.status===200){
            setIsLoading(false);
            setUser(response.data.user);
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate, setUser]);
   if(isLoading){
        return <div>Loading...</div>
    }
  return <div>{children}</div>;
};

export default UserProtectedWrapper;
