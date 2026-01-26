import { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpenRegistration: boolean;
  setIsOpenRegistration: (isopen: boolean) => void;
}
export const RegistrationContext = createContext<ModalContextType | undefined>(
  undefined,
);
export function RegistrationProvider({ children }) {
  const [isOpenRegistration, setIsOpenRegistration] = useState(false);

  const value = { isOpenRegistration, setIsOpenRegistration };
  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
export function useRegistration() {
  const context = useContext(RegistrationContext);
  return context;
}
