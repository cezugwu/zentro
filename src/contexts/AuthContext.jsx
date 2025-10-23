import { createContext, useEffect } from 'react'
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_API_URL } from '../utilis/config';

export const AuthContext = createContext();

const REFRESH_INTERVAL = 60 * 4 * 1000;

const AuthProvider = ({children}) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token && location.pathname === "/login") {
            navigate('/')
        }
    }, [location.pathname]);

    function generateGuestId(length = 16) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let randomPart = "";
        for (let i = 0; i < length; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `guest-${randomPart}`;
    }

    useEffect(() => {
        if (!localStorage.getItem('guest')) {
            localStorage.setItem('guest', generateGuestId())
        }
    }, [])

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
        const res = await fetch(`${BASE_API_URL}/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Login failed");

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
        },
    });

    const refreshMutation = useMutation({
        mutationFn: async () => {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token found");

        const res = await fetch(`${BASE_API_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Refresh failed");
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
        },
        onError: (err) => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },
    });

    useEffect(() => { 
        let timeOut = setTimeout(() => {refreshMutation.mutate();}, 0)
        let interval;
        if (localStorage.getItem('access')) {
            interval = setInterval(() => {
                refreshMutation.mutate();
            }, REFRESH_INTERVAL);
        }

        return () => {
            if (interval) clearInterval(interval);
            clearTimeout(timeOut);
        };
    }, []);

    return(
        <AuthContext.Provider value={{loginMutation}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;