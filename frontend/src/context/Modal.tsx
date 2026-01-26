import { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpenLogin: boolean;
  setIsOpenLogin: (isOpen: boolean) => void;
}
export const LoginContext = createContext<ModalContextType | undefined>(
  undefined,
);
export function LoginProvider({ children }) {
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const value = { isOpenLogin, setIsOpenLogin };
  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}
export function useLogin() {
  const context = useContext(LoginContext);
  return context;
}
