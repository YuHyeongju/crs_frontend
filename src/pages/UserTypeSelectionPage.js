// src/pages/UserTypeSelectionPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaStore, FaCog, FaMapMarkerAlt } from 'react-icons/fa';

function UserTypeSelectionPage() {
  return (
    <div style={styles.container}>
      {/* 🌟 Link 컴포넌트로 앱 로고와 이름 감싸기 🌟 */}
      <div style={styles.appHeader}>
        <Link to="/" style={styles.logoLink}>
          <FaMapMarkerAlt style={styles.logoIcon} />
          <span style={styles.appName}>CRS</span>
        </Link>
      </div>

      <div style={styles.selectionBox}>
        <h2 style={styles.title}>회원 유형 선택</h2>
        <div style={styles.typeButtonsContainer}>
          {/* 일반 사용자 */}
          <Link to="/terms/general" style={styles.typeButton}>
            <FaUser style={styles.typeIcon} />
            <span style={styles.typeText}>일반 사용자</span>
          </Link>

          {/* 상인 */}
          <Link to="/terms/merchant" style={styles.typeButton}>
            <FaStore style={styles.typeIcon} />
            <span style={styles.typeText}>상인</span>
          </Link>

          {/* 관리자 */}
          <Link to="/terms/admin" style={styles.typeButton}>
            <FaCog style={styles.typeIcon} />
            <span style={styles.typeText}>관리자</span>
          </Link>
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
    paddingTop: '80px',
    boxSizing: 'border-box',
  },
  appHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // 로고를 왼쪽으로 정렬
    height: '60px',
    zIndex: 100,
    boxSizing: 'border-box',
  },
  logoLink: { //Link 컴포넌트 스타일 추가 
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: 'inherit',
  },
  logoIcon: {
    fontSize: '24px',
    color: '#E74C3C',
  },
  appName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  selectionBox: {
    backgroundColor: 'white',
    padding: '50px 40px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '900px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    marginBottom: '40px',
    color: '#333',
  },
  typeButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '30px',
    flexWrap: 'wrap',
  },
  typeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(33.33% - 20px)',
    height: '220px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    textDecoration: 'none',
    color: '#333',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  typeButtonHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  },
  typeIcon: {
    fontSize: '90px',
    marginBottom: '15px',
    color: '#007bff',
  },
  typeText: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
};

export default UserTypeSelectionPage;