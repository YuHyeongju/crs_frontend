import React, { useState, useEffect } from 'react';
import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle } from 'react-icons/fa';

// 더미 데이터베이스
const dummyStoreData = {
  '1': {
    name: '셀라스',
    phoneNumber: '051-1234-5678',
    address: '부산 금정구 금샘로 538 1,2층',
    operatingHours: '매일 10:00 ~ 21:40',
    menus: [
      { name: '샐라그라피 라떼', price: '6500원', imagePreviewUrl: 'https://via.placeholder.com/50' },
      { name: '에스프레소', price: '5000원', imagePreviewUrl: 'https://via.placeholder.com/50' },
    ],
    facilities: ['와이파이', '화장실', '주차가능'],
    isCongestionVisible: true,
  },
  '2': {
    name: 'ABC 식당',
    phoneNumber: '051-9876-5432',
    address: '부산 남구 용소로 123',
    operatingHours: '월~금 09:00 ~ 20:00',
    menus: [{ name: '김치찌개', price: '9000원', imagePreviewUrl: 'https://via.placeholder.com/50' }],
    facilities: ['포장 가능', '키오스크'],
    isCongestionVisible: false,
  },
  '3': {
    name: '맛있는 커피',
    phoneNumber: '051-555-5555',
    address: '부산진구 가야대로 456',
    operatingHours: '평일 08:00 ~ 22:00',
    menus: [{ name: '아메리카노', price: '4500원', imagePreviewUrl: 'https://via.placeholder.com/50' }],
    facilities: ['와이파이', '삼성페이'],
    isCongestionVisible: true,
  },
};

