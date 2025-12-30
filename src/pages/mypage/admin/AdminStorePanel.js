import React, { useState } from 'react';

// 와이어프레임에 맞춰 더미 데이터 생성
const dummyRequests = [
  { id: 1, storeName: '샐러리', requesterName: '홍길동', requestType: '식당 삭제', address: '부산 금정구', requestDate: '25.5.15' },
  { id: 2, storeName: '버거킹', requesterName: '김철수', requestType: '상인 승인', address: '서울 강남구', requestDate: '25.5.16' },
  { id: 3, storeName: '피자헛', requesterName: '박영희', requestType: '식당 등록', address: '경기 수원시', requestDate: '25.5.17' },
];

const AdminStorePanel = () => {
  const [requests, setRequests] = useState(dummyRequests);

  const handleApprove = (id) => {
    // 승인 로직: 실제로는 서버 API를 호출하여 해당 요청을 승인합니다.
    alert(`요청 ID ${id}가 승인되었습니다.`);
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReject = (id) => {
    // 거절 로직: 실제로는 서버 API를 호출하여 해당 요청을 거절합니다.
    alert(`요청 ID ${id}가 거절되었습니다.`);
    setRequests(requests.filter(req => req.id !== id));
  };

  const styles = {
    panel: { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    tableHeader: { backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6' },
    tableCell: { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontSize: '14px', color: '#555' },
    actionCell: { width: '150px', whiteSpace: 'nowrap' },
    button: { padding: '8px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
    approveButton: { backgroundColor: '#28a745', color: 'white', marginRight: '5px' },
    rejectButton: { backgroundColor: '#dc3545', color: 'white' }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>식당 등록 / 삭제, 승인 / 거절</div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>가게명</th>
            <th style={styles.tableCell}>요청자명</th>
            <th style={styles.tableCell}>요청 유형</th>
            <th style={styles.tableCell}>주소</th>
            <th style={styles.tableCell}>요청일</th>
            <th style={{ ...styles.tableCell, ...styles.actionCell }}>승인/거절</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td style={styles.tableCell}>{request.storeName}</td>
                <td style={styles.tableCell}>{request.requesterName}</td>
                <td style={styles.tableCell}>{request.requestType}</td>
                <td style={styles.tableCell}>{request.address}</td>
                <td style={styles.tableCell}>{request.requestDate}</td>
                <td style={{ ...styles.tableCell, ...styles.actionCell }}>
                  <button onClick={() => handleApprove(request.id)} style={{ ...styles.button, ...styles.approveButton }}>승인</button>
                  <button onClick={() => handleReject(request.id)} style={{ ...styles.button, ...styles.rejectButton }}>거절</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>처리할 요청이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStorePanel;