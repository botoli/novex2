import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(undefined);
export function UserProvider({ children }) {
  const [currentuser, setCurrentuser] = useState();

  useEffect(() => {
    const savedUser = localStorage.getItem("currentuser");
    if (savedUser) {
      try {
        setCurrentuser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("currentuser");
      }
    }
  }, []);
  useEffect(() => {
    if (currentuser) {
      localStorage.setItem("currentuser", JSON.stringify(currentuser));
    } else {
      localStorage.removeItem("currentuser");
    }
  }, [currentuser]);

  const value = { currentuser, setCurrentuser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUser() {
  const context = useContext(UserContext);
  return context;
}
