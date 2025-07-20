import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosPrivate from "../utils/axios";
import { toast } from "sonner";
import {
  useLoginStore,
  useOtpStore,
  useRegisterStore,
} from "./verificationStore";

export type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: null | string;
  setError: (error: string | null) => void;
  setAccessToken: (token: string) => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      setError: (error: string | null) => set({ error }),
      setAccessToken: (token) => {
        set({ accessToken: token });
      },
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosPrivate.post(`/auth/register`, {
            name,
            email,
            password,
          });

          if (!response.data) {
            throw new Error("Invalid request");
          }

          const { user, token }: { user: User; token: string } = response.data;

          set({
            user: user,
            accessToken: token,
            isLoggedIn: true,
            isLoading: false,
          });

          toast.success("Account created!", {
            description: `Welcome ${user.name}!`,
            className:
              "border-l-4 border-purple-600 bg-purple-50 text-purple-800 shadow-lg",
          });

          useRegisterStore.getState().clearRegisterCredentials();
          useOtpStore.getState().clearLastOtpPurpose();
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            (error instanceof Error ? error.message : "register failed!");
          set({ error: errorMessage, isLoading: false });
          toast.error("Register failed", {
            description: errorMessage,
            className:
              "border-l-4 border-red-600 bg-red-50 text-red-800 shadow-lg",
          });
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosPrivate.post(`/auth/login`, {
            email,
            password,
          });

          if (!response.data) {
            throw new Error("Invalid request");
          }

          const { user, token }: { user: User; token: string } = response.data;

          set({
            user: user,
            accessToken: token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });

          toast.success("Welcome back!!", {
            description: `Hello again, ${user.name}!`,
            className:
              "border-l-4 border-purple-600 bg-purple-50 text-purple-800 shadow-lg",
          });

          useLoginStore.getState().clearLoginCredentials();
          useOtpStore.getState().clearLastOtpPurpose();
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            (error instanceof Error ? error.message : "login failed!");
          set({ error: errorMessage, isLoading: false });
          toast.error("Login failed", {
            description: errorMessage,
            className:
              "border-l-4 border-red-600 bg-red-50 text-red-800 shadow-lg",
          });
        }
      },
      logout: async () => {
        set({
          user: null,
          accessToken: null,
          isLoggedIn: false,
          isLoading: false,
          error: null,
        });
        await axiosPrivate.post("/auth/logout");
        toast("You've been logged out", {
          description: "Hope to see you again!",
        });
      },
    }),
    {
      name: "Auth-Storage",
    },
  ),
);
