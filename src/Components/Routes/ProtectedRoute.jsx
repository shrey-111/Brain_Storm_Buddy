//import React from "react";
//import { Navigate, Outlet } from "react-router-dom";

//const ProtectedRoute = ({ currentUser }) => {
  //return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
//};

//export default ProtectedRoute;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ currentUser, children }) => {
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // ✅ If children exist (like SidebarLayout), render them
  return children ? children : <Outlet />;
};

export default ProtectedRoute;

