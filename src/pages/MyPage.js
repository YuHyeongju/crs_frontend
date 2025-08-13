// src/pages/MyPage.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// 각 역할별로 보여줄 마이페이지 컴포넌트를 미리 import합니다.
// 아직 이 파일들을 만들지 않았더라도 일단 import해둡니다.
import UserMyPage from '../components/UserMyPage';
import MerchantMyPage from '../components/MerchantMyPage';
import AdminMyPage from '../components/AdminMyPage';
import NotLoggedInPage from '../components/NotLoggedInPage';

const MyPage = () => {
  // AuthContext에서 userRole과 로그인 상태를 가져옵니다.
  const { userRole, isLoggedIn } = useContext(AuthContext);

  // 1. 로그인이 되어있지 않으면 '로그인 필요' 페이지를 보여줍니다.
  if (!isLoggedIn) {
    return <NotLoggedInPage />;
  }
  
  // 2. 로그인 상태라면, userRole에 따라 다른 컴포넌트를 렌더링합니다.
  switch (userRole) {
    case 'merchant':
      return <MerchantMyPage />;
    case 'admin':
      return <AdminMyPage />;
    case 'general': // 일반 사용자는 default로 처리해도 되지만 명시적으로 작성합니다.
    default:
      return <UserMyPage />;
  }
};

export default MyPage;