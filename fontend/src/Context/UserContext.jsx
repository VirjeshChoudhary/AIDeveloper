/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser=()=>{
    return useContext(UserContext);
}

