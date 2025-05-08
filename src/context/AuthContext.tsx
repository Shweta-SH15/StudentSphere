import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getIdToken,
  getAuth,
} from "firebase/auth";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  token: string;
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
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser, true);
        const currentUser: User = {
          _id: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          profileImage: firebaseUser.photoURL || "",
          token,
        };
        setUser(currentUser);
        localStorage.setItem("immigrantConnect_user", JSON.stringify(currentUser));
        localStorage.setItem("immigrantConnect_token", token);
      } else {
        setUser(null);
        localStorage.removeItem("immigrantConnect_user");
        localStorage.removeItem("immigrantConnect_token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(res.user, true);
      const currentUser: User = {
        _id: res.user.uid,
        name: res.user.displayName || "",
        email: res.user.email || "",
        profileImage: res.user.photoURL || "",
        token,
      };
      setUser(currentUser);
      localStorage.setItem("immigrantConnect_user", JSON.stringify(currentUser));
      localStorage.setItem("immigrantConnect_token", token);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  const getToken = async () => {
    const currentUser = getAuth().currentUser;
    return currentUser ? await currentUser.getIdToken(true) : null;
  };
  
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(res.user, true);
      const currentUser: User = {
        _id: res.user.uid,
        name,
        email: res.user.email || "",
        profileImage: res.user.photoURL || "",
        token,
      };
      setUser(currentUser);
      localStorage.setItem("immigrantConnect_user", JSON.stringify(currentUser));
      localStorage.setItem("immigrantConnect_token", token);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("immigrantConnect_user");
      localStorage.removeItem("immigrantConnect_token");
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await getIdToken(result.user, true);
      const currentUser: User = {
        _id: result.user.uid,
        name: result.user.displayName || "",
        email: result.user.email || "",
        profileImage: result.user.photoURL || "",
        token,
      };
      setUser(currentUser);
      localStorage.setItem("immigrantConnect_user", JSON.stringify(currentUser));
      localStorage.setItem("immigrantConnect_token", token);
      toast.success("Logged in with Google!");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await getIdToken(result.user, true);
      const currentUser: User = {
        _id: result.user.uid,
        name: result.user.displayName || "",
        email: result.user.email || "",
        profileImage: result.user.photoURL || "",
        token,
      };
      setUser(currentUser);
      localStorage.setItem("immigrantConnect_user", JSON.stringify(currentUser));
      localStorage.setItem("immigrantConnect_token", token);
      toast.success("Logged in with Facebook!");
    } catch (error: any) {
      toast.error(error.message || "Facebook login failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
