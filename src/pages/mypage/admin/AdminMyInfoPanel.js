import React, { useState, useContext } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCode, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WithdrawalModal from '../../../components/ui/WithdrawalModal';
import { AuthContext } from '../../../context/AuthContext';

const AdminMyInfoPanel = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    id: 'admin123',
    password: 'admin_pass!',
    email: 'admin@example.com',
    name: '김관리',
    phoneNumber: '010-5678-1234',
    adminCode: 'ADMIN_CODE_001',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    alert('정보가 성공적으로 저장되었습니다!');
    console.log('관리자 정보 저장:', userInfo);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmWithdrawal = () => {
    console.log('관리자 회원 탈퇴를 처리하는 중...');
    
    logout();

    alert('회원 탈퇴가 완료되었습니다.');
    navigate('/');
    handleCloseModal();
  };

  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    formGroup: { marginBottom: '20px', display: 'flex', alignItems: 'center' },
    icon: { marginRight: '20px', fontSize: '20px', color: '#007bff', minWidth: '24px', textAlign: 'center' },
    label: { fontSize: '16px', color: '#555', fontWeight: 'bold', width: '150px', marginRight: '20px', textAlign: 'left' },
    input: { flexGrow: 1, border: '1px solid #ccc', borderRadius: '5px', padding: '10px 12px', fontSize: '16px', outline: 'none' },
    inputDisabled: { backgroundColor: '#f9f9f9', color: '#777', cursor: 'not-allowed' },
    buttonContainer: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' },
    button: { width: '100%', padding: '15px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', transition: 'background-color 0.3s ease' },
    saveButton: { backgroundColor: '#007bff', color: 'white' },
    withdrawalButton: { backgroundColor: '#dc3545', color: 'white' },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>내 정보</h2>
      <div style={styles.formGroup}><FaUser style={styles.icon} /><label style={styles.label}>아이디</label><input type="text" name="id" value={userInfo.id} style={{ ...styles.input, ...styles.inputDisabled }} disabled /></div>
      <div style={styles.formGroup}><FaLock style={styles.icon} /><label style={styles.label}>비밀번호</label><input type="password" name="password" value={userInfo.password} onChange={handleChange} style={styles.input} /></div>
      <div style={styles.formGroup}><FaEnvelope style={styles.icon} /><label style={styles.label}>이메일</label><input type="email" name="email" value={userInfo.email} onChange={handleChange} style={styles.input} /></div>
      <div style={styles.formGroup}><FaUser style={styles.icon} /><label style={styles.label}>이름</label><input type="text" name="name" value={userInfo.name} style={{ ...styles.input, ...styles.inputDisabled }} disabled /></div>
      <div style={styles.formGroup}><FaPhone style={styles.icon} /><label style={styles.label}>전화번호</label><input type="tel" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleChange} style={styles.input} /></div>
      <div style={styles.formGroup}><FaCode style={styles.icon} /><label style={styles.label}>관리자 코드</label><input type="text" name="adminCode" value={userInfo.adminCode} style={{ ...styles.input, ...styles.inputDisabled }} disabled /></div>
      
      <div style={styles.buttonContainer}>
        <button style={{ ...styles.button, ...styles.saveButton }} onClick={handleSaveClick}>저장하기</button>
        <button style={{ ...styles.button, ...styles.withdrawalButton }} onClick={handleOpenModal}>
          <FaTimesCircle style={{ marginRight: '10px' }} />회원 탈퇴
        </button>
      </div>

      <WithdrawalModal
        isVisible={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdrawal}
      />
    </div>
  );
};

export default AdminMyInfoPanel;