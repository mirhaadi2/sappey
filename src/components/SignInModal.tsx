import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Envelope, Lock, WarningCircle, SignIn
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
  />
);

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

const SignInModal: React.FC = () => {
  const { authModal, closeAuthModal, signIn, signInLoading, signInError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const isOpen = authModal === "signin";
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setError(null);
        reset();
      }, 400);
    }
  }, [isOpen, reset]);

  // Show mutation error when it occurs
  useEffect(() => {
    if (signInError) {
      const errorMessage = (signInError as any)?.response?.data?.message || "Invalid email or password. Please try again.";
      setError(errorMessage);
    }
  }, [signInError]);

  const handleSignIn = async (data: LoginData) => {
    setError(null);
    signIn(data.email, data.password);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            {/* Header Area */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-brown tracking-tight mb-1">Kruncho</h2>
                <p className="text-gray-500 font-medium">Welcome back! Please sign in to your account.</p>
              </div>
              <button onClick={closeAuthModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={24} weight="bold" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100"
                >
                  <WarningCircle size={20} weight="fill" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onSubmit={handleSubmit(handleSignIn)} className="space-y-5"
            >
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                  <Envelope size={20} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 ml-1 font-semibold tracking-wide">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 ml-1 font-semibold tracking-wide">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={signInLoading} className="w-full py-4.5 bg-brand-brown text-white rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:bg-brand-brown/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {signInLoading ? <Spinner /> : "Sign In"}
                {!signInLoading && <SignIn weight="bold" />}
              </button>
            </motion.form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;