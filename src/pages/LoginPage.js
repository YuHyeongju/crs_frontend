// src/pages/LoginPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function LoginPage() {
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 버튼 클릭됨!");
    alert("로그인 기능은 아직 구현되지 않았습니다.");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* 🌟 Link 컴포넌트로 로고와 앱 이름 감싸기 🌟 */}
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
          />
          <input
            type="password"
            placeholder="비밀번호"
            style={styles.inputField}
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
    justifyContent: 'center', // 로고 링크를 가운데 정렬
  },
  logoLink: { // 🌟 Link 컴포넌트 스타일 추가 🌟
    display: 'flex', // Link 내부 아이콘과 텍스트를 나란히 배치
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none', // 밑줄 제거
    color: 'inherit', // 링크 색상 상속
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

