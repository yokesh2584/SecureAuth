import { fetchUsersData } from "../api/user";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaShieldAlt, FaUsers } from "react-icons/fa";
import type { User } from "@/stores/authStore";

const Home = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersData,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <p className="mt-64 animate-pulse text-center text-xl font-semibold text-gray-300">
        Loading users...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-64 text-center text-xl font-semibold text-red-500">
        Error fetching users: {(error as Error).message}
      </p>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 px-4 pt-20 text-white">
      <section className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-purple-400/40">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          Welcome to SecureZone
        </h1>
        <p className="mb-6 text-base font-medium text-white/80">
          A modern secure authentication system with token-based flow, email
          verification, and session protection.
        </p>

        <div className="mb-6 flex justify-center gap-6 text-4xl text-white/90">
          <FaShieldAlt className="drop-shadow-lg" />
          <FaUsers className="drop-shadow-lg" />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer rounded-lg bg-white px-5 py-2 font-medium text-purple-700 shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:text-purple-800">
              Show All Users
            </Button>
          </DialogTrigger>

          <DialogContent className="animate-fade-in-up max-h-[70vh] w-full max-w-lg overflow-auto rounded-2xl border border-gray-200 bg-white/90 p-6 text-black shadow-2xl backdrop-blur-md">
            <DialogTitle className="mb-4 text-center text-2xl font-bold text-purple-700">
              Registered Users
            </DialogTitle>

            {users.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No users found.
              </p>
            ) : (
              <ul className="space-y-4">
                {users.map((user: User, index: number) => (
                  <li
                    key={index}
                    className="rounded-xl bg-gray-50 px-5 py-4 text-sm shadow-md transition hover:bg-gray-100"
                  >
                    <p className="text-gray-800">
                      <span className="font-semibold text-purple-600">
                        Name:
                      </span>{" "}
                      {user.name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
};

export default Home;
