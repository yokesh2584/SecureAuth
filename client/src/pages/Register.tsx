import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../stores/authStore";
import { PurpleInput } from "@/components/ui/purple-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validations/register";
import axiosPrivate from "@/utils/axios";
import { useRegisterStore, useOtpStore } from "@/stores/verificationStore";
import { Loader2 } from "lucide-react";
const RegisterIllustration = import.meta.env.VITE_SIGNUP_SVG;

const Register = () => {
  useEffect(() => {
    useAuthStore.getState().setError(null);
  }, []);

  const navigate = useNavigate();

  const { isLoading, error } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
    })),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const response = await axiosPrivate.post("/auth/pre-register-check", {
        name: data.name,
        email: data.email,
      });

      if (response.status === 200) {
        useRegisterStore.getState().setRegisterCredentials(data);
        useOtpStore.getState().setLastOtpPurpose("register");
        navigate("/verify-email");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Sign Up check failed";
      useAuthStore.getState().setError(errMsg);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4 text-white sm:px-6 lg:px-8">
      <section className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md lg:flex-row-reverse">
        {/* Right Side - Form (flipped layout) */}
        <div className="flex w-full flex-col items-start justify-center p-6 sm:p-10 md:mx-auto md:w-2/3 md:p-12 lg:w-1/2">
          <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-3xl font-extrabold text-transparent">
            SecureAuth
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Create your account
          </h1>
          <p className="mb-6 text-sm text-white/80">
            Begin your journey to your special place 💫
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <PurpleInput
              id="name"
              type="text"
              placeholder="Your Name"
              {...register("name")}
              aria-invalid={!!errors.name}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-300">{errors.name.message}</p>
            )}
            <PurpleInput
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-300">{errors.email.message}</p>
            )}
            <PasswordInput
              id="password"
              placeholder="********"
              {...register("password")}
              aria-invalid={!!errors.password}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-300">{errors.password.message}</p>
            )}
            <PasswordInput
              id="confirmPassword"
              placeholder="********"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-300">
                {errors.confirmPassword.message}
              </p>
            )}

            {error && (
              <p className="text-center text-sm font-medium text-red-300">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <p className="mt-6 w-full text-center text-sm text-white/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-300 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Left Side - Illustration */}
        <div className="hidden w-full items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 lg:flex lg:w-1/2">
          <img
            src={RegisterIllustration}
            alt="Register Illustration"
            className="w-full max-w-md"
          />
        </div>
      </section>
    </main>
  );
};

export default Register;
