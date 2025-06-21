import { createContext, useState , useEffect } from "react";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;


const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const encrypted = localStorage.getItem("user");
    return encrypted ? decryptData(encrypted) : null;
  });

  const login = (userData) => {
    const encrypted = encryptData(userData);
    localStorage.setItem("user", encrypted);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};