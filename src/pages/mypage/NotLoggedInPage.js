import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotLoggedInPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3); // 3초부터 시작하는 카운트다운 상태

  useEffect(() => {
    // countdown이 0보다 클 때만 타이머를 설정합니다.
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000); // 1초마다 countdown을 1씩 감소시킵니다.
      
      // 컴포넌트가 언마운트되거나 countdown이 변경될 때 타이머를 정리합니다.
      return () => clearTimeout(timer);
    } 
    // countdown이 0이 되면 리다이렉트합니다.
    else {
      navigate('/login');
    }
  }, [countdown, navigate]); // countdown 또는 navigate가 변경될 때마다 이펙트 실행

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: '#555',
      textAlign: 'center'
    }}>
      <p>로그인이 필요한 페이지입니다.<br/>{countdown}초 후 로그인 페이지로 이동합니다...</p>
    </div>
  );
};

export default NotLoggedInPage;