import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole');
  });

  const [userIdx, setUserIdx] = useState(() => {
    return sessionStorage.getItem('userIdx');
  });

  const sessionAlertedRef = useRef(false);

  const login = (role, idx) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserIdx(idx);
    sessionStorage.setItem('userIdx', idx);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userRole', role);
    sessionAlertedRef.current = false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserIdx(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userIdx');
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || '';
        const isAuthEndpoint = url.includes('/api/users/login') || url.includes('/api/users/signup');

        if (status === 401 && isLoggedIn && !isAuthEndpoint && !sessionAlertedRef.current) {
          sessionAlertedRef.current = true;
          setIsLoggedIn(false);
          setUserRole(null);
          setUserIdx(null);
          sessionStorage.removeItem('isLoggedIn');
          sessionStorage.removeItem('userRole');
          sessionStorage.removeItem('userIdx');
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login', {
            state: { from: location.pathname + location.search },
            replace: true,
          });
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [isLoggedIn, navigate, location.pathname, location.search]);

  const value = {
    isLoggedIn,
    userRole,
    userIdx,
    user: userIdx ? { userIdx: userIdx, role: userRole } : null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
