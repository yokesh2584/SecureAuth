import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosPrivate from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { PurpleInput } from "@/components/ui/purple-input";
import { toast } from "sonner";
import {
  useForgotPasswordStore,
  useOtpStore,
} from "@/stores/verificationStore";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async () => {
    if (email.trim().length === 0) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      const response = await axiosPrivate.post("/auth/pre-login-check", {
        email,
      });

      if (response.status === 200) {
        useForgotPasswordStore.getState().setEmail(email);
        useOtpStore.getState().setLastOtpPurpose("forgot-password");
        navigate("/verify-email");
        toast.success("Redirecting to OTP page...");
      }
    } catch (error) {
      toast.error("Email doesn't exist to reset password.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-400 px-4 sm:px-6">
      <section className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm transition-all sm:p-10">
        <h1 className="mb-3 text-center text-3xl font-bold text-purple-700">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter the email linked to your account and we’ll send you a one-time
          password to reset it.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailSubmit();
          }}
          className="space-y-4"
        >
          <PurpleInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for OTP"
            required
          />

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-md bg-purple-600 py-3 text-white transition hover:bg-purple-700"
          >
            Send OTP
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="cursor-pointer font-medium text-purple-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
