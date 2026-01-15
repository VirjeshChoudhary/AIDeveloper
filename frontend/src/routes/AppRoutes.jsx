import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../screens/Home";
import Signup from "../screens/Signup";
import Login from "../screens/Login";
import UserProtectedWrapper from "../Wrapper/UserProtectedWrapper";
import Projects from "../screens/Projects";

const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <UserProtectedWrapper>
                <Home />
              </UserProtectedWrapper>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/project" element={<UserProtectedWrapper><Projects /></UserProtectedWrapper>} />
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;
