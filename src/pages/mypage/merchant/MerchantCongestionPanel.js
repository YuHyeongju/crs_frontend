// import React from 'react';

// const MerchantCongestionPanel = () => {
//   // 상태 업데이트가 필요 없으므로 const로 데이터를 직접 선언
//   const congestionData = [
//     { datetime: '2025.08.17 18:00', storeName: 'CRS 식당', level: '보통' },
//     { datetime: '2025.08.17 12:30', storeName: 'CRS 식당', level: '혼잡' },
//     { datetime: '2025.08.16 19:00', storeName: 'CRS 식당', level: '매우 혼잡' },
//     { datetime: '2025.08.16 13:00', storeName: 'CRS 식당', level: '여유' },
//   ];

//   const styles = {
//     container: {
//       padding: '30px',
//       fontFamily: 'Arial, sans-serif',
//     },
//     title: {
//       fontSize: '24px',
//       fontWeight: 'bold',
//       marginBottom: '30px',
//       color: '#333',
//       textAlign: 'center',
//     },
//     tableWrapper: {
//       backgroundColor: '#fff',
//       border: '1px solid #ddd',
//       padding: '20px',
//       borderRadius: '8px',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//     },
//     thead: {
//       borderBottom: '2px solid #000',
//     },
//     th: {
//       padding: '12px',
//       textAlign: 'center',
//       fontSize: '15px',
//       color: '#000',
//       fontWeight: 'bold',
//     },
//     tbody: {
//       // 특별한 스타일 변경 없음
//     },
//     tr: {
//       borderBottom: '1px solid #eee',
//     },
//     td: {
//       padding: '12px',
//       fontSize: '14px',
//       color: '#444',
//       textAlign: 'center',
//     },
//     emptyMessage: {
//       textAlign: 'center',
//       padding: '20px',
//       color: '#888',
//       fontSize: '16px',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>혼잡도 변경 내역</h2>
//       <div style={styles.tableWrapper}>
//         <table style={styles.table}>
//           <thead style={styles.thead}>
//             <tr>
//               <th style={styles.th}>날짜 & 시간</th>
//               <th style={styles.th}>식당 이름</th>
//               <th style={styles.th}>혼잡도 수준</th>
//             </tr>
//           </thead>
//           <tbody>
//             {congestionData.length > 0 ? (
//               congestionData.map((item, index) => (
//                 <tr key={index} style={styles.tr}>
//                   <td style={styles.td}>{item.datetime}</td>
//                   <td style={styles.td}>{item.storeName}</td>
//                   <td style={styles.td}>{item.level}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" style={styles.emptyMessage}>
//                   혼잡도 입력 내역이 없습니다.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MerchantCongestionPanel;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHistory } from 'react-icons/fa'; // 일반 사용자와 동일한 아이콘

const MerchantCongestionPanel = () => {
  const [congestions, setCongestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 세션 정보를 기반으로 본인이 변경한 이력 가져오기
    axios.get(`/api/congestion/history`, { withCredentials: true })
      .then(res => {
        setCongestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("혼잡도 변경 이력 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

  // 일반 사용자용(MyCongestionsPanel)과 동일한 스타일 적용
  const panelStyles = {
    container: { padding: '10px' },
    list: { listStyle: 'none', padding: 0 },
    item: {
      padding: '18px 15px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    storeName: { fontSize: '16px', fontWeight: 'bold', color: '#2C3E50', display: 'block', marginBottom: '4px' },
    statusBadge: (status) => ({
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: status === '혼잡' ? '#e74c3c' : status === '보통' ? '#f39c12' : '#2ecc71',
      display: 'inline-block'
    }),
    time: { fontSize: '12px', color: '#999' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>이력을 불러오는 중입니다...</div>;

  return (
    <div style={panelStyles.container}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#333' }}>
        나의 혼잡도 변경 이력 (상인용)
      </h2>
      {congestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#bbb' }}>
          <FaHistory style={{ fontSize: '40px', marginBottom: '10px', color: '#eee' }} />
          <p>아직 변경하신 혼잡도 이력이 없습니다.</p>
        </div>
      ) : (
        <ul style={panelStyles.list}>
          {congestions.map((item) => (
            <li key={item.congIdx} style={panelStyles.item}>
              <div>
                <span style={panelStyles.storeName}>{item.restName}</span>
                <span style={panelStyles.statusBadge(item.status)}>
                  {item.status}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={panelStyles.time}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('ko-KR') : '-'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MerchantCongestionPanel;