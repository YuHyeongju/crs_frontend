// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AdminStorePanel = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 1. 화면 렌더링 시 대기 목록 API 호출
//   useEffect(() => {
//     fetchPendingRequests();
//   }, []);

//   const fetchPendingRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/admins/pending');
//       setRequests(response.data); // 서버에서 받은 데이터로 상태 업데이트
//     } catch (err) {
//       setError('데이터를 불러오는 데 실패했습니다.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. 승인 로직 API 호출
//   const handleApprove = async (restIdx) => {
//     if (!window.confirm('정말 승인하시겠습니까?')) return;

//     try {
//       await axios.post(`/api/admins/approve/${restIdx}`);
//       alert('가게가 승인되었습니다.');
//       // 목록 새로고침
//       fetchPendingRequests();
//     } catch (err) {
//       alert('승인 처리 중 오류가 발생했습니다.');
//       console.error(err);
//     }
//   };

//   // 3. 거절 로직 API 호출
//   const handleReject = async (restIdx) => {
//     if (!window.confirm('정말 거절하시겠습니까?')) return;

//     try {
//       await axios.post(`/api/admins/reject/${restIdx}`);
//       alert('가게가 거절되었습니다.');
//       // 목록 새로고침
//       fetchPendingRequests();
//     } catch (err) {
//       alert('거절 처리 중 오류가 발생했습니다.');
//       console.error(err);
//     }
//   };

//   const styles = {
//     panel: { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
//     header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
//     table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
//     tableHeader: { backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6' },
//     tableCell: { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontSize: '14px', color: '#555' },
//     actionCell: { width: '150px', whiteSpace: 'nowrap' },
//     button: { padding: '8px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
//     approveButton: { backgroundColor: '#28a745', color: 'white', marginRight: '5px' },
//     rejectButton: { backgroundColor: '#dc3545', color: 'white' }
//   };

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div style={styles.panel}>
//       <div style={styles.header}>식당 승인 관리 (대기 목록)</div>
//       <table style={styles.table}>
//         <thead>
//           <tr style={styles.tableHeader}>
//             <th style={styles.tableCell}>가게명</th>
//             <th style={styles.tableCell}>주소</th>
//             <th style={styles.tableCell}>요청일</th>
//             <th style={{ ...styles.tableCell, ...styles.actionCell }}>승인/거절</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.length > 0 ? (
//             requests.map((request) => (
//               <tr key={request.restIdx}>
//                 <td style={styles.tableCell}>{request.restName}</td>
//                 <td style={styles.tableCell}>{request.restddress}</td>
//                 {/* 날짜 필드는 API 응답에 맞춰 수정 필요 */}
//                 <td style={styles.tableCell}>{request.createdAt || 'N/A'}</td>
//                 <td style={{ ...styles.tableCell, ...styles.actionCell }}>
//                   <button onClick={() => handleApprove(request.restIdx)} style={{ ...styles.button, ...styles.approveButton }}>승인</button>
//                   <button onClick={() => handleReject(request.restIdx)} style={{ ...styles.button, ...styles.rejectButton }}>거절</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>처리할 요청이 없습니다.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminStorePanel;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminStorePanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. 화면 렌더링 시 대기 목록 API 호출
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admins/pending');
      setRequests(response.data); // 서버에서 받은 데이터로 상태 업데이트
    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. 승인 로직 API 호출
  const handleApprove = async (restIdx) => {
    if (!window.confirm('정말 승인하시겠습니까?')) return;

    try {
      await axios.post(`/api/admins/approve/${restIdx}`);
      alert('가게가 승인되었습니다.');
      // 목록 새로고침
      fetchPendingRequests();
    } catch (err) {
      alert('승인 처리 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  // 3. 거절 로직 API 호출
  const handleReject = async (restIdx) => {
    if (!window.confirm('정말 거절하시겠습니까?')) return;

    try {
      await axios.post(`/api/admins/reject/${restIdx}`);
      alert('가게가 거절되었습니다.');
      // 목록 새로고침
      fetchPendingRequests();
    } catch (err) {
      alert('거절 처리 중 오류가 발생했습니다.');
      console.error(err);
    }
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>식당 승인 관리 (대기 목록)</div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>가게명</th>
            <th style={styles.tableCell}>주소</th>
            <th style={styles.tableCell}>요청일</th>
            <th style={{ ...styles.tableCell, ...styles.actionCell }}>승인/거절</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.restIdx}>
                <td style={styles.tableCell}>{request.restName}</td>
                <td style={styles.tableCell}>{request.restAddress}</td>
                {/* 날짜 필드는 API 응답에 맞춰 수정 필요 */}
                <td style={styles.tableCell}>{request.createdAt || 'N/A'}</td>
                <td style={{ ...styles.tableCell, ...styles.actionCell }}>
                  <button onClick={() => handleApprove(request.restIdx)} style={{ ...styles.button, ...styles.approveButton }}>승인</button>
                  <button onClick={() => handleReject(request.restIdx)} style={{ ...styles.button, ...styles.rejectButton }}>거절</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>처리할 요청이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStorePanel;