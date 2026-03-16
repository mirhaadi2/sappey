import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeSlash, User, Envelope, Lock } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const AuthModal: React.FC = () => {
    const { 
        authModal, 
        openAuthModal, 
        closeAuthModal, 
        signIn, 
        signUp,
        signInLoading,
        signUpLoading,
        signInError,
        signUpError
    } = useAuth();
    const isOpen = authModal !== null;
    const isSignIn = authModal === "signin";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const loading = isSignIn ? signInLoading : signUpLoading;
    const error = isSignIn ? signInError : signUpError;

    useEffect(() => {
        setName("");
        setEmail("");
        setPassword("");
        setShowPassword(false);
    }, [authModal]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || (!isSignIn && !name)) {
            return;
        }

        if (password.length < 6) {
            return;
        }

        if (isSignIn) {
            signIn(email, password);
        } else {
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            signUp(email, password, firstName, lastName);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => closeAuthModal()}
                        className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm"
                    />
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            key="modal"
                            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
                            initial={{ opacity:0, scale: 0.95, y: 16 }}
                            animate={{ opacity:1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div
                                className="relative w-full max-w-md bg-brand-cream rounded-2xl shadown-2xl p-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={closeAuthModal}
                                    className="absolute top-4 right-4 p-2 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>

                                <div className="mb-6 text-center">
                                    <span className="font-headline font-bold text-2xl text-brand-brown tracking-tight">
                                        Kruncho
                                    </span>
                                    <p className="mt-1 font-label text-sm text-gray-500">
                                        {isSignIn ? "Welcome back! Sign in to continue" : "Create your account to get started."}
                                    </p>
                                </div>

                                <div className="flex rounded-xl bg-brand-latte p-1 mb-6">
                                    {(["signin", "signup"] as const)?.map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => openAuthModal(mode)}
                                            className={`flex-1 py-2 rounded-lg font-label text-sm transition-all duration-200 cursor-pointer ${
                                                authModal === mode
                                                    ? "bg-brand-brown text-brand-cream shadown-sm"
                                                    : "text-brand-brown hover:text-brand-cocoa"
                                            }`}
                                        >
                                            {mode === "signin" ? "Sign In" : "Sign Up"}
                                        </button>
                                    ))} 
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                                    {!isSignIn && (
                                        <div className="relative">
                                            <User
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                value={name}
                                                onChange={(e) => setName(e?.target?.value)}
                                                className="w-full pl-9 py-3 rounded-xl border border-gray-200 bg-white font-label text-sm text-brand-brown placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 focus:border-brand-brown transition"
                                            />
                                        </div>
                                    )}  

                                    <div className="relative">
                                        <Envelope
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e?.target?.value)}
                                            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-label text-sm text-brand-brown placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 focus:border-brand-brown transition"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Lock
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e?.target?.value)}
                                            className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 bg-white font-label text-sm text-brand-brown placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 focus:border-brand-brown transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-brown transition-colors"
                                            aria-label={showPassword ? "Hide password": "Show password"}
                                        >
                                            {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {isSignIn && (
                                        <div className="text-right -mt-1">
                                            <button
                                                type="button"
                                                className="font-label text-xs text-brand-coca hover:text-brand-brown underline underline-offset-2 transition-colors"
                                            >   
                                                Forgot password?
                                            </button>
                                        </div>      
                                    )}

                                    {error && (
                                        <p className="font-label text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-1 w-full py-3 rounded-xl bg-brand-brown text-brand-cream font-label text-sm font-medium hover:bg-brand-cocoa active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed" 
                                    >
                                        {loading ? "Please wait..." : isSignIn ? "Sign In" : "Create Account"}
                                    </button>
                                </form>

                                <div className="flex items-center gap-3 my-5">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="font-label text-xs text-gray-400">or</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                <button
                                    type="button"
                                    className="w-full py-3 rounded-xl border border-gray-200 bg-white font-label text-sm text-brand-brown hover:bg-brand-latte transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
                                        className="w-5 h-5"
                                    />
                                    Continue with Google
                                </button>

                                <p className="mt-5 text-center font-label text-xs text-gray-500">
                                    {isSignIn ? "Don't have an account? ": "Already have an account? "}
                                    <button
                                        type="button"
                                        onClick={() => openAuthModal(isSignIn ? "signup" : "signin")}
                                        className="text-brand-brown font-medium underline underline-offset-2 hover:text-brand-cocoa transition-colors"
                                    >
                                        {isSignIn ? "Sign Up": "Sign In"}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;