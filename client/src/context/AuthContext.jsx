import {
  useState,
} from "react";

import { AuthContext } from "./auth-context";

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("codemind-user");
    const savedToken = localStorage.getItem("codemind-token");

    return savedUser && savedToken ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.log(error);
    localStorage.removeItem("codemind-user");
    localStorage.removeItem("codemind-token");

    return null;
  }
};

function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(getStoredUser);

  const [loading] =
    useState(false);

  // Login
  const login = (
    userData,
    token
  ) => {
    localStorage.setItem(
      "codemind-user",
      JSON.stringify(
        userData
      )
    );

    localStorage.setItem(
      "codemind-token",
      token
    );

    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(
      "codemind-user"
    );

    localStorage.removeItem(
      "codemind-token"
    );

    setUser(null);

    // Redirect
    window.location.href =
      "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
