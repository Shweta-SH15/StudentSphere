
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('immigrantConnect_user');
    const token = localStorage.getItem('immigrantConnect_token');
  
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
  
      localStorage.setItem('immigrantConnect_token', data.token);
      localStorage.setItem('immigrantConnect_user', JSON.stringify(data.user));
  
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message || 'Login error');
    }
  };
  
  const loginWithGoogle = async () => {
    toast.error('Google login is not available in this version.');
  };
  
  const loginWithFacebook = async () => {
    toast.error('Facebook login is not available in this version.');
  };
  

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
  
      // 🔁 Option 1: auto-login after signup
      await login(email, password);
  
      // 🔁 Option 2: manually notify user to login (comment out line above if using this)
      // toast.success('Signup successful! Please login.');
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message || 'Signup error');
    }
  };
  

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('immigrantConnect_user');
    localStorage.removeItem('immigrantConnect_token');
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
function setIsAuthenticated(arg0: boolean) {
  throw new Error('Function not implemented.');
}

