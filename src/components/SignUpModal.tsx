import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Envelope,
  Phone,
  ArrowLeft,
  Lock,
  ShieldCheck,
  WarningCircle,
  CaretRight,
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authentication/client";

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
  />
);

const getPasswordStrength = (pass: string): number => {
  let score = 0;
  if (!pass) return score;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

// --- VALIDATION SCHEMA ---
const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
});

type RegisterData = z.infer<typeof registerSchema>;

const SignUpModal: React.FC = () => {
  const { authModal, closeAuthModal, user } = useAuth();
  const [step, setStep] = useState<"info" | "otp" | "password">("info");
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isOpen = authModal === "signup";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const userData = watch();

  useEffect(() => {
    // Use 'ReturnType<typeof setInterval>' for absolute type safety
    // that adapts to the environment automatically.
    let interval: ReturnType<typeof setInterval> | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("info");
        setOtpValue(["", "", "", "", "", ""]);
        setPassword("");
        setConfirmPassword("");
        setError(null);
        reset();
      }, 400);
    }
  }, [isOpen, reset]);

  // Handle successful signup - close modal only (don't redirect)
  useEffect(() => {
    if (user && isOpen) {
      setTimeout(() => {
        closeAuthModal();
        // Don't redirect - let user stay on current page
      }, 500);
    }
  }, [user, isOpen, closeAuthModal]);

  // --- STEP 1 HANDLER ---
  const handleSendOtp = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      // Check if user exists
      await authApi.checkUser({ email: data.email, phone: data.phone });

      // Trigger OTP to EMAIL
      await authApi.initiateRegistration({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      setStep("otp");
      setTimer(30);
    } catch (err: unknown) {
      setError(
        err instanceof Object &&
          "response" in err &&
          typeof (err as any).response?.data?.message === "string"
          ? (err as any).response.data.message
          : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2 HANDLER ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.join("").length < 6) return;

    setLoading(true);
    setError(null);

    try {
      // CHANGED: Sending email instead of phone to the verification API
      await authApi.verifyOtp({
        email: userData.email,
        otp: otpValue.join(""),
      });

      setStep("password");
    } catch (err: unknown) {
      setError(
        err instanceof Object &&
          "response" in err &&
          typeof (err as any).response?.data?.message === "string"
          ? (err as any).response.data.message
          : "Invalid OTP",
      );
      setOtpValue(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3 HANDLER ---
  const handleCompleteRegistration = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.completeRegistration({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password,
      });

      // Close modal and let the session take over
      closeAuthModal();

      // Reset all states when registration completes
      setStep("info");
      setOtpValue(["", "", "", "", "", ""]);
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        err instanceof Object &&
          "response" in err &&
          typeof (err as any).response?.data?.message === "string"
          ? (err as any).response.data.message
          : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otpValue];
    newOtp[index] = element.value;
    setOtpValue(newOtp);
    if (element.nextSibling && element.value !== "")
      (element.nextSibling as HTMLInputElement).focus();
  };

  const strength = getPasswordStrength(password);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-brown/20 backdrop-blur-xl"
            onClick={closeAuthModal}
          />

          <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="relative w-full max-w-md bg-white border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-8 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-brown tracking-tight mb-1">
                  Sappey
                </h2>
                <div className="flex gap-1.5 mt-2">
                  <div
                    className={`h-1 w-6 rounded-full transition-all duration-300 ${step === "info" ? "bg-brand-brown" : "bg-brand-brown/20"}`}
                  />
                  <div
                    className={`h-1 w-6 rounded-full transition-all duration-300 ${step === "otp" ? "bg-brand-brown" : "bg-brand-brown/20"}`}
                  />
                  <div
                    className={`h-1 w-6 rounded-full transition-all duration-300 ${step === "password" ? "bg-brand-brown" : "bg-brand-brown/20"}`}
                  />
                </div>
              </div>
              <button
                onClick={closeAuthModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100"
                >
                  <WarningCircle size={20} weight="fill" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* STEP 1: INFO */}
              {step === "info" && (
                <motion.form
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit(handleSendOtp)}
                  className="space-y-5"
                >
                  <div className="mb-4">
                    <p className="text-gray-500 font-medium">
                      Create your account to get started.
                    </p>
                  </div>

                  {[
                    {
                      id: "name",
                      icon: <User size={20} />,
                      placeholder: "Full Name",
                      type: "text",
                    },
                    {
                      id: "email",
                      icon: <Envelope size={20} />,
                      placeholder: "Email Address",
                      type: "email",
                    },
                    {
                      id: "phone",
                      icon: <Phone size={20} />,
                      placeholder: "Phone Number",
                      type: "tel",
                    },
                  ].map((f) => (
                    <div key={f.id} className="relative group">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors[f.id as keyof RegisterData] ? "text-red-500" : "text-gray-400 group-focus-within:text-brand-brown"}`}
                      >
                        {f.icon}
                      </div>
                      <input
                        {...register(f.id as keyof RegisterData)}
                        type={f.type}
                        placeholder={f.placeholder}
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium ${errors[f.id as keyof RegisterData]
                            ? "border-red-500 focus:ring-red-50"
                            : "border-transparent focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5"
                          }`}
                      />
                      {errors[f.id as keyof RegisterData] && (
                        <p className="text-[11px] text-red-500 mt-1.5 ml-1 font-bold flex items-center gap-1">
                          <WarningCircle weight="fill" />{" "}
                          {errors[f.id as keyof RegisterData]?.message}
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-brown text-white rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:bg-brand-brown/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Spinner /> : "Continue"}
                    {!loading && <CaretRight weight="bold" />}
                  </button>
                </motion.form>
              )}

              {/* STEP 2: OTP (Email) */}
              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <button
                    onClick={() => setStep("info")}
                    className="flex items-center gap-2 text-brand-brown font-bold text-sm mb-6 hover:opacity-70 transition-opacity"
                  >
                    <ArrowLeft size={16} weight="bold" /> Back
                  </button>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Check your inbox
                  </h3>
                  <p className="text-gray-500 mb-10">
                    Verification code sent to <br />
                    <span className="font-bold text-gray-700">
                      {userData.email}
                    </span>
                  </p>

                  <div className="flex justify-between gap-2 mb-10">
                    {otpValue.map((val, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(e.target, i)}
                        className="w-full h-14 text-center text-xl font-bold border-2 border-gray-100 rounded-xl focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none bg-gray-50 transition-all"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otpValue.join("").length < 6}
                    className="w-full py-4.5 bg-brand-brown text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-brown/90 shadow-xl shadow-brand-brown/10 disabled:opacity-50 transition-all"
                  >
                    {loading ? <Spinner /> : "Verify Email"}
                  </button>

                  <div className="mt-8">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-400 font-medium">
                        Resend code in{" "}
                        <span className="text-brand-brown font-bold">
                          {timer}s
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={() => {
                          handleSendOtp(userData);
                        }}
                        className="text-sm text-brand-brown font-bold hover:underline transition-all"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PASSWORD */}
              {step === "password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Secure Account
                    </h3>
                    <p className="text-gray-500">
                      Create a password to complete your profile.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <Lock
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="relative group">
                      <Lock
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="px-1">
                      <div className="flex gap-1.5 h-1.5 mb-2">
                        {[1, 2, 3, 4].map((l) => (
                          <div
                            key={l}
                            className={`h-full flex-1 rounded-full transition-all duration-500 ${strength >= l ? (strength <= 1 ? "bg-red-400" : strength === 2 ? "bg-orange-400" : strength === 3 ? "bg-yellow-400" : "bg-green-500") : "bg-gray-100"}`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-gray-400">Security Strength</span>
                        <span
                          className={
                            strength <= 1
                              ? "text-red-500"
                              : strength === 2
                                ? "text-orange-500"
                                : strength === 3
                                  ? "text-yellow-600"
                                  : "text-green-600"
                          }
                        >
                          {
                            [
                              "Too Weak",
                              "Weak",
                              "Fair",
                              "Strong",
                              "Rock Solid",
                            ][strength]
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteRegistration}
                    disabled={
                      password.length < 8 ||
                      password !== confirmPassword ||
                      loading
                    }
                    className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-xl shadow-green-100 active:scale-[0.98] transition-all disabled:opacity-40"
                  >
                    <ShieldCheck size={24} weight="bold" />
                    {loading ? "Finalizing..." : "Complete Registration"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignUpModal;
