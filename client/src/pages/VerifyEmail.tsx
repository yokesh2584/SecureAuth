import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/utils/axios";
import { OtpInput } from "@/components/ui/otp-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  useOtpStore,
  useRegisterStore,
  useLoginStore,
  useForgotPasswordStore,
  useResetVerifiedStore,
} from "@/stores/verificationStore";

type flowType = "register" | "login" | "forgot-password";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [reSending, setReSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [coolDown, setCoolDown] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flow, setFlow] = useState<flowType>("register");

  useEffect(() => {
    const flowState = useOtpStore.getState().lastOtpPurpose;
    if (!flowState) {
      toast.error("Something went wrong, please try again.");
      navigate("/");
      return;
    }
    setFlow(flowState);
    sendOtp(flowState);
  }, []);

  useEffect(() => {
    if (/^\d{6}$/.test(otp)) {
      verifyOtp();
    }
  }, [otp]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (coolDown && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCoolDown(false);
      setTimer(59);
    }

    return () => clearInterval(interval);
  }, [coolDown, timer]);

  const coolDownTimerFunc = () => {
    setCoolDown(true);
    setTimer(59);
  };

  const sendOtp = async (flow: flowType, isReSend?: boolean) => {
    if (isReSend) {
      setReSending(true);
      coolDownTimerFunc();
    } else {
      setSending(true);
    }

    let email;
    if (flow === "register") {
      email = useRegisterStore.getState().registerCredentials?.email!;
    } else if (flow === "login") {
      email = useLoginStore.getState().loginCredentials?.email!;
    } else if (flow === "forgot-password") {
      email = useForgotPasswordStore.getState().email!;
    }

    try {
      const response = await axiosPrivate.post("/otp/send-otp", {
        email: email,
        purpose: flow,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      isReSend ? setReSending(false) : setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP!");

    setVerifying(true);
    let email;
    if (flow === "register") {
      email = useRegisterStore.getState().registerCredentials?.email!;
    } else if (flow === "login") {
      email = useLoginStore.getState().loginCredentials?.email!;
    } else if (flow === "forgot-password") {
      email = useForgotPasswordStore.getState().email!;
    }

    try {
      const response = await axiosPrivate.post("/otp/verify-otp", {
        email: email,
        purpose: flow,
        otp: otp.trim(),
      });
      toast.success(response.data.message);

      if (flow === "register") {
        const { name, email, password } =
          useRegisterStore.getState().registerCredentials!;
        await useAuthStore.getState().register(name, email, password);
        navigate("/");
      } else if (flow === "login") {
        const { email, password } = useLoginStore.getState().loginCredentials!;
        await useAuthStore.getState().login(email, password);
        navigate("/");
      } else if (flow === "forgot-password") {
        useResetVerifiedStore.getState().setResetVerified();
        navigate("/reset-password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      setOtp("");
      document.querySelector("input")?.focus();
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-400 px-4 sm:px-6">
      <section className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        <h1 className="mb-3 text-center text-3xl font-bold text-purple-700">
          Email Verification
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          We’ve sent a one-time password to your email. Enter it below to
          continue.
        </p>

        <div className="mb-4">
          <OtpInput value={otp} onChange={setOtp} autoFocus />
        </div>

        <Button
          onClick={verifyOtp}
          disabled={verifying || sending || reSending}
          className="w-full cursor-pointer rounded-md bg-purple-600 py-3 text-white transition hover:bg-purple-700"
        >
          {verifying ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify"
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={() => sendOtp(flow, true)}
          disabled={sending || reSending || coolDown}
          className="mt-3 w-full cursor-pointer text-sm text-purple-600 hover:text-purple-700 hover:underline"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending...
            </span>
          ) : reSending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Resending...
            </span>
          ) : coolDown ? (
            <span>Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
          ) : (
            <span>Resend OTP</span>
          )}
        </Button>
      </section>
    </main>
  );
};

export default VerifyEmail;
