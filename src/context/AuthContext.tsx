import React, { createContext, useContext, useState } from "react";
import { useAuth as useAuthApi, User } from "../api/exports";

interface AuthContextType {
    user: User | null | undefined;
    loading: boolean;
    signIn: (email: string, password: string) => void;
    signUp: (email: string, password: string, firstName: string, lastName: string) => void;
    signOut: () => void;
    authModal: "signin" | "signup" | null;
    openAuthModal: (mode: "signin" | "signup") => void;
    closeAuthModal: () => void;
    // Loading states
    signInLoading: boolean;
    signUpLoading: boolean;
    signOutLoading: boolean;
    // Error states
    signInError: any;
    signUpError: any;
    signOutError: any;
}

// ✅ Default context value - always available (prevents undefined errors)
const defaultAuthValue: AuthContextType = {
    user: null,
    loading: false,
    signIn: () => console.warn("signIn called outside AuthProvider"),
    signUp: () => console.warn("signUp called outside AuthProvider"),
    signOut: () => console.warn("signOut called outside AuthProvider"),
    authModal: null,
    openAuthModal: () => console.warn("openAuthModal called outside AuthProvider"),
    closeAuthModal: () => console.warn("closeAuthModal called outside AuthProvider"),
    signInLoading: false,
    signUpLoading: false,
    signOutLoading: false,
    signInError: null,
    signUpError: null,
    signOutError: null,
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [authModal, setAuthModal] = useState<"signin" | "signup" | null>(null);

    // Use the authentication API hook
    const {
        user,
        isLoading,
        loginMutation,
        registerMutation,
        logoutMutation,
        profileQuery,
    } = useAuthApi();

    const signIn = (email: string, password: string) => {
        loginMutation.mutate({ email, password });
    };

    const signUp = (email: string, password: string, firstName: string, lastName: string) => {
        registerMutation.mutate({ email, password, firstName, lastName });
    };

    const signOut = () => {
        logoutMutation.mutate(undefined);
    };

    const openAuthModal = (mode: "signin" | "signup") => {
        setAuthModal(mode);
    };

    const closeAuthModal = () => {
        setAuthModal(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: isLoading,
                signIn,
                signUp,
                signOut,
                authModal,
                openAuthModal,
                closeAuthModal,
                signInLoading: loginMutation.isPending,
                signUpLoading: registerMutation.isPending,
                signOutLoading: logoutMutation.isPending,
                signInError: loginMutation.error,
                signUpError: registerMutation.error,
                signOutError: logoutMutation.error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    // ✅ Always returns a value - either real context or safe default
    if (!context) {
        console.warn("useAuth: Using default context (provider not found)");
        return defaultAuthValue;
    }
    return context;
};
