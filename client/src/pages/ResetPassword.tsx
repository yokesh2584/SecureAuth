import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/utils/axios";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/validations/reset-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForgotPasswordStore,
  useResetVerifiedStore,
} from "@/stores/verificationStore";

const ResetPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data: ResetPasswordSchema) => {
    const email = useForgotPasswordStore.getState().email;
    const verified = useResetVerifiedStore.getState().resetVerified;

    if (email === null || !verified) {
      toast.error("Something went wrong, please try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      const response = await axiosPrivate.post("/auth/reset-password", {
        email,
        verified,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        useForgotPasswordStore.getState().clearEmail();
        useResetVerifiedStore.getState().clearResetVerified();
        navigate("/login");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Password reset failed.";
      toast.error(errMsg);
      navigate("/forgot-password");
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-400 px-4 sm:px-6">
      <section className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        <h1 className="mb-3 text-center text-3xl font-bold text-purple-700">
          Set a New Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          You're just one step away from regaining access.
          <br className="hidden sm:block" />
          Please enter and confirm your new password.
        </p>

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="w-full space-y-5"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword" className="text-sm text-gray-700">
              New Password
            </Label>
            <PasswordInput
              id="newPassword"
              placeholder="Create a strong password"
              {...register("newPassword")}
              aria-invalid={!!errors.newPassword}
              required
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="confirmNewPassword"
              className="text-sm text-gray-700"
            >
              Confirm Password
            </Label>
            <PasswordInput
              id="confirmNewPassword"
              placeholder="Re-enter your new password"
              {...register("confirmNewPassword")}
              aria-invalid={!!errors.confirmNewPassword}
              required
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button className="w-full cursor-pointer rounded-md bg-purple-600 py-3 text-white transition hover:bg-purple-700">
            Reset My Password
          </Button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
