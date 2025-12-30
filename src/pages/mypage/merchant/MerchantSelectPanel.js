import React from 'react';

const MerchantSelectPanel = ({ onSelectStore }) => {
  // DB가 없으므로 더미 데이터로 대체
  const dummyStores = [
    { id: '1', name: '셀라스', address: '부산 금정구 금샘로 538' },
    { id: '2', name: 'ABC 식당', address: '부산 남구 용소로 123' },
    { id: '3', name: '맛있는 커피', address: '부산진구 가야대로 456' },
  ];

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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>식당 선택</h2>
      <div style={styles.storeList}>
        {dummyStores.map(store => (
          <div
            key={store.id}
            style={styles.storeItem}
            onClick={() => onSelectStore(store.id)}
          >
            <div style={styles.storeName}>{store.name}</div>
            <div style={styles.storeAddress}>{store.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantSelectPanel;