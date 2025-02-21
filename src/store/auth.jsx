import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const authorization_token = `Bearer ${token}`;
  const [API, setAPI] = useState(import.meta.env.VITE_APP_URI_API);
  const [quizId, setQuizId] = useState("");

  const storeTokenInLS = (servertoken) => {
    setToken(servertoken);

    return localStorage.setItem("token", servertoken);
  };

  const logout_user = () => {
    setToken("");
    setUser("");
    localStorage.removeItem("userInfo");
    return localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    try {
      const response = await fetch(`${API}/api/auth/userDetails`, {
        method: "GET",
        headers: {
          Authorization: authorization_token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data");
    }
  };
  let isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) {
      userAuthentication();
    }
  }, [isLoggedIn]);
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        setUser,
        user,
        authorization_token,
        storeTokenInLS,
        logout_user,
        isLoggedIn,
        API,
        setAPI,
        quizId,
        setQuizId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const AuthContextvalue = useContext(AuthContext);
  if (!AuthContextvalue) {
    throw new Error("useAuth used outside of the provider");
  }
  return AuthContextvalue;
};
