import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import {
  onAuthStateChanged,
  getIdToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
  Auth as FirebaseAuth
} from "firebase/auth";
import { API_BASE } from "@/lib/api";
import { auth } from "@/lib/firebase";  // this is your Auth instance

interface AppUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  nationality?: string;
  language?: string;
  bio?: string;
  about?: string;
  gender?: string;
  age?: number;
  lifestyle?: string[];
  interest?: string[];
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch your Mongo-backed profile
  const fetchProfile = async (token: string) => {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to load profile");
    return (await res.json()) as AppUser;
  };

  // Re-fetch profile whenever Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as FirebaseAuth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const token = await getIdToken(fbUser, true);
          const profile = await fetchProfile(token);
          setUser(profile);
        } catch (err: any) {
          console.error("Error loading profile:", err);
          toast.error(err.message || "Could not load your profile");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/password login
  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(cred.user, true);
    const profile = await fetchProfile(token);
    setUser(profile);
    toast.success("Logged in successfully!");
  };

  // Email/password signup
  const signup = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Use the modular updateProfile helper
    await updateProfile(cred.user, { displayName: name });
    const token = await getIdToken(cred.user, true);
    const profile = await fetchProfile(token);
    setUser(profile);
    toast.success("Account created successfully!");
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success("Logged out successfully!");
  };

  // Google OAuth
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await getIdToken(result.user, true);
    const profile = await fetchProfile(token);
    setUser(profile);
    toast.success("Logged in with Google!");
  };

  // Facebook OAuth
  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await getIdToken(result.user, true);
    const profile = await fetchProfile(token);
    setUser(profile);
    toast.success("Logged in with Facebook!");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
      loginWithFacebook,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
