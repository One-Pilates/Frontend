import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Outlet, Navigate } from 'react-router-dom'
// import LoadingSpinner from '../shared/components/LoadingSpinner'

const PrivateRoutes = () => {
  const { user, isCheckingAuth } = useAuth()
  
  if (isCheckingAuth) {
    return <div>Verificando autenticação...</div>;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes
