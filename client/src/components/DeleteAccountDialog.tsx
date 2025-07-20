import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import axiosPrivate from "@/utils/axios";
import { useState } from "react";

export function DeleteAccountDialog() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.email) {
      toast.error("Something went wrong, please try again!");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.delete("/auth/delete-user", {
        data: { email: user.email },
      });
      toast.success("Account deleted successfully.");
      logout();
      navigate("/register");
    } catch (error) {
      toast.error("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-4 cursor-pointer">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900 shadow-xl backdrop-blur-md">
        <h2 className="text-lg font-bold text-red-600">
          Confirm Account Deletion
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you absolutely sure? This action <strong>cannot be undone</strong>
          . Your account and all related data will be permanently deleted.
        </p>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
