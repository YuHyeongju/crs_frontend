// src/pages/GeneralTermsPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function GeneralTermsPage() {
  const navigate = useNavigate();

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms1, setAgreeTerms1] = useState(false); // 필수
  const [agreeTerms2, setAgreeTerms2] = useState(false); // 필수
  const [agreeTerms3, setAgreeTerms3] = useState(false); // 선택

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

  // 필수 약관 동의 여부
  const areAllRequiredTermsAgreed = agreeTerms1 && agreeTerms2;

  const handleNextClick = () => {
    if (areAllRequiredTermsAgreed) {
      navigate('/signup/general'); // 일반 사용자 회원가입 페이지로 이동
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
        <h2 style={styles.title}>일반 사용자 서비스 이용 약관</h2>

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
              <p>일반 사용자 약관 1의 세부 내용입니다. 이는 서비스 이용을 위해 반드시 동의해야 하는 필수 약관입니다.</p>
              <p>예시: 개인정보 수집 및 이용 동의, 서비스 이용 기본 약관 등</p>
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
              <p>일반 사용자 약관 2의 세부 내용입니다. 이 역시 서비스 이용을 위한 필수 약관입니다.</p>
              <p>예시: 위치 기반 서비스 이용 동의, 마케팅 정보 수신 동의 (필수 조건 시) 등</p>
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
              약관 3 [선택] 동의
            </label>
            <div style={styles.termContentBox}>
              <p>일반 사용자 약관 3의 세부 내용입니다. 이 약관은 선택 동의 항목으로, 동의하지 않아도 서비스 이용은 가능합니다.</p>
              <p>예시: 마케팅 목적 개인정보 활용 동의 (선택), 이벤트 및 프로모션 정보 수신 동의 등</p>
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

export default GeneralTermsPage;