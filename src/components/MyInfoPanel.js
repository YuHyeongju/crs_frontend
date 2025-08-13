import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';

const MyInfoPanel = () => {
  const [userInfo, setUserInfo] = useState({
    id: 'user123',
    password: 'password123!',
    email: 'user@example.com',
    name: '김민준',
    phoneNumber: '010-1234-5678',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  const handleSaveClick = () => {
    // 실제 애플리케이션에서는 이 데이터를 백엔드로 전송합니다.
    alert('정보가 성공적으로 저장되었습니다!');
    console.log('저장된 정보:', userInfo);
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
    formGroup: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: '20px',
      fontSize: '20px',
      color: '#007bff',
      minWidth: '24px',
      textAlign: 'center',
    },
    label: {
      fontSize: '16px',
      color: '#555',
      fontWeight: 'bold',
      width: '100px', 
      marginRight: '20px',
      textAlign: 'left',
    },
    input: {
      flexGrow: 1,
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px 12px',
      fontSize: '16px',
      outline: 'none',
    },
    inputDisabled: {
      backgroundColor: '#f9f9f9',
      color: '#777',
      cursor: 'not-allowed',
    },
    saveButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '15px 20px',
      cursor: 'pointer',
      fontSize: '18px',
      marginTop: '30px',
      width: '100%',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>내 정보</h2>

      <div style={styles.formGroup}>
        <FaUser style={styles.icon} />
        <label style={styles.label}>아이디</label>
        <input
          type="text"
          name="id"
          value={userInfo.id}
          style={{ ...styles.input, ...styles.inputDisabled }}
          disabled
        />
      </div>

      <div style={styles.formGroup}>
        <FaLock style={styles.icon} />
        <label style={styles.label}>비밀번호</label>
        <input
          type="password"
          name="password"
          value={userInfo.password}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <FaEnvelope style={styles.icon} />
        <label style={styles.label}>이메일</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <FaUser style={styles.icon} />
        <label style={styles.label}>이름</label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          style={{ ...styles.input, ...styles.inputDisabled }}
          disabled
        />
      </div>

      <div style={styles.formGroup}>
        <FaPhone style={styles.icon} />
        <label style={styles.label}>전화번호</label>
        <input
          type="tel"
          name="phoneNumber"
          value={userInfo.phoneNumber}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <button style={styles.saveButton} onClick={handleSaveClick}>
        저장하기
      </button>
    </div>
  );
};

export default MyInfoPanel;