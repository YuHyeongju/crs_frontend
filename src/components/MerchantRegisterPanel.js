import React, { useState } from 'react';
import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle } from 'react-icons/fa';

const MerchantRegisterPanel = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    operatingHours: '',
    menus: [],
    facilities: [],
  });
  const [newMenu, setNewMenu] = useState({ name: '', price: '', imageFile: null, imagePreviewUrl: '' });

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
        menus: [...prev.menus, { name: newMenu.name, price: newMenu.price, image: newMenu.imageFile, imagePreviewUrl: newMenu.imagePreviewUrl }]
      }));
      setNewMenu({ name: '', price: '', imageFile: null, imagePreviewUrl: '' }); // 메뉴 추가 후 입력창 초기화
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

  const handleRegisterClick = () => {
    // 실제로는 이 데이터를 백엔드 API로 전송합니다. FormData를 사용하여 파일과 함께 전송해야 합니다.
    console.log('등록할 식당 정보:', storeInfo);
    alert('식당이 성공적으로 등록되었습니다!');
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
    menuFileBtn: {
      display: 'none',
    },
    addMenuBtn: { padding: '8px 15px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' },
    facilitiesContainer: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '14px', color: '#555' },
    registerBtn: { width: '100%', padding: '15px 20px', border: 'none', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
    imagePreview: {
      width: '50px',
      height: '50px',
      borderRadius: '5px',
      objectFit: 'cover',
      marginLeft: '10px',
    },
  };

  const facilitiesOptions = ['와이파이', '화장실', '주차가능', '포장 가능', '카카오페이', '삼성페이', '키오스크'];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>식당 등록</h2>

      {/* 식당 기본 정보 */}
      <div style={styles.section}>
        <div style={styles.formGroup}><FaStore style={styles.icon} /><input type="text" name="name" value={storeInfo.name} onChange={handleStoreInfoChange} placeholder="식당명" style={styles.input} /></div>
        <div style={styles.formGroup}><FaPhone style={styles.icon} /><input type="text" name="phoneNumber" value={storeInfo.phoneNumber} onChange={handleStoreInfoChange} placeholder="전화번호" style={styles.input} /></div>
        <div style={styles.formGroup}><FaMapMarkerAlt style={styles.icon} /><input type="text" name="address" value={storeInfo.address} onChange={handleStoreInfoChange} placeholder="식당 주소" style={styles.input} /></div>
        <div style={styles.formGroup}><FaClock style={styles.icon} /><input type="text" name="operatingHours" value={storeInfo.operatingHours} onChange={handleStoreInfoChange} placeholder="영업 시간" style={styles.input} /></div>
      </div>

      {/* 메뉴 등록 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>메뉴 등록</div>
        {storeInfo.menus.map((menu, index) => (
          <div key={index} style={styles.menuItem}>
            {menu.imagePreviewUrl && (
              <img src={menu.imagePreviewUrl} alt={menu.name} style={styles.menuItemImage} />
            )}
            <span style={styles.menuItemText}>
              {menu.name} - {menu.price}원
            </span>
            <button onClick={() => handleRemoveMenu(index)} style={styles.menuRemoveBtn}>
              <FaTimesCircle color="#dc3545" size="18px" />
            </button>
          </div>
        ))}
        <div style={styles.menuAddGroup}>
          <input type="text" name="name" value={newMenu.name} onChange={handleNewMenuChange} placeholder="메뉴 이름" style={styles.menuAddInput} />
          <input type="text" name="price" value={newMenu.price} onChange={handleNewMenuChange} placeholder="가격" style={styles.menuAddInput} />
          <label htmlFor="menu-image" style={styles.menuFileLabel}>
            사진 추가
          </label>
          <input type="file" id="menu-image" onChange={handleMenuImageChange} style={styles.menuFileBtn} />
          {newMenu.imagePreviewUrl && (
            <img src={newMenu.imagePreviewUrl} alt="미리보기" style={styles.imagePreview} />
          )}
          <button onClick={handleAddMenu} style={styles.addMenuBtn}>메뉴 추가</button>
        </div>
      </div>

      {/* 식당 시설 등록 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>식당 시설 등록</div>
        <div style={styles.facilitiesContainer}>
          {facilitiesOptions.map(option => (
            <label key={option} style={styles.checkboxLabel}>
              <input type="checkbox" value={option} onChange={handleFacilityChange} />
              {option}
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleRegisterClick} style={styles.registerBtn}>가게 등록</button>
    </div>
  );
};

export default MerchantRegisterPanel;