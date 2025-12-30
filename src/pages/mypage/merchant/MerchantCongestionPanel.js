import React from 'react';

const MerchantCongestionPanel = () => {
  // 상태 업데이트가 필요 없으므로 const로 데이터를 직접 선언
  const congestionData = [
    { datetime: '2025.08.17 18:00', storeName: 'CRS 식당', level: '보통' },
    { datetime: '2025.08.17 12:30', storeName: 'CRS 식당', level: '혼잡' },
    { datetime: '2025.08.16 19:00', storeName: 'CRS 식당', level: '매우 혼잡' },
    { datetime: '2025.08.16 13:00', storeName: 'CRS 식당', level: '여유' },
  ];

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333',
      textAlign: 'center',
    },
    tableWrapper: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      borderBottom: '2px solid #000',
    },
    th: {
      padding: '12px',
      textAlign: 'center',
      fontSize: '15px',
      color: '#000',
      fontWeight: 'bold',
    },
    tbody: {
      // 특별한 스타일 변경 없음
    },
    tr: {
      borderBottom: '1px solid #eee',
    },
    td: {
      padding: '12px',
      fontSize: '14px',
      color: '#444',
      textAlign: 'center',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '20px',
      color: '#888',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>혼잡도 입력 내역</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>날짜 & 시간</th>
              <th style={styles.th}>식당 이름</th>
              <th style={styles.th}>혼잡도 수준</th>
            </tr>
          </thead>
          <tbody>
            {congestionData.length > 0 ? (
              congestionData.map((item, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{item.datetime}</td>
                  <td style={styles.td}>{item.storeName}</td>
                  <td style={styles.td}>{item.level}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={styles.emptyMessage}>
                  혼잡도 입력 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantCongestionPanel;