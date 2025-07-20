import { useAuthStore } from "@/stores/authStore";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 px-4 pt-20 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-purple-400/40">
        <h1 className="mb-6 text-3xl font-bold text-white drop-shadow-md">
          Profile Details
        </h1>

        <div className="space-y-3 text-lg font-medium text-white/90">
          <p>
            <span className="font-semibold text-white">Name:</span> {user?.name}
          </p>
        </div>
        <div className="space-y-3 text-lg font-medium text-white/90">
          <p>
            <span className="font-semibold text-white">Email:</span>{" "}
            {user?.email}
          </p>
        </div>

        <DeleteAccountDialog />
      </section>
    </main>
  );
};

export default Profile;
