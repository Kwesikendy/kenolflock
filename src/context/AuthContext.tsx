"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserRole, UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  demoLogin: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  Admin: {
    uid: "demo_admin_001",
    email: "pastor@kenolflock.org",
    displayName: "Rev. Kenol (Senior Pastor)",
    role: "Admin"
  },
  Finance: {
    uid: "demo_finance_002",
    email: "finance@kenolflock.org",
    displayName: "Deaconess Sarah (Financial Secretary)",
    role: "Finance"
  },
  Pastor: {
    uid: "demo_pastor_003",
    email: "care@kenolflock.org",
    displayName: "Pastor David (Pastoral Care)",
    role: "Pastor"
  },
  Member: {
    uid: "demo_member_004",
    email: "member@kenolflock.org",
    displayName: "John Doe (Regular Member)",
    role: "Member"
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has an active demo role saved in local storage first
    if (typeof window !== "undefined") {
      const savedDemoRole = localStorage.getItem("kenol_demo_role") as UserRole | null;
      if (savedDemoRole && DEMO_PROFILES[savedDemoRole]) {
        setUser(DEMO_PROFILES[savedDemoRole]);
        setLoading(false);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      // If we are currently in demo mode, do not override with null if offline or unauthenticated
      const savedDemoRole = typeof window !== "undefined" ? localStorage.getItem("kenol_demo_role") as UserRole | null : null;
      if (savedDemoRole && DEMO_PROFILES[savedDemoRole]) {
        setLoading(false);
        return;
      }

      if (firebaseUser) {
        // Determine role based on email or default to Member
        let assignedRole: UserRole = "Member";
        const emailLower = firebaseUser.email?.toLowerCase() || "";
        if (emailLower.includes("admin") || emailLower.includes("pastor@")) assignedRole = "Admin";
        else if (emailLower.includes("finance") || emailLower.includes("treasury")) assignedRole = "Finance";
        else if (emailLower.includes("care@") || emailLower.includes("pastor")) assignedRole = "Pastor";

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "user@kenolflock.org",
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Church Member",
          role: assignedRole,
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(DEMO_PROFILES["Admin"]); // Default to Admin demo profile so users aren't locked out before logging in
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("kenol_demo_role");
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const demoLogin = (role: UserRole) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kenol_demo_role", role);
    }
    setUser(DEMO_PROFILES[role]);
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kenol_demo_role");
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase sign out warning:", err);
    } finally {
      // Switch to a clean unauthenticated state or re-redirect to login
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
