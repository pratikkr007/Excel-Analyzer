import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, role }) {
  const { token, user } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" />;

  if (role && user?.role !== role) return <Navigate to="/" />;
  return children;
}

export default ProtectedRoute;
