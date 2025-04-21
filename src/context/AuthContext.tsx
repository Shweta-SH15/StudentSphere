
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  nationality?: string;
  interests?: string[];
  about?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_USER: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  nationality: 'United Kingdom',
  interests: ['Photography', 'Hiking', 'Cooking'],
  about: 'Economics student from London, looking to make new friends and explore the city.'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is saved in localStorage for persistence
    const savedUser = localStorage.getItem('immigrantConnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) { // Simple validation for demo
        setUser(MOCK_USER);
        localStorage.setItem('immigrantConnect_user', JSON.stringify(MOCK_USER));
        toast("Welcome back!", {
          description: "You've successfully logged in.",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast("Login Failed", {
        description: "Please check your credentials and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(MOCK_USER);
      localStorage.setItem('immigrantConnect_user', JSON.stringify(MOCK_USER));
      toast("Welcome via Google!", {
        description: "You've successfully logged in.",
      });
    } catch (error) {
      toast("Login Failed", {
        description: "Google login failed. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(MOCK_USER);
      localStorage.setItem('immigrantConnect_user', JSON.stringify(MOCK_USER));
      toast("Welcome via Facebook!", {
        description: "You've successfully logged in.",
      });
    } catch (error) {
      toast("Login Failed", {
        description: "Facebook login failed. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password) { // Simple validation for demo
        const newUser = { ...MOCK_USER, name, email };
        setUser(newUser);
        localStorage.setItem('immigrantConnect_user', JSON.stringify(newUser));
        toast("Welcome to ImmigrantConnect!", {
          description: "Your account has been created successfully.",
        });
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error) {
      toast("Signup Failed", {
        description: "Please check your information and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('immigrantConnect_user');
    toast("Logged out", {
      description: "You've been logged out successfully.",
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('immigrantConnect_user', JSON.stringify(updatedUser));
      toast("Profile Updated", {
        description: "Your profile information has been updated.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
