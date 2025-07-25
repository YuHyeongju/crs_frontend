// src/pages/AdminTermsPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function AdminTermsPage() {
  const navigate = useNavigate();

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms1, setAgreeTerms1] = useState(false); // 필수
  const [agreeTerms2, setAgreeTerms2] = useState(false); // 필수
  const [agreeTerms3, setAgreeTerms3] = useState(false); // 필수

  // "전체 약관 동의" 체크박스 핸들러
  const handleAgreeAllChange = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeTerms1(checked);
    setAgreeTerms2(checked);
    setAgreeTerms3(checked);
  };

  // 개별 약관 동의 상태 변경 시 "전체 약관 동의" 상태 업데이트
  useEffect(() => {
    setAgreeAll(agreeTerms1 && agreeTerms2 && agreeTerms3);
  }, [agreeTerms1, agreeTerms2, agreeTerms3]);

  // 필수 약관 동의 여부 (관리자도 모두 필수)
  const areAllRequiredTermsAgreed = agreeTerms1 && agreeTerms2 && agreeTerms3;

  const handleNextClick = () => {
    if (areAllRequiredTermsAgreed) {
      navigate('/signup/admin'); // 관리자 회원가입 페이지로 이동
    } else {
      alert('필수 약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.appHeader}>
        <Link to="/" style={styles.logoLink}>
          <FaMapMarkerAlt style={styles.logoIcon} />
          <span style={styles.appName}>CRS</span>
        </Link>
      </div>

      <div style={styles.termsBox}>
        <h2 style={styles.title}>관리자 서비스 이용 약관</h2>

        <div style={styles.agreeAllContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreeAll}
              onChange={handleAgreeAllChange}
              style={styles.checkbox}
            />
            전체 약관 동의
          </label>
        </div>

        <div style={styles.termsContentWrapper}>
          <div style={styles.termItem}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreeTerms1}
                onChange={(e) => setAgreeTerms1(e.target.checked)}
                style={styles.checkbox}
              />
              약관 1 [필수] 동의
            </label>
            <div style={styles.termContentBox}>
              <p>관리자 약관 1의 세부 내용입니다. 이는 시스템 관리 권한 사용에 대한 필수 약관입니다.</p>
              <p>예시: 시스템 접근 권한 및 책임 범위, 데이터 처리 원칙 동의 등</p>
            </div>
          </div>
          <div style={styles.termItem}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreeTerms2}
                onChange={(e) => setAgreeTerms2(e.target.checked)}
                style={styles.checkbox}
              />
              약관 2 [필수] 동의
            </label>
            <div style={styles.termContentBox}>
              <p>관리자 약관 2의 세부 내용입니다. 이는 정보 보안 및 기밀 유지 의무에 대한 필수 약관입니다.</p>
              <p>예시: 기밀 유지 서약, 보안 정책 준수 동의 등</p>
            </div>
          </div>
          <div style={styles.termItem}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreeTerms3}
                onChange={(e) => setAgreeTerms3(e.target.checked)}
                style={styles.checkbox}
              />
              약관 3 [필수] 동의
            </label>
            <div style={styles.termContentBox}>
              <p>관리자 약관 3의 세부 내용입니다. 이는 서비스 운영 및 감사 원칙에 대한 필수 약관입니다.</p>
              <p>예시: 서비스 운영 가이드라인 준수, 감사 및 보고 의무 동의 등</p>
            </div>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleNextClick}
            style={{
              ...styles.nextButton,
              backgroundColor: areAllRequiredTermsAgreed ? '#007bff' : '#cccccc',
              cursor: areAllRequiredTermsAgreed ? 'pointer' : 'not-allowed',
            }}
            disabled={!areAllRequiredTermsAgreed}
          >
            다음
          </button>
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
    justifyContent: 'flex-start',
    height: '60px',
    zIndex: 100,
    boxSizing: 'border-box',
  },
  logoLink: {
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
  termsBox: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '700px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  agreeAllContainer: {
    textAlign: 'left',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  termsContentWrapper: {
    marginBottom: '30px',
    maxHeight: '450px',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  termItem: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '17px',
    fontWeight: 'bold',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  termContentBox: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    fontSize: '15px',
    lineHeight: '1.5',
    maxHeight: '100px',
    overflowY: 'auto',
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  nextButton: {
    padding: '15px 50px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    maxWidth: '300px',
  },
};

export default AdminTermsPage;