import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const ProtectedRoutes = ({ children }: { children: React.JSX.Element }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
