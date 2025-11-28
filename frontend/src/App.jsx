import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserContextProvider } from "./Context/UserContext";

const App = () => {
  return (
    <div>
      <UserContextProvider>
        <AppRoutes />
      </UserContextProvider>
    </div>
  );
};

export default App;
