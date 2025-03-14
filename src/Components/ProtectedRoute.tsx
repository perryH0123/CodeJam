import React from 'react';
import { Navigate } from 'react-router-dom';
import { useJudge } from '../context/JudgeContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useJudge();

    if (!isAuthenticated) {
        return <Navigate to="/judge/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 