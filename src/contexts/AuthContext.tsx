import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAdmin: boolean; // Simple check for now
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Admin check
    const isAdmin = currentUser?.email === "coderafroj@gmail.com";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => {
        return firebaseSignOut(auth);
    };

    const value = {
        currentUser,
        loading,
        logout,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
