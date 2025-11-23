import React from "react";
import ToastContext from "./ToastContext";

export const useToast = () => React.useContext(ToastContext);

export default useToast;