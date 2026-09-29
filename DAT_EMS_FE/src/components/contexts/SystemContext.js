import { createContext, useReducer } from "react";
import SystemReducer, { INITIAL_STATE } from "./SystemReducer";

export const SystemContext = createContext(INITIAL_STATE);

export const SystemContextProvider = ({ children }) => {
  const [state, systemDispatch] = useReducer(SystemReducer, INITIAL_STATE);

  return (
    <SystemContext.Provider
      value={{
        userId: state.userId,
        username: state.username,
        name: state.name,
        email: state.email,
        phone: state.phone,
        address: state.address,
        roleName: state.roleName,
        image: state.image,
        permissions: state.permissions,
        status: state.status,
        systemDispatch,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};
