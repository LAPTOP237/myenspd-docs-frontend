import React from "react";
import AuthContext from "./AuthContext";

export const useAuth = () => React.useContext(AuthContext);

export default useAuth;