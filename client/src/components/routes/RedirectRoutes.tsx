import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const RedirectRoutes = ({ children }: { children: React.JSX.Element }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Navigate to="/" /> : children;
};

export default RedirectRoutes;
