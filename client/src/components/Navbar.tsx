import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaUserCircle, FaLock, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white/10 px-6 py-3 shadow-xl backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-purple-800 drop-shadow-sm transition-all hover:scale-105"
        >
          <FaLock className="text-purple-800" />
          <span>SecureAuth</span>
        </Link>

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group cursor-pointer rounded-full p-2 transition hover:bg-purple-100/30 focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <FaUserCircle
                size={28}
                className="text-purple-800 transition group-hover:scale-105"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-40 rounded-xl border border-purple-200 bg-white/80 p-1 text-sm shadow-lg backdrop-blur-md"
          >
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer rounded-md px-3 py-2 text-purple-700 transition hover:bg-purple-100"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-red-600 transition hover:bg-red-100"
            >
              <FaSignOutAlt />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
