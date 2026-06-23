import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('accessToken'));
  const [userIdx, setUserIdx]         = useState(() => sessionStorage.getItem('userIdx'));
  const [userRole, setUserRole]       = useState(() => sessionStorage.getItem('userRole'));
  const [isLoggedIn, setIsLoggedIn]   = useState(() => !!sessionStorage.getItem('accessToken'));

  const isRefreshing        = useRef(false);
  const refreshSubscribers  = useRef([]);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUserIdx(null);
    setUserRole(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userIdx');
    sessionStorage.removeItem('userRole');
  }, []);

  const applyAuth = useCallback((token, idx, role) => {
    setAccessToken(token);
    setUserIdx(String(idx));
    setUserRole(role);
    setIsLoggedIn(true);
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('userIdx', String(idx));
    sessionStorage.setItem('userRole', role);
  }, []);

  // 로그인: LoginPage에서 호출 (role, idx, token)
  const login = useCallback((role, idx, token) => {
    applyAuth(token, idx, role);
  }, [applyAuth]);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (_) {}
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  // 요청마다 Authorization 헤더 자동 삽입
  useEffect(() => {
    const id = axios.interceptors.request.use(config => {
      const token = sessionStorage.getItem('accessToken');
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });
    return () => axios.interceptors.request.eject(id);
  }, []);

  // 401 응답 시 Refresh Token으로 자동 재발급
  useEffect(() => {
    const id = axios.interceptors.response.use(
      res => res,
      async error => {
        const original = error.config;
        const status   = error?.response?.status;
        const url      = original?.url || '';

        if (status === 401 && !url.includes('/api/auth/') && !original._retry) {
          original._retry = true;

          if (isRefreshing.current) {
            return new Promise((resolve, reject) => {
              refreshSubscribers.current.push({ resolve, reject });
            }).then(token => {
              original.headers['Authorization'] = `Bearer ${token}`;
              return axios(original);
            });
          }

          isRefreshing.current = true;
          try {
            const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
            const { accessToken: newToken, userIdx: idx, role } = res.data;
            applyAuth(newToken, idx, role);
            refreshSubscribers.current.forEach(s => s.resolve(newToken));
            refreshSubscribers.current = [];
            original.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(original);
          } catch (_) {
            refreshSubscribers.current.forEach(s => s.reject(_));
            refreshSubscribers.current = [];
            clearAuth();
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            navigate('/login', { state: { from: location.pathname }, replace: true });
            return Promise.reject(_);
          } finally {
            isRefreshing.current = false;
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [applyAuth, clearAuth, navigate, location.pathname]);

  // 앱 시작 시 Access Token 없으면 Refresh Token으로 자동 로그인 시도
  useEffect(() => {
    if (!sessionStorage.getItem('accessToken')) {
      axios.post('/api/auth/refresh', {}, { withCredentials: true })
        .then(res => {
          const { accessToken: token, userIdx: idx, role } = res.data;
          applyAuth(token, idx, role);
        })
        .catch(() => {});
    }
  }, [applyAuth]);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userIdx,
      userRole,
      user: userIdx ? { userIdx, role: userRole } : null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
