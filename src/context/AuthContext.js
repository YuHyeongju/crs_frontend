import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. 초기 상태 설정
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole');
  });

  const [userIdx, setUserIdx] = useState(() => {
    return sessionStorage.getItem('userIdx');
  });

  // 2. 로그인 함수
  const login = (role, idx) => { // 매개변수 이름을 idx로 받아도 내부에서 정확히 매칭
    setIsLoggedIn(true);
    setUserRole(role);
    setUserIdx(idx);
    sessionStorage.setItem('userIdx', idx);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userRole', role);
  };

  // 3. 로그아웃 함수
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserIdx(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userIdx');
  };

  // ⭐ 핵심 수정 부분: value 객체 구성
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