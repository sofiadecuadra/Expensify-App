import { useQuery } from "react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useQueryAuth = (queryKey:any, queryFn:any, options:any) => {
    const { signOut } = useContext(AuthContext);
    const onErrorToken = (error:any) => {
        if (error.response.data.errorType === "TOKEN_ERROR" || error.response.status === 401) {
            signOut();
            return;
        }
        options.onError(error);
    }
    options.onError = onErrorToken;
    return useQuery(queryKey, queryFn, options);
}

export default useQueryAuth;

