// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { toast } from "@/components/ui/sonner";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
//   nationality?: string;
//   interest?: string[];
//   about?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   loginWithFacebook: () => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   updateProfile: (data: Partial<User>) => void;
//   updateUser: (user: User) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('immigrantConnect_user');
//     const token = localStorage.getItem('immigrantConnect_token');
//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Login failed');

//       localStorage.setItem('immigrantConnect_token', data.token);
//       localStorage.setItem('immigrantConnect_user', JSON.stringify(data.user));
//       setUser(data.user);
//     } catch (error: any) {
//       toast.error(error.message || 'Login error');
//     }
//   };

//   const signup = async (name: string, email: string, password: string) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name, email, password })
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Signup failed');

//       await login(email, password); // auto-login after signup
//     } catch (error: any) {
//       toast.error(error.message || 'Signup error');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('immigrantConnect_token');
//     localStorage.removeItem('immigrantConnect_user');
//   };

//   const updateProfile = (data: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...data };
//       setUser(updatedUser);
//       localStorage.setItem('immigrantConnect_user', JSON.stringify(updatedUser));
//       toast("Profile Updated", {
//         description: "Your profile information has been updated.",
//       });
//     }
//   };

//   const updateUser = (updatedUser: User) => {
//     setUser(updatedUser);
//     localStorage.setItem("immigrantConnect_user", JSON.stringify(updatedUser));
//   };

//   const loginWithGoogle = async () => {
//     toast.error("Google login is not available yet.");
//   };

//   const loginWithFacebook = async () => {
//     toast.error("Facebook login is not available yet.");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         loading,
//         login,
//         signup,
//         logout,
//         updateProfile,
//         updateUser,
//         loginWithGoogle,
//         loginWithFacebook,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


`import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// User type with avatarConfig
interface User {
  _id: string;
  name: string;
  email: string;
  avatarConfig?: string;
  nationality?: string;
  interest?: string[];
  about?: string;
  language?: string;
  gender?: string;
  age?: number;
  lifestyle?: string[];
}

// Context type
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateUser: (user: User) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('immigrantConnect_user');
    const storedToken = localStorage.getItem('immigrantConnect_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('immigrantConnect_token', data.token);
      localStorage.setItem('immigrantConnect_user', JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
    } catch (error: any) {
      toast.error(error.message || 'Login error');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');

      await login(email, password); // auto-login after signup
    } catch (error: any) {
      toast.error(error.message || 'Signup error');
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('immigrantConnect_token');
    localStorage.removeItem('immigrantConnect_user');
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

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('immigrantConnect_user', JSON.stringify(updatedUser));
  };

  const loginWithGoogle = async () => {
    toast.error("Google login is not available yet.");
  };

  const loginWithFacebook = async () => {
    toast.error("Facebook login is not available yet.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        token,  
        login,
        signup,
        logout,
        updateProfile,
        updateUser,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
`