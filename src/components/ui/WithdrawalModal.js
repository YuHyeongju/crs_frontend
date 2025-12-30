import React from 'react';
import { FaTimes } from 'react-icons/fa';

const WithdrawalModal = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '30px',
      width: '350px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      color: '#aaa',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '25px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '20px',
    },
    button: {
      padding: '10px 25px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
    },
    confirmButton: {
      backgroundColor: '#fff',
      color: '#dc3545',
      borderColor: '#dc3545',
    },
    cancelButton: {
      backgroundColor: '#fff',
      color: '#555',
      borderColor: '#ccc',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div style={styles.title}>정말로 회원 탈퇴 하시겠습니까?</div>
        <div style={styles.buttonContainer}>
          <button style={{ ...styles.button, ...styles.confirmButton }} onClick={onConfirm}>
            확인
          </button>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;