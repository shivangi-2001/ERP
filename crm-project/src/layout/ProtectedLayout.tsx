import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../app/store";

export default function ProtectedRoute() {
  // 
  const { access } = useSelector((state: RootState) => state.auth);
  if (!access) return <Navigate to="/signin" replace />;

  return <Outlet/>
}