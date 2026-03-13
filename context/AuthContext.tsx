import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (name: string, email: string, pass: string) => Promise<void>;
    signOut: () => void;
    authModal: "signin" | "signup" | null;
    openAuthModal: (mode: "signin" | "signup") => void;
    closeAuthModal: (mode: "signin" | "signup") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [authModal, setAuthModal] = useState<"signin" | "signup" | null>(null);

    // useEffect(() => {
    //     const savedUser = localStorage.getItem("user");
    //     if (savedUser) {
    //         try {
    //             setUser(JSON.parse(savedUser));
    //         } catch (error) {
    //             console.error("Failed to parse user:", error);
    //         }
    //     }
    // }, []);

    // const login = async (email: string, pass: string) => {
    //     // Mock login logic - in a real app, this would be an API call
    //     const mockUser = { id: "1", name: "Guest User", email };
    //     setUser(mockUser);
    //     localStorage.setItem("user", JSON.stringify(mockUser));
    //     setIsAuthModalOpen(false);
    // };

    // const register = async (name: string, email: string, pass: string) => {
    //     // Mock register logic
    //     const mockUser = { id: "1", name, email };
    //     setUser(mockUser);
    //     localStorage.setItem("user", JSON.stringify(mockUser));
    //     setIsAuthModalOpen(false);
    // };

    // const logout = () => {
    //     setUser(null);
    //     localStorage.removeItem("user");
    // };

    const signIn = async (email: string, _password: string) => {
        setUser({ name: email.split("@")[0], email });
        setAuthModal(null);
    }

    const signUp = async (name: string, email: string, _password: string) => {
        setUser({ name, email });
        setAuthModal(null);
    }

    const openAuthModal = (mode: "signin" | "signup") => setAuthModal(mode);
    const closeAuthModal = () => setAuthModal(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signUp,
                signOut,
                authModal,
                openAuthModal,
                closeAuthModal,
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