const MerchantEditDeletePanel = ({ storeId }) => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [newMenu, setNewMenu] = useState({ name: '', price: '', imageFile: null, imagePreviewUrl: '' });

  useEffect(() => {
    if (storeId) {
      // storeId에 해당하는 데이터를 dummyStoreData에서 찾아서 설정
      const data = dummyStoreData[storeId];
      if (data) {
        setStoreInfo({ ...data });
      } else {
        // ID에 해당하는 데이터가 없을 경우 처리
        setStoreInfo(null);
        alert('해당 식당 정보를 찾을 수 없습니다.');
      }
    } else {
      setStoreInfo(null);
    }
  }, [storeId]);

  if (!storeInfo) {
    return <div>로딩 중이거나, 식당을 선택해주세요.</div>;
  }

  const handleStoreInfoChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNewMenuChange = (e) => {
    const { name, value } = e.target;
    setNewMenu(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMenu(prev => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file)
      }));
    } else {
      setNewMenu(prev => ({ ...prev, imageFile: null, imagePreviewUrl: '' }));
    }
  };

  const handleAddMenu = () => {
    if (newMenu.name && newMenu.price) {
      setStoreInfo(prev => ({
        ...prev,
        menus: [...prev.menus, { name: newMenu.name, price: newMenu.price, imagePreviewUrl: newMenu.imagePreviewUrl }]
      }));
      setNewMenu({ name: '', price: '', imageFile: null, imagePreviewUrl: '' });
    } else {
      alert('메뉴 이름과 가격을 모두 입력해주세요.');
    }
  };

  const handleRemoveMenu = (indexToRemove) => {
    setStoreInfo(prev => ({
      ...prev,
      menus: prev.menus.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleFacilityChange = (e) => {
    const { value, checked } = e.target;
    setStoreInfo(prev => {
      if (checked) {
        return { ...prev, facilities: [...prev.facilities, value] };
      } else {
        return { ...prev, facilities: prev.facilities.filter(f => f !== value) };
      }
    });
  };

  const handleCongestionToggle = () => {
    setStoreInfo(prev => ({
      ...prev,
      isCongestionVisible: !prev.isCongestionVisible
    }));
  };

  const handleUpdateClick = () => {
    console.log('수정된 식당 정보:', storeInfo);
    alert('식당 정보가 성공적으로 수정되었습니다!');
  };

  const handleDeleteClick = () => {
    if (window.confirm('정말로 식당을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('식당 삭제 요청:', storeInfo.name);
      alert('식당이 성공적으로 삭제되었습니다.');
    }
  };

  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#333' },
    section: { marginBottom: '25px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#555' },
    formGroup: { marginBottom: '15px', display: 'flex', alignItems: 'center' },
    input: { flexGrow: 1, border: '1px solid #ccc', borderRadius: '5px', padding: '10px', fontSize: '16px', marginLeft: '10px' },
    icon: { fontSize: '20px', color: '#007bff' },
    menuList: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
    menuItem: { display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '5px', border: '1px solid #eee' },
    menuItemImage: { width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover', marginRight: '10px' },
    menuItemText: { flexGrow: 1, color: '#555', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    menuRemoveBtn: { marginLeft: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' },
    menuAddGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
    menuAddInput: { flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '5px' },
    menuFileLabel: {
      padding: '8px 15px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#555',
    },
    menuFileBtn: { display: 'none' },
    addMenuBtn: { padding: '8px 15px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' },
    facilitiesContainer: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '14px', color: '#555' },
    congestionToggleContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '20px',
      backgroundColor: '#f5f5f5',
      padding: '15px',
      borderRadius: '8px',
      border: '1px dashed #999',
    },
    toggleLabel: { fontSize: '16px', color: '#555', marginRight: '10px' },
    toggleSwitch: {
      width: '60px',
      height: '30px',
      backgroundColor: storeInfo.isCongestionVisible ? '#007bff' : '#ccc',
      borderRadius: '15px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    toggleSlider: {
      position: 'absolute',
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      backgroundColor: 'white',
      top: '2px',
      left: storeInfo.isCongestionVisible ? '32px' : '2px',
      transition: 'left 0.3s',
    },
    buttonsContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '20px' },
    updateBtn: { flexGrow: 1, padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
    deleteBtn: { flexGrow: 1, padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#dc3545', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  };

  const facilitiesOptions = ['와이파이', '화장실', '주차가능', '포장 가능', '카카오페이', '삼성페이', '키오스크'];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>식당 정보 수정</h2>
      
      {/* 식당 기본 정보 */}
      <div style={styles.section}>
        <div style={styles.formGroup}><FaStore style={styles.icon} /><input type="text" name="name" value={storeInfo.name} onChange={handleStoreInfoChange} placeholder="식당명" style={styles.input} /></div>
        <div style={styles.formGroup}><FaPhone style={styles.icon} /><input type="text" name="phoneNumber" value={storeInfo.phoneNumber} onChange={handleStoreInfoChange} placeholder="전화번호" style={styles.input} /></div>
        <div style={styles.formGroup}><FaMapMarkerAlt style={styles.icon} /><input type="text" name="address" value={storeInfo.address} onChange={handleStoreInfoChange} placeholder="식당 주소" style={styles.input} /></div>
        <div style={styles.formGroup}><FaClock style={styles.icon} /><input type="text" name="operatingHours" value={storeInfo.operatingHours} onChange={handleStoreInfoChange} placeholder="영업 시간" style={styles.input} /></div>
      </div>
      
      {/* 메뉴 수정 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>메뉴 정보</div>
        <div style={styles.menuList}>
          {storeInfo.menus.map((menu, index) => (
            <div key={index} style={styles.menuItem}>
              {menu.imagePreviewUrl && <img src={menu.imagePreviewUrl} alt={menu.name} style={styles.menuItemImage} />}
              <span style={styles.menuItemText}>{menu.name} - {menu.price}</span>
              <button onClick={() => handleRemoveMenu(index)} style={styles.menuRemoveBtn}>
                <FaTimesCircle color="#dc3545" size="18px" />
              </button>
            </div>
          ))}
        </div>
        <div style={styles.menuAddGroup}>
          <input type="text" name="name" value={newMenu.name} onChange={handleNewMenuChange} placeholder="메뉴 이름" style={styles.menuAddInput} />
          <input type="text" name="price" value={newMenu.price} onChange={handleNewMenuChange} placeholder="가격" style={styles.menuAddInput} />
          <label htmlFor="edit-menu-image" style={styles.menuFileLabel}>
            사진 추가
          </label>
          <input type="file" id="edit-menu-image" onChange={handleMenuImageChange} style={styles.menuFileBtn} />
          <button onClick={handleAddMenu} style={styles.addMenuBtn}>메뉴 추가</button>
        </div>
      </div>

      {/* 식당 시설 등록 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>식당 시설 등록</div>
        <div style={styles.facilitiesContainer}>
          {facilitiesOptions.map(option => (
            <label key={option} style={styles.checkboxLabel}>
              <input type="checkbox" value={option} onChange={handleFacilityChange} checked={storeInfo.facilities.includes(option)} />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* 혼잡도 노출 여부 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>혼잡도 노출 여부</div>
        <div style={styles.congestionToggleContainer}>
          <span style={styles.toggleLabel}>혼잡도 노출</span>
          <div style={styles.toggleSwitch} onClick={handleCongestionToggle}>
            <div style={styles.toggleSlider}></div>
          </div>
        </div>
      </div>

      {/* 수정/삭제 버튼 */}
      <div style={styles.buttonsContainer}>
        <button onClick={handleUpdateClick} style={styles.updateBtn}>수정</button>
        <button onClick={handleDeleteClick} style={styles.deleteBtn}>식당 삭제</button>
      </div>
    </div>
  );
};

export default MerchantEditDeletePanel;