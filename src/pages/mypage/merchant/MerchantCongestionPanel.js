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