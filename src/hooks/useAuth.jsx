import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const useAuth = () => {
    const authInfo = useContext(AuthContext);

    return authInfo;
}

export default useAuth;