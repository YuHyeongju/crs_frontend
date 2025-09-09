import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 미리 정해둔 가짜 아이디와 비밀번호
  const correctId = 'test';
  const correctPassword = '1234';

  // 사용자가 입력할 아이디와 비밀번호를 관리할 상태
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // 테스트할 사용자 역할을 여기에 설정하세요.
  // 'general', 'merchant', 'admin' 중 하나를 입력하세요.
  // 이 변수 값을 변경하여 다양한 사용자 유형으로 로그인할 수 있습니다.
  const testUserRole = 'general';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // 입력된 값과 미리 정해둔 값을 비교
    if (userId === correctId && password === correctPassword) {
      alert('로그인 되었습니다.');
      
      // 로그인 성공 시 AuthContext의 login 함수를 호출하여
      // 임의로 설정한 역할을 전달합니다.
      login(testUserRole);
      
      // 메인 페이지로 이동
      navigate('/');
    } else {
      alert('아이디나 비밀번호가 틀렸습니다.');
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
            placeholder="아이디 또는 이메일"
            style={styles.inputField}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            style={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={styles.rememberMeContainer}>
            <input type="checkbox" id="rememberMe" style={styles.rememberMeCheckbox} />
            <label htmlFor="rememberMe" style={styles.rememberMeLabel}>로그인 기억</label>
          </div>

          <button type="submit" style={styles.loginButton}>
            로그인
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
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
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

