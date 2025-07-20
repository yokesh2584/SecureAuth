import { create } from "zustand";
import { type LoginSchema } from "@/lib/validations/login";
import { type RegisterSchema } from "@/lib/validations/register";
type OtpPurpose = "login" | "register" | "forgot-password";

type OtpState = {
  lastOtpPurpose: OtpPurpose | null;
  setLastOtpPurpose: (purpose: OtpPurpose) => void;
  clearLastOtpPurpose: () => void;
};

type RegisterState = {
  registerCredentials: RegisterSchema | null;
  setRegisterCredentials: (data: RegisterSchema) => void;
  clearRegisterCredentials: () => void;
};

type LoginState = {
  loginCredentials: LoginSchema | null;
  setLoginCredentials: (data: LoginSchema) => void;
  clearLoginCredentials: () => void;
};

type ForgotPasswordState = {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
};

type ResetVerifiedState = {
  resetVerified: boolean;
  setResetVerified: () => void;
  clearResetVerified: () => void;
};

export const useOtpStore = create<OtpState>((set) => ({
  lastOtpPurpose: null,
  setLastOtpPurpose: (purpose) => {
    set({ lastOtpPurpose: purpose });
  },
  clearLastOtpPurpose: () => {
    set({ lastOtpPurpose: null });
  },
}));

export const useRegisterStore = create<RegisterState>((set) => ({
  registerCredentials: null,
  setRegisterCredentials: (data) => {
    set({ registerCredentials: data });
  },
  clearRegisterCredentials: () => {
    set({ registerCredentials: null });
  },
}));

export const useLoginStore = create<LoginState>((set) => ({
  loginCredentials: null,
  setLoginCredentials: (data) => {
    set({ loginCredentials: data });
  },
  clearLoginCredentials: () => {
    set({ loginCredentials: null });
  },
}));

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  email: null,
  setEmail: (email) => {
    set({ email });
  },
  clearEmail: () => {
    set({ email: null });
  },
}));

export const useResetVerifiedStore = create<ResetVerifiedState>((set) => ({
  resetVerified: false,
  setResetVerified: () => {
    set({ resetVerified: true });
  },
  clearResetVerified: () => {
    set({ resetVerified: false });
  },
}));
