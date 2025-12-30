
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 사용자가 입력할 아이디와 비밀번호 상태
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로그인 처리 중 상태 관리

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // 입력값 유효성 검사
    if (!id || !pw) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      // 1. 백엔드 로그인 API 호출
      const response = await axios.post('/api/auth/login', {
        id: id,      
        pw: pw    
      }, {
        withCredentials: true // 세션/쿠키 연동 시 필수
      });

      if (response.status === 200) {
        console.log("백엔드 로그인 통신 성공")

        const userData = response.data;
        
        alert(`${userData.name || id}님, 환영합니다!`);
        
        // 3. AuthContext의 login 함수 호출 (서버에서 준 실제 역할을 전달)
        login(userData.role); 
        
        // 4. 메인 페이지로 이동
        navigate('/');
      }
    } catch (error) {
      console.error("로그인 시도 에러:", error);
      // 서버에서 보낸 에러 메시지가 있다면 출력, 없으면 기본 메시지
      const errorMessage = error.response?.data || "아이디 또는 비밀번호가 일치하지 않습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.logoLink}>
          <FaMapMarkerAlt style={styles.logoIcon} />
          <span style={styles.appName}>CRS</span>
        </Link>
      </div>

      <div style={styles.loginBox}>
        <h2 style={styles.title}>로그인</h2>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="아이디"
            style={styles.inputField}
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="비밀번호"
            style={styles.inputField}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={isLoading}
          />

          <div style={styles.rememberMeContainer}>
            <input type="checkbox" id="rememberMe" style={styles.rememberMeCheckbox} />
            <label htmlFor="rememberMe" style={styles.rememberMeLabel}>로그인 기억</label>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.loginButton, 
              backgroundColor: isLoading ? '#bdc3c7' : '#007bff',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={styles.linksContainer}>
          <Link to="/usertypeselection" style={styles.bottomLink}>회원가입</Link>
          <span style={styles.linkSeparator}>|</span>
          <Link to="/find-id" style={styles.bottomLink}>아이디 찾기</Link>
          <span style={styles.linkSeparator}>|</span>
          <Link to="/reset-password" style={styles.bottomLink}>비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  header: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'inherit',
  },
  logoIcon: {
    fontSize: '60px',
    color: '#E74C3C',
  },
  appName: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  loginBox: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#333',
  },
  inputField: {
    width: 'calc(100% - 20px)',
    padding: '12px 10px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  rememberMeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '25px',
  },
  rememberMeCheckbox: {
    marginRight: '8px',
    width: '18px',
    height: '18px',
  },
  rememberMeLabel: {
    fontSize: '15px',
    color: '#555',
  },
  loginButton: {
    width: '100%',
    padding: '15px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    transition: 'background-color 0.3s ease',
  },
  linksContainer: {
    marginTop: '30px',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'normal',
    padding: '0 5px',
  },
  linkSeparator: {
    color: '#ccc',
    margin: '0 5px',
  },
};

export default LoginPage;