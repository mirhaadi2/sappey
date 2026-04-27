import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Envelope, Lock, WarningCircle, SignIn, Eye, EyeSlash } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useWebsiteAuth } from "../../context/WebsiteAuthContext";

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
  const { authModal, closeAuthModal, openAuthModal, signIn, signInLoading, signInError, user } = useWebsiteAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  // Handle successful login - close modal only
  useEffect(() => {
    if (user && isOpen) {
      setTimeout(() => {
        closeAuthModal();
        // Don't redirect to home - let user stay on current page
      }, 500);
    }
  }, [user, isOpen, closeAuthModal]);

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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAuthModal}
          />

          <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-brand-brown/10 p-[clamp(1.5rem,4vw,2rem)] overflow-hidden"
          >
            {/* Header Area */}
            <div className="flex justify-between items-start mb-[clamp(1.5rem,3vw,2.5rem)]">
              <div>
                <h2 className="text-[clamp(1.5rem,4vw,1.875rem)] font-extrabold text-brand-brown tracking-tight mb-[clamp(0.5rem,1vw,0.75rem)]">Sappey</h2>
                <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-500 font-medium">Welcome back! Please sign in to your account.</p>
              </div>
              <button onClick={closeAuthModal} className="p-[clamp(0.5rem,1vw,0.75rem)] hover:bg-gray-100 rounded-full transition-colors text-gray-400 min-h-10 min-w-10 flex items-center justify-center">
                <X size={20} weight="bold" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-[clamp(1rem,2vw,1.5rem)] bg-red-50 text-red-600 p-[clamp(0.75rem,1.5vw,1rem)] rounded-2xl flex items-center gap-3 border border-red-100"
                >
                  <WarningCircle size={18} weight="fill" />
                  <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onSubmit={handleSubmit(handleSignIn)} className="space-y-[clamp(1rem,2vw,1.25rem)]"
            >
              <div className="relative group">
                <div className="absolute left-[clamp(0.75rem,1.5vw,1rem)] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                  <Envelope size={18} weight="bold" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-[clamp(2.5rem,6vw,3rem)] pr-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.75rem,2vw,1rem)] bg-gray-50 border-2 border-transparent rounded-2xl focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all placeholder:text-[clamp(0.625rem,1.5vw,0.75rem)] placeholder:text-gray-400 font-medium text-[clamp(0.875rem,1.5vw,1rem)]"
                />
                {errors.email && (
                  <p className="text-[clamp(0.625rem,1.5vw,0.75rem)] text-red-500 mt-[clamp(0.4rem,0.8vw,0.5rem)] ml-1 font-semibold tracking-wide">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative group">
                <div className="absolute left-[clamp(0.75rem,1.5vw,1rem)] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                  <Lock size={18} weight="bold" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-[clamp(2.5rem,6vw,3rem)] pr-[clamp(2.5rem,6vw,3rem)] py-[clamp(0.75rem,2vw,1rem)] bg-gray-50 border-2 border-transparent rounded-2xl focus:border-brand-brown/20 focus:bg-white focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all placeholder:text-[clamp(0.625rem,1.5vw,0.75rem)] placeholder:text-gray-400 font-medium text-[clamp(0.875rem,1.5vw,1rem)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[clamp(0.5rem,1vw,0.75rem)] top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-brown transition-colors p-[clamp(0.25rem,0.5vw,0.5rem)]"
                >
                  {showPassword ? <Eye size={18} weight="bold" /> : <EyeSlash size={18} weight="bold" />}
                </button>
                {errors.password && (
                  <p className="text-[clamp(0.625rem,1.5vw,0.75rem)] text-red-500 mt-[clamp(0.4rem,0.8vw,0.5rem)] ml-1 font-semibold tracking-wide">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={signInLoading} className="w-full py-[clamp(0.6rem,1.5vw,0.75rem)] bg-brand-brown text-white rounded-2xl font-bold shadow-xl shadow-brand-brown/20 hover:bg-brand-brown/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-11 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                {signInLoading ? <Spinner /> : "Sign In"}
                {!signInLoading && <SignIn weight="bold" size={18} />}
              </button>
            </motion.form>

            {/* Footer - Switch to Sign Up */}
            <div className="mt-[clamp(1.5rem,3vw,2rem)] pt-[clamp(1rem,2vw,1.5rem)] border-t border-gray-100 text-center">
              <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-600 font-medium">
                Don't have an account?{" "}
                <button
                  onClick={() => openAuthModal("signup")}
                  className="text-brand-brown font-bold hover:underline transition-all"
                >
                  Sign up
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;