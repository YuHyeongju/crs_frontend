import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MerchantSelectPanel = ({ onSelectStore }) => {
  // 1. 상태(State) 정의: 처음엔 빈 배열로 시작
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. 컴포넌트가 마운트될 때(처음 나타날 때) API 호출
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('/api/restaurants/my-restaurant-list', {
          withCredentials: true // 세션(userIdx)을 사용하므로 쿠키/세션 정보 포함 필수
        });
        setStores(response.data); // 서버에서 받은 ResponseDto 리스트 저장
      } catch (error) {
        console.error("식당 목록 로드 실패:", error);
        alert("가게 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#333' },
    storeList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    storeItem: {
      padding: '15px 20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    storeName: { fontSize: '18px', fontWeight: 'bold' },
    storeAddress: { fontSize: '14px', color: '#666', marginTop: '5px' },
  };

  if (loading) return <div style={styles.container}>데이터를 불러오는 중...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>식당 선택</h2>
      <div style={styles.storeList}>
        {/* 3. 더미 데이터 대신 서버에서 받은 stores를 맵핑 */}
        {stores.length > 0 ? (
          stores.map(store => (
            <div
              key={store.restIdx} // 서버에서 준 restIdx 사용
              style={styles.storeItem}
              onClick={() => onSelectStore(store.restIdx)} // ID 대신 restIdx 전달
            >
              <div style={styles.storeName}>{store.restName}</div>
              <div style={styles.storeAddress}>{store.restAddress}</div>
            </div>
          ))
        ) : (
          <div>등록된 식당이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MerchantSelectPanel;