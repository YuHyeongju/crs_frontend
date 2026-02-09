import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHistory } from 'react-icons/fa';

const MyCongestionsPanel = () => {
  const [congestions, setCongestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdx = sessionStorage.getItem('userIdx');
    if (!userIdx) {
      setLoading(false);
      return;
    }

    axios.get(`/api/congestion/history`)
      .then(res => {
        setCongestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("혼잡도 변경 이력 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

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
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: status === '혼잡' ? '#FFE9E9' : status === '보통' ? '#FFF4E5' : '#E8F5E9',
      color: status === '혼잡' ? '#D32F2F' : status === '보통' ? '#EF6C00' : '#2E7D32',
      border: `1px solid ${status === '혼잡' ? '#FFCDCD' : status === '보통' ? '#FFD8A8' : '#C8E6C9'}`,
      display: 'inline-block'
    }),
    time: { fontSize: '12px', color: '#999' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>이력을 불러오는 중입니다...</div>;

  return (
    <div style={panelStyles.container}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#333' }}>
        나의 혼잡도 변경 이력
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
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('ko-KR', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : '시간 정보 없음'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCongestionsPanel;