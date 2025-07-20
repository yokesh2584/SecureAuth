import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../stores/authStore";
import { PurpleInput } from "@/components/ui/purple-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/validations/login";
import { useLoginStore, useOtpStore } from "@/stores/verificationStore";
import axiosPrivate from "@/utils/axios";
import { Loader2 } from "lucide-react";
const LoginIllustration = import.meta.env.VITE_SIGNIN_SVG;

const Login = () => {
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
    control,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await axiosPrivate.post("/auth/pre-login-check", {
        email: data.email,
      });

      if (response.status === 200) {
        useLoginStore.getState().setLoginCredentials(data);
        useOtpStore.getState().setLastOtpPurpose("login");
        navigate("/verify-email");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Sign In check failed";
      useAuthStore.getState().setError(errMsg);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4 text-white">
      <section className="flex w-full flex-col overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex w-full flex-col items-start justify-center p-6 sm:p-10 md:w-1/2 lg:p-12">
          <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-3xl font-extrabold text-transparent">
            SecureAuth
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Hello, welcome back
          </h1>
          <p className="mb-6 text-sm text-white/80">
            Hey, welcome back to your special place 💫
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <PurpleInput
              id="email"
              type="email"
              placeholder="your@gmail.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-300">{errors.email.message}</p>
            )}
            <PasswordInput
              id="password"
              placeholder="**********"
              {...register("password")}
              aria-invalid={!!errors.password}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-300">{errors.password.message}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="rememberMe"
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      id="checkbox"
                      checked={!!field.value}
                      onCheckedChange={(val) => field.onChange(!!val)}
                      className="cursor-pointer border-purple-400 data-[state=checked]:bg-purple-500"
                    />
                  )}
                />
                <Label htmlFor="checkbox" className="text-white/90">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="cursor-pointer font-medium text-purple-300 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            {error && (
              <p className="text-center text-sm font-medium text-red-300">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-semibold text-white transition-transform duration-300 hover:scale-[1.02] hover:from-purple-600 hover:to-indigo-600"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <p className="mt-6 w-full text-center text-sm text-white/80">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="cursor-pointer font-medium text-purple-300 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden w-full items-center justify-center rounded-l-3xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 lg:flex lg:w-1/2">
          <img
            src={LoginIllustration}
            alt="Login Illustration"
            className="w-full max-w-md"
          />
        </div>
      </section>
    </main>
  );
};

export default Login;
