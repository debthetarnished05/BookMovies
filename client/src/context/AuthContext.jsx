import { useContext, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser, logout } from "../apis";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [showModal , setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);

    // Mutations
    const registerMutation = useMutation({
        mutationFn : (data) => registerUser(data),
    })

    const loginMutation = useMutation({
        mutationFn : (data) => loginUser(data),
    })

    const logOutMutation = useMutation({
        mutationFn : () => logout(),
    })

    const toggleModal = () => {
        setShowModal(!showModal)
        if(step !== 1){
            setStep(1);
        }
    }

    const registerRequest = async (data) => {
        registerMutation.mutate(data, {
            onSuccess : (res) => {
                setUser(res.data.user);
                setAuth(true);
                localStorage.setItem("userId", res.data.user._id);
                toast.success("Account created successfully!");
                toggleModal();
            },
            onError : (err) => {
                toast.error(err?.response?.data?.message || "Something went wrong");
            }
        })
    }

    const loginRequest = async (data) => {
        loginMutation.mutate(data, {
            onSuccess : (res) => {
                setUser(res.data.user);
                setAuth(true);
                localStorage.setItem("userId", res.data.user._id);
                toast.success("Logged in successfully!");
                toggleModal();
            },
            onError : (err) => {
                toast.error(err?.response?.data?.message || "Invalid credentials");
            }
        })
    }

    const logoutRequest = () => {
        logOutMutation.mutate(null, {
            onSuccess: () => {
                setAuth(false);
                setUser(null);
                localStorage.removeItem("userId");
                window.location.href = "/";
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
            },
        })
    }

    return (
        <AuthContext.Provider value={{ 
            step, setStep, 
            showModal, toggleModal, 
            user, setUser, 
            auth, setAuth,
            registerRequest, 
            loginRequest, 
            logoutRequest, 
            isAuthLoading: registerMutation.isPending || loginMutation.isPending 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);