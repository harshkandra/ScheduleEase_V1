import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔐 Fake login - no backend call
  const login = async (email, password) => {
    // simulate a network delay
    await new Promise((r) => setTimeout(r, 500));

    // mock user object (normally decoded from JWT)
    const mockUser = {
      name: "Test User",
      email,
      role: email.includes("admin") ? "ADMIN" : "USER",
    };

    localStorage.setItem("mockUser", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  // 🆕 Fake register
  const register = async (data) => {
    // simulate a network delay
    await new Promise((r) => setTimeout(r, 500));
    console.log("Mock register:", data);
    return true;
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("mockUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
