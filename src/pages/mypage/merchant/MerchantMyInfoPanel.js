import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaBuilding, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WithdrawalModal from '../../../components/ui/WithdrawalModal';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';

const MerchantMyInfoPanel = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    id: '',
    pw: '', 
    email: '',
    name: '',
    phNum: '',
    businessNum: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 정보 가져오기
  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        const response = await axios.get('/api/users/mypage', { withCredentials: true });
        
        setUserInfo({
          id: response.data.id,
          pw: '', 
          email: response.data.email,
          name: response.data.name,
          phNum: response.data.phNum,
          businessNum: response.data.businessNum, 
        });
      } catch (error) {
        console.error("상인 정보 로딩 실패:", error);
        if (error.response?.status === 401) {
          alert("세션이 만료되었습니다.");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  // 2. 상인 정보 수정 저장
  const handleSaveClick = async () => {
    try {
      const updateData = {
        pw: userInfo.pw,
        email: userInfo.email,
        phNum: userInfo.phNum,
        businessNum: userInfo.businessNum 
      };

     
      const response = await axios.post('/api/users/mypage/updateMerchant', updateData, { 
        withCredentials: true 
      });

      if (response.status === 200) {
        alert('상인 정보가 성공적으로 수정되었습니다!');
        setUserInfo(prev => ({ ...prev, pw: '' })); // 비밀번호 창 비우기
        navigate("/")
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert(error.response?.data || '수정 중 오류가 발생했습니다.');
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmWithdrawal = async () => {
    try {
      
      await axios.post(`/api/users/withdraw?id=${userInfo.id}`, null, { withCredentials: true });
      
      logout();
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      const errMsg = error.response?.data;
      alert(typeof errMsg === 'string' ? errMsg : "탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div style={{padding: '30px'}}>데이터를 불러오는 중...</div>;

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
      <h2 style={styles.title}>내 정보 (상인)</h2>
      
      <div style={styles.formGroup}><FaUser style={styles.icon} /><label style={styles.label}>아이디</label>
        <input type="text" name="id" value={userInfo.id} style={{ ...styles.input, ...styles.inputDisabled }} disabled />
      </div>
      
      <div style={styles.formGroup}><FaLock style={styles.icon} /><label style={styles.label}>비밀번호</label>
        <input type="password" name="pw" placeholder="변경 시 입력" value={userInfo.pw} onChange={handleChange} style={styles.input} />
      </div>
      
      <div style={styles.formGroup}><FaEnvelope style={styles.icon} /><label style={styles.label}>이메일</label>
        <input type="email" name="email" value={userInfo.email} onChange={handleChange} style={styles.input} />
      </div>
      
      <div style={styles.formGroup}><FaUser style={styles.icon} /><label style={styles.label}>이름</label>
        <input type="text" name="name" value={userInfo.name} style={{ ...styles.input, ...styles.inputDisabled }} disabled />
      </div>
      
      <div style={styles.formGroup}><FaPhone style={styles.icon} /><label style={styles.label}>전화번호</label>
        <input type="tel" name="phNum" value={userInfo.phNum} onChange={handleChange} style={styles.input} />
      </div>
      
      <div style={styles.formGroup}><FaBuilding style={styles.icon} /><label style={styles.label}>사업자 등록번호</label>
        <input type="text" name="businessNum" value={userInfo.businessNum} onChange={handleChange} style={styles.input} />
      </div>
      
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

export default MerchantMyInfoPanel;