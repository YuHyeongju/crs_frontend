
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'; 
import { AuthContext } from '../../context/AuthContext';
import UserMyPage from '../mypage/user/UserMyPage';
import MerchantMyPage from '../mypage/merchant/MerchantMyPage';
import AdminMyPage from '../mypage/admin/AdminMyPage';
import NotLoggedInPage from './NotLoggedInPage';

const MyPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [mypage, setMyPage] = useState(null); // 서버에서 받을 DTO 데이터 저장
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      // 백엔드에서 만든 MypageResponseDto 가져오기
      axios.get('/api/user/mypage', { withCredentials: true })
        .then(response => {
          setMyPage(response.data); // DTO 데이터 저장
          setLoading(false);
        })
        .catch(error => {
          console.error("데이터 로딩 실패:", error);
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return <NotLoggedInPage />;
  if (loading) return <div>로딩 중...</div>;
  if (!mypage) return <div>사용자 정보를 불러올 수 없습니다.</div>;

  // 3. 서버에서 보내준 role(String) 값에 따라 컴포넌트 렌더링
  // 주의: 백엔드 DTO에서 대문자("MERCHANT")로 보내면 대문자로 비교해야 합니다.
  switch (mypage.role) {
    case 'MERCHANT':
      return <MerchantMyPage data={mypage} />; // 데이터를 props로 전달
    case 'ADMIN':
      return <AdminMyPage data={mypage} />;
    default:
      return <UserMyPage data={mypage} />;
  }
};

export default MyPage;