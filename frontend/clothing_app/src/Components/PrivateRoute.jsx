import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("access");  // Check if token exists

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
