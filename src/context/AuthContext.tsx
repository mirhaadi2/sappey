import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth as useAuthApi, User } from "../api/exports";

interface AuthContextType {
    user: User | null | undefined;
    loading: boolean;
    signIn: (email: string, password: string) => void;
    signUp: (email: string, password: string, firstName: string, lastName: string) => void;
    signOut: () => void;
    authModal: "signin" | "signup" | "guest" | "customer" | null;
    openAuthModal: (mode: "signin" | "signup" | "guest" | "customer") => void;
    closeAuthModal: () => void;
    isGuestAuthenticated: boolean;
    guestDisplayName: string | null;
    setGuestAuthToken: (token: string) => void;
    clearGuestAuth: () => void;
    // Loading states
    signInLoading: boolean;
    signUpLoading: boolean;
    signOutLoading: boolean;
    // Error states
    signInError: Error | null;
    signUpError: Error | null;
    signOutError: Error | null;
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
    isGuestAuthenticated: false,
    guestDisplayName: null,
    setGuestAuthToken: () => console.warn("setGuestAuthToken called outside AuthProvider"),
    clearGuestAuth: () => console.warn("clearGuestAuth called outside AuthProvider"),
    signInLoading: false,
    signUpLoading: false,
    signOutLoading: false,
    signInError: null as Error | null,
    signUpError: null as Error | null,
    signOutError: null as Error | null,
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [authModal, setAuthModal] = useState<"signin" | "signup" | "guest" | "customer" | null>(null);
    const [guestDisplayName, setGuestDisplayName] = useState<string | null>(null);
    const [isGuestAuthenticated, setIsGuestAuthenticated] = useState(false);

    // Use the authentication API hook
    const {
        user,
        isLoading,
        loginMutation,
        registerMutation,
        logoutMutation,
    } = useAuthApi();

    const decodeJwtPayload = <T,>(token: string): T | null => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
                    .join('')
            );
            return JSON.parse(jsonPayload) as T;
        } catch {
            return null;
        }
    };

    const getGuestDisplayNameFromToken = (token: string) => {
        const payload = decodeJwtPayload<{ contact?: string }>(token);
        return payload?.contact ?? null;
    };

    const setGuestAuthToken = (token: string) => {
        localStorage.setItem('guest_token', token);
        setGuestDisplayName(getGuestDisplayNameFromToken(token));
        setIsGuestAuthenticated(true);
    };

    const clearGuestAuth = () => {
        localStorage.removeItem('guest_token');
        setGuestDisplayName(null);
        setIsGuestAuthenticated(false);
    };

    useEffect(() => {
        const existingToken = localStorage.getItem('guest_token');
        if (existingToken) {
            setGuestDisplayName(getGuestDisplayNameFromToken(existingToken));
            setIsGuestAuthenticated(true);
        }
    }, []);

    const signIn = (email: string, password: string) => {
        loginMutation.mutate({ email, password });
    };

    const signUp = (email: string, password: string, firstName: string, lastName: string) => {
        registerMutation.mutate({ email, password, firstName, lastName });
    };

    const signOut = () => {
        if (localStorage.getItem('auth_token')) {
            logoutMutation.mutate(undefined);
        }
        clearGuestAuth();
    };

    const openAuthModal = (mode: "signin" | "signup" | "guest" | "customer") => {
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
                isGuestAuthenticated,
                guestDisplayName,
                setGuestAuthToken,
                clearGuestAuth,
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
