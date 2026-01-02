import React from 'react';
import { Navigate } from 'react-router-dom'

const useAuth = () => {
    const authToken = localStorage.getItem('token');
    return {
        isLoggedIn: !!authToken
    };
};
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace/>
    }

    return children
}

export default ProtectedRoute;