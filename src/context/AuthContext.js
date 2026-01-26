import React, { createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. 초기 상태 설정: 새로고침 시 SessionStorage에서 값을 읽어옵니다.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole'); // 문자열이므로 바로 리턴
  });

  const [userIdx, setUserIdx] = useState(() =>{
    return sessionStorage.getItem('userIdx');
  })

  // 2. 로그인 함수: 상태 업데이트 + SessionStorage에 기록 보존
  const login = (role,idx) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserIdx(userIdx);
    sessionStorage.setItem('userIdx',idx);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userRole', role);
  };

  // 3. 로그아웃 함수: 상태 초기화 + SessionStorage 데이터 삭제
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserIdx(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userIdx');
  };

  const value = {
    isLoggedIn,
    userRole,
    userIdx,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};