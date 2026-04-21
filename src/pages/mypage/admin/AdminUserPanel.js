import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminUserPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admins/users', { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      setError('사용자 목록을 불러오는 데 실패했습니다.');
      console.error("사용자 목록 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDetails = async (userIdx) => {
    try {
      const response = await axios.get(`/api/admins/users/${userIdx}`, { withCredentials: true });
      const userDetails = response.data;
      alert(`사용자 상세 정보:\n` +
            `ID: ${userDetails.id}\n` +
            `유형: ${userDetails.userType}\n` +
            `이름: ${userDetails.name}\n` +
            `이메일: ${userDetails.email}\n` +
            `전화번호: ${userDetails.phNum}\n` +
            `성별: ${userDetails.gender}\n` +
            (userDetails.businessNum ? `사업자 번호: ${userDetails.businessNum}\n` : '') +
            (userDetails.adminNum ? `관리자 번호: ${userDetails.adminNum}\n` : '') +
            `가입일: ${new Date(userDetails.createTime).toLocaleDateString()}\n` +
            `상태: ${userDetails.status}\n` +
            `혼잡도 입력 횟수: ${userDetails.congestionCount}\n` +
            `리뷰 개수: ${userDetails.reviewCount}`);
    } catch (err) {
      alert('사용자 상세 정보를 불러오는 데 실패했습니다.');
      console.error("사용자 상세 정보 로드 실패:", err);
    }
  };

  const handleSanction = async (userIdx) => {
    const reason = prompt(`사용자 ID: ${userIdx}를 제재하시겠습니까? 제재 사유를 입력해주세요.`);
    if (!reason) return;

    try {
      await axios.post(`/api/admins/users/${userIdx}/sanction`, { reason }, { withCredentials: true });
      alert(`사용자 ID: ${userIdx}가 제재 처리되었습니다.`);
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      alert('제재 처리 중 오류가 발생했습니다.');
      console.error("사용자 제재 실패:", err);
    }
  };

  const handleDeactivate = async (userIdx) => {
    if (!window.confirm(`정말로 사용자 ID: ${userIdx}를 탈퇴 처리하시겠습니까?`)) return;

    try {
      await axios.post(`/api/admins/users/${userIdx}/deactivate`, {}, { withCredentials: true });
      alert(`사용자 ID: ${userIdx}가 탈퇴 처리되었습니다.`);
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      alert('탈퇴 처리 중 오류가 발생했습니다.');
      console.error("사용자 탈퇴 처리 실패:", err);
    }
  };

  const styles = {
    panel: { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
    userCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
      padding: '20px',
      marginBottom: '15px',
      border: '1px solid #e0e0e0',
    },
    cardItem: { display: 'flex', marginBottom: '8px', fontSize: '14px', color: '#555' },
    cardLabel: { fontWeight: 'bold', color: '#333', marginRight: '5px', minWidth: '120px' },
    cardContent: { flexGrow: 1 },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', marginTop: '15px' },
    button: {
      padding: '8px 15px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 'bold',
      marginLeft: '10px',
      transition: 'all 0.2s ease',
      minWidth: '70px',
      textAlign: 'center'
    },
    detailsButton: {
      color: '#007bff',
      borderColor: '#007bff',
      '&:hover': { backgroundColor: '#e6f5ff' }
    },
    sanctionButton: {
      color: '#ffc107',
      borderColor: '#ffc107',
      '&:hover': { backgroundColor: '#fff3cd' }
    },
    deactivateButton: {
      color: '#dc3545',
      borderColor: '#dc3545',
      '&:hover': { backgroundColor: '#f8d7da' }
    },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>사용자 데이터를 불러오는 중...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>오류: {error}</div>;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>사용자 관리</div>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.userIdx} style={styles.userCard}>
            <div style={styles.cardItem}><span style={styles.cardLabel}>아이디:</span><span style={styles.cardContent}>{user.id}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>사용자 유형:</span><span style={styles.cardContent}>{user.userType}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>이메일:</span><span style={styles.cardContent}>{user.email}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>가입일:</span><span style={styles.cardContent}>{new Date(user.createTime).toLocaleDateString()}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>상태:</span><span style={styles.cardContent}>{user.status}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>혼잡도 입력 횟수:</span><span style={styles.cardContent}>{user.congestionCount}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>리뷰 개수:</span><span style={styles.cardContent}>{user.reviewCount}</span></div>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleViewDetails(user.userIdx)} style={{ ...styles.button, ...styles.detailsButton }}>상세보기</button>
              <button onClick={() => handleSanction(user.userIdx)} style={{ ...styles.button, ...styles.sanctionButton }}>제재</button>
              <button onClick={() => handleDeactivate(user.userIdx)} style={{ ...styles.button, ...styles.deactivateButton }}>탈퇴 처리</button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>등록된 사용자가 없습니다.</p>
      )}
    </div>
  );
};

export default AdminUserPanel;