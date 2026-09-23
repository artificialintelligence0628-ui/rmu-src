import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "../api";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | fail

  useEffect(() => {
    authApi
      .me()
      .then(() => setStatus("ok"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "checking") return <p className="p-10 text-gray-400">Checking session…</p>;
  if (status === "fail") return <Navigate to="/admin/login" replace />;
  return children;
}
