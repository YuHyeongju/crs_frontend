// src/context/AuthContext.js

import React, { createContext, useState } from 'react';

// 1. AuthContext 객체 생성
export const AuthContext = createContext();

// 2. AuthProvider 컴포넌트: 로그인 상태와 역할을 관리
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // 로그인 함수: role 정보를 받아서 상태를 업데이트
  const login = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    // 실제 프로젝트에서는 localStorage에 토큰 등을 저장하는 로직이 추가됩니다.
  };

  // 로그아웃 함수: 모든 상태를 초기화
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const value = {
    isLoggedIn,
    userRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};