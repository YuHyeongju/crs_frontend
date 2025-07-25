// src/pages/AdminSignUpPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MAX_PHONE_LENGTH = 11;
const ADMIN_CODE_LENGTH = 7; 

function AdminSignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '', 
    phone: '',
    gender: '',
    adminNum: '',
  });

  const [passwordMatch, setPasswordMatch] = useState(true);     // 비밀번호 일치 여부
  const [phoneError, setPhoneError] = useState('');             // 휴대폰 번호 유효성 메시지
  const [adminCodeError, setAdminCodeError] = useState('');     // 관리자 코드 유효성 메시지
  const [emailError, setEmailError] = useState('');             // 이메일 유효성 메시지

  useEffect(() => {
    if (formData.password === '' || formData.confirmPassword === '') {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      let newPhoneValue = numericValue; 

      if (numericValue.length > MAX_PHONE_LENGTH) {
        newPhoneValue = numericValue.slice(0, MAX_PHONE_LENGTH);
        setPhoneError(`전화번호는 ${MAX_PHONE_LENGTH}자리를 초과할 수 없습니다.`);
      } 
      else if (value !== numericValue) {
        setPhoneError('숫자만 입력 가능합니다.');
      } 
      else {
        setPhoneError('');
      }
      setFormData({ ...formData, [name]: newPhoneValue });

    } 
    // 이메일(email) 처리 로직 추가
    else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (value === '') {
        setEmailError('');
      } else if (!emailRegex.test(value)) {
        setEmailError('유효한 이메일 주소 형식이 아닙니다. (예: user@example.com)');
      } else {
        setEmailError('');
      }
      setFormData({ ...formData, [name]: value });
    }
    // 관리자 코드(adminNum) 처리 로직 
    else if (name === 'adminNum') {
      const validAdminCode = /^[a-zA-Z0-9]*$/; 
      let newAdminNumValue = value;

      if (!validAdminCode.test(value)) {
        setAdminCodeError('관리자 코드는 영문(대소문자)과 숫자만 입력 가능합니다.');
        newAdminNumValue = value.replace(/[^a-zA-Z0-9]/g, ''); 
      } else if (value.length > ADMIN_CODE_LENGTH) {
        newAdminNumValue = value.slice(0, ADMIN_CODE_LENGTH);
        setAdminCodeError(`관리자 코드는 ${ADMIN_CODE_LENGTH}자리로 구성되어야 합니다.`);
      } else if (value.length < ADMIN_CODE_LENGTH && value.length > 0) {
        setAdminCodeError(`관리자 코드는 ${ADMIN_CODE_LENGTH}자리여야 합니다. (현재 ${value.length}자리)`);
      } else {
        setAdminCodeError('');
      }
      setFormData({ ...formData, [name]: newAdminNumValue });
    }
    // 일반적인 입력 처리
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (phoneError || formData.phone.length < 10) { 
        alert('전화번호를 올바르게 입력해주세요 (숫자만 입력, 최소 10자리).');
        return;
    }

    // 이메일 최종 유효성 검사
    if (emailError || formData.email === '') {
        alert('이메일을 올바른 형식으로 입력해주세요.');
        return;
    }

    // 관리자 코드 최종 유효성 검사 
    if (adminCodeError || formData.adminNum.length !== ADMIN_CODE_LENGTH || !/^[a-zA-Z0-9]{7}$/.test(formData.adminNum)) {
      alert(`관리자 코드는 ${ADMIN_CODE_LENGTH}자리의 영문(대소문자)과 숫자로 구성되어야 합니다.`);
      return;
    }
    
    const payload = {
      ID: formData.userId,
      PW: formData.password,
      EMAIL: formData.email,
      NAME: formData.name,
      PHNUM: formData.phone,
      GENDER: formData.gender,
      ADMIN_NUM: formData.adminNum,
    };

    console.log('관리자 회원가입 정보:', payload);
    alert('관리자 회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.appHeader}>
        <Link to="/" style={styles.logoLink}>
          <FaMapMarkerAlt style={styles.logoIcon} />
          <span style={styles.appName}>CRS</span>
        </Link>
      </div>

      <div style={styles.signUpBox}>
        <h2 style={styles.title}>관리자 회원가입</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="userId" style={styles.label}>아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {formData.password !== '' && formData.confirmPassword !== '' && (
              <p style={passwordMatch ? styles.matchMessage : styles.noMatchMessage}>
                {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {/* 이메일 에러 메시지 표시 */}
            {emailError && <p style={styles.phoneErrorMessage}>{emailError}</p>}
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="phone" style={styles.label}>전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]*"
              inputMode="numeric"
              style={styles.input}
            />
            {phoneError && <p style={styles.phoneErrorMessage}>{phoneError}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>성별</label>
            <div style={styles.genderContainer}>
              <label style={{ ...styles.genderLabel, ...(formData.gender === 'male' && styles.genderLabelChecked) }}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  style={styles.radio}
                />
                남자
              </label>
              <label style={{ ...styles.genderLabel, ...(formData.gender === 'female' && styles.genderLabelChecked) }}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  style={styles.radio}
                />
                여자
              </label>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="adminNum" style={styles.label}>관리자 코드</label>
            <input
              type="text"
              id="adminNum"
              name="adminNum"
              value={formData.adminNum}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {/* 관리자 코드 에러 메시지 표시 */}
            {adminCodeError && <p style={styles.phoneErrorMessage}>{adminCodeError}</p>}
          </div>
          
          <button type="submit" style={styles.submitButton}>회원가입 완료</button>
        </form>
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
  signUpBox: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  genderContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
  },
  genderLabel: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  genderLabelChecked: {
    backgroundColor: '#e0f7fa',
    borderColor: '#007bff',
  },
  radio: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
  submitButtonHover: {
    backgroundColor: '#0056b3',
  },
  matchMessage: {
    color: 'green',
    fontSize: '14px',
    marginTop: '5px',
  },
  noMatchMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
  },
  phoneErrorMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
  },
};

export default AdminSignUpPage;