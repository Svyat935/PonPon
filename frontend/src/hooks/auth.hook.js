import {useCallback, useEffect, useState} from "react";

const STORAGE_NAME = "localData"

export const useAuth = () => {
    const [token, setToken] = useState(null);

    const login = useCallback((token) => {
        setToken(token);

        localStorage.setItem(STORAGE_NAME, JSON.stringify({"token": token}));
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem(STORAGE_NAME);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME));

        if (data && data.token)
            login(data.token);

    }, [login])

    return {login, logout, token}
}