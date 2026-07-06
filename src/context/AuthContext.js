import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

// 컴포넌트 useEffect 안에 등록하면, 자식 컴포넌트의 마운트 시점 요청이
// (자식 effect가 부모보다 먼저 실행되므로) 이 인터셉터 등록보다 먼저 나가버려
// Authorization 헤더 없이 전송되는 경우가 있었다. 그 결과 새로고침 등으로
// 보호된 라우트에 바로 진입하면 유효한 세션인데도 401로 처리되어 강제
// 로그아웃되는 문제가 있었다. 모듈 스코프로 올려 React 렌더링 이전에
// 항상 먼저 등록되도록 한다.
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

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
