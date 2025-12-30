import React, { useState, useContext} from 'react'; 
import { FaUser, FaLock, FaEnvelope, FaPhone, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WithdrawalModal from '../../../components/ui/WithdrawalModal';
import { AuthContext } from '../../../context/AuthContext'; 
import axios from 'axios';

// 1. 컴포넌트 이름을 UserMyInfoPanel로 변경
const UserMyInfoPanel = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); 

  // 현재는 하드코딩 되어있지만, 나중에 백엔드에서 받아오도록 useEffect를 쓰시면 좋습니다.
  const [userInfo, setUserInfo] = useState({
    id: 'test',
    password: '1234',
    email: 'user@example.com',
    name: '김민준',
    phoneNumber: '010-1234-5678',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  // 저장 로직도 axios를 사용하여 서버에 반영하도록 수정이 필요할 수 있습니다.
  const handleSaveClick = async () => {
    try {
      // 예시: await axios.put('/api/user/update', userInfo);
      alert('정보가 성공적으로 저장되었습니다!');
      console.log('저장된 정보:', userInfo);
    } catch (error) {
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmWithdrawal = async () => {
    try {
      // 프록시 설정이 되어있으므로 경로 확인 필요 (/api 등)
      await axios.post(`/withdraw?id=${userInfo.id}`);
      logout();
      alert("회원 탈퇴가 정상적으로 완료되었습니다.");
      navigate("/");
    } catch(error) {
      console.error("회원 탈퇴 중에 오류가 발생했습니다.", error);
      const errMsg = error.response?.data || "회원 탈퇴 처리중 문제가 발생했습니다.";
      alert(errMsg);
    }
  };

  // 스타일 객체 (기존 유지)
  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    formGroup: { marginBottom: '20px', display: 'flex', alignItems: 'center' },
    icon: { marginRight: '20px', fontSize: '20px', color: '#007bff', minWidth: '24px', textAlign: 'center' },
    label: { fontSize: '16px', color: '#555', fontWeight: 'bold', width: '100px', marginRight: '20px', textAlign: 'left' },
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

// 2. Export 이름을 선언한 컴포넌트 이름과 일치시킵니다.
export default UserMyInfoPanel;