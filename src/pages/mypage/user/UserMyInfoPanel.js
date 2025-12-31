import React, { useState, useContext, useEffect } from 'react'; 
import { FaUser, FaLock, FaEnvelope, FaPhone, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WithdrawalModal from '../../../components/ui/WithdrawalModal';
import { AuthContext } from '../../../context/AuthContext'; 
import axios from 'axios';

const UserMyInfoPanel = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); 

  
  const [userInfo, setUserInfo] = useState({
    id: '',
    pw: '',
    email: '',
    name: '',
    phNum: '',
  });

  const [isLoading, setIsLoading] = useState(true); 

  // 2. 컴포넌트 로드 시 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const response = await axios.get('/api/users/mypage', { withCredentials: true });
        
        
        setUserInfo({
          id: response.data.id,
          pw: '', 
          email: response.data.email,
          name: response.data.name,
          phNum: response.data.phNum,
        });
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        if (error.response?.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));// 비밀번호 창 비우기
  };

  // 3. 정보 수정 저장 
  const handleSaveClick = async () => {
   try {
    
    const updateData = {
      pw:userInfo.pw, 
      email: userInfo.email,
      phNum: userInfo.phNum 
    };

    // 백엔드 컨트롤러 엔드포인트 호출
    const response = await axios.post('/api/users/mypage/updateUser', updateData, { 
      withCredentials: true 
    });

    if (response.status === 200) {
      alert('정보가 성공적으로 수정되었습니다!');
      // 비밀번호 칸은 보안상 다시 비워줍니다.
      setUserInfo(prev => ({ ...prev, pw: '' }));
      navigate("/")
    }
  } catch (error) {
    console.error("정보 수정 실패:", error);
    const errorMessage = error.response?.data || "정보 수정 중 오류가 발생했습니다.";
    alert(errorMessage);
  }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmWithdrawal = async () => {
  try {
    await axios.post(`/api/auth/withdraw?id=${userInfo.id}`, null, { withCredentials: true });
    
    logout();
    alert("회원 탈퇴가 정상적으로 완료되었습니다.");
    navigate("/");
  } catch (error) {
    console.error("회원 탈퇴 상세 에러:", error);

    // 에러 객체가 들어올 경우를 대비해 처리
    const serverMessage = error.response?.data;
    const finalMessage = typeof serverMessage === 'object' 
      ? JSON.stringify(serverMessage) 
      : serverMessage;

    alert(finalMessage || "회원 탈퇴 중 문제가 발생했습니다.");
  }
};

  if (isLoading) return <div>로딩 중...</div>; 

  
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
      <div style={styles.formGroup}><FaLock style={styles.icon} /><label style={styles.label}>비밀번호</label><input type="password" name="pw" placeholder="변경 시 입력" value={userInfo.password} onChange={handleChange} style={styles.input} /></div>
      <div style={styles.formGroup}><FaEnvelope style={styles.icon} /><label style={styles.label}>이메일</label><input type="email" name="email" value={userInfo.email} onChange={handleChange} style={styles.input} /></div>
      <div style={styles.formGroup}><FaUser style={styles.icon} /><label style={styles.label}>이름</label><input type="text" name="name" value={userInfo.name} style={{ ...styles.input, ...styles.inputDisabled }} disabled /></div>
      <div style={styles.formGroup}><FaPhone style={styles.icon} /><label style={styles.label}>전화번호</label><input type="tel" name="phNum" value={userInfo.phNum} onChange={handleChange} style={styles.input} /></div>
      
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

export default UserMyInfoPanel;