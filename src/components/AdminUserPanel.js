import React, { useState } from 'react';

// 와이어프레임에 맞춰 더미 사용자 데이터 생성
const dummyUsers = [
  {
    id: 'user123',
    userType: '일반 사용자',
    email: 'user123@example.com',
    joinDate: '2024.01.15',
    status: '활성',
    congestionCount: 10,
    reviewCount: 5,
  },
  {
    id: 'merchant456',
    userType: '상인',
    email: 'merchant456@example.com',
    joinDate: '2023.11.01',
    status: '활성',
    congestionCount: 50,
    reviewCount: 20,
  },
  {
    id: 'user789',
    userType: '일반 사용자',
    email: 'user789@example.com',
    joinDate: '2024.03.20',
    status: '정지',
    congestionCount: 2,
    reviewCount: 1,
  },
];

const AdminUserPanel = () => {
  const [users, setUsers] = useState(dummyUsers);

  const handleViewDetails = (userId) => {
    alert(`사용자 ID: ${userId}의 상세 정보를 봅니다.`);
  };

  const handleSanction = (userId) => {
    if (window.confirm(`정말로 사용자 ID: ${userId}를 제재하시겠습니까?`)) {
      alert(`사용자 ID: ${userId}가 제재 처리되었습니다.`);
      setUsers(users.map(user => user.id === userId ? { ...user, status: '제재됨' } : user));
    }
  };

  const handleDeactivate = (userId) => {
    if (window.confirm(`정말로 사용자 ID: ${userId}를 탈퇴 처리하시겠습니까?`)) {
      alert(`사용자 ID: ${userId}가 탈퇴 처리되었습니다.`);
      setUsers(users.filter(user => user.id !== userId));
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
    cardLabel: { fontWeight: 'bold', color: '#333', marginRight: '5px', minWidth: '120px' }, // minWidth로 라벨 너비 고정
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

  return (
    <div style={styles.panel}>
      <div style={styles.header}>사용자 관리</div>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.cardItem}><span style={styles.cardLabel}>아이디:</span><span style={styles.cardContent}>{user.id}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>사용자 유형:</span><span style={styles.cardContent}>{user.userType}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>이메일:</span><span style={styles.cardContent}>{user.email}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>가입일:</span><span style={styles.cardContent}>{user.joinDate}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>상태:</span><span style={styles.cardContent}>{user.status}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>혼잡도 입력횟수:</span><span style={styles.cardContent}>{user.congestionCount}</span></div>
            <div style={styles.cardItem}><span style={styles.cardLabel}>리뷰 개수:</span><span style={styles.cardContent}>{user.reviewCount}</span></div>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleViewDetails(user.id)} style={{ ...styles.button, ...styles.detailsButton }}>상세보기</button>
              <button onClick={() => handleSanction(user.id)} style={{ ...styles.button, ...styles.sanctionButton }}>제재</button>
              <button onClick={() => handleDeactivate(user.id)} style={{ ...styles.button, ...styles.deactivateButton }}>탈퇴 처리</button>
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