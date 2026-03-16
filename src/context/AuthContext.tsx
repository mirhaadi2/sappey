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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

    // Handle successful authentication
    React.useEffect(() => {
        if (user && authModal) {
            closeAuthModal();
            // Optional: redirect to dashboard or home
            // window.location.href = '/dashboard';
        }
    }, [user, authModal]);

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
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
