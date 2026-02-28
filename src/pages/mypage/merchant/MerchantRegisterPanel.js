import React, { useState } from 'react';
import axios from 'axios';
import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle, FaCamera } from 'react-icons/fa';
// 1. Navigate 컴포넌트 대신 useNavigate 훅 임포트
import { useNavigate } from 'react-router-dom';

const MerchantRegisterPanel = () => {
  // 2. useNavigate 훅 초기화
  const navigate = useNavigate();

  const [storeInfo, setStoreInfo] = useState({
    kakaoId: '', 
    restName: '',
    restTel: '',
    restAddress: '',
    restBusiHours: '',
  });

  const [menuList, setMenuList] = useState([]);
  const [newMenu, setNewMenu] = useState({ 
    name: '', 
    price: '', 
    imageFile: null, 
    imagePreviewUrl: '' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMenu(prev => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleAddMenu = () => {
    if (newMenu.name && newMenu.price) {
      setMenuList([...menuList, { ...newMenu }]);
      setNewMenu({ name: '', price: '', imageFile: null, imagePreviewUrl: '' });
    } else {
      alert('메뉴 이름과 가격을 입력해주세요.');
    }
  };

  const handleRemoveMenu = (index) => {
    setMenuList(menuList.filter((_, i) => i !== index));
  };

  const handleRegisterClick = async () => {
    if (!storeInfo.restName) {
      alert("식당 이름을 입력해주세요.");
      return;
    }

    const formData = new FormData();

    const requestData = {
      kakaoId: storeInfo.kakaoId || null,
      restName: storeInfo.restName,
      restTel: storeInfo.restTel,
      restAddress: storeInfo.restAddress,
      restBusiHours: storeInfo.restBusiHours,
      menulist: menuList.map(m => ({
        menuName: m.name,
        menuPrice: parseInt(m.price)
      }))
    };

    console.log(">>> [프론트 디버깅] 서버로 전송하는 DTO 데이터:", requestData);
    console.log(">>> [프론트 디버깅] 메뉴 리스트 내용:", requestData.menulist);

    formData.append("dto", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

    menuList.forEach((menu) => {
      if (menu.imageFile) {
        formData.append("menuImages", menu.imageFile);
      }
    });

    try {
      const response = await axios.post(
        'http://localhost:8080/api/restaurants/register', 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      // 성공 시
      if (response.status === 200) {
        alert('식당 정보가 성공적으로 저장되었습니다!');
        console.log("등록 결과:", response.data);

        // 3. 올바른 페이지 이동 방식 (navigate 함수 호출)
        navigate('/');
      }
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const styles = {
    container: { padding: '30px', maxWidth: '650px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' },
    section: { marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    formGroup: { marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
    input: { flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '8px' },
    icon: { color: '#007bff', fontSize: '18px' },
    menuItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' },
    menuImg: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' },
    fileLabel: { padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    addBtn: { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    registerBtn: { width: '100%', padding: '18px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>내 가게 등록</h2>

      {/* 기본 정보 섹션 */}
      <div style={styles.section}>
        <div style={styles.formGroup}><FaStore style={styles.icon} /><input name="restName" value={storeInfo.restName} onChange={handleInputChange} placeholder="식당 이름 (필수)" style={styles.input} /></div>
        <div style={styles.formGroup}><FaPhone style={styles.icon} /><input name="restTel" value={storeInfo.restTel} onChange={handleInputChange} placeholder="연락처" style={styles.input} /></div>
        <div style={styles.formGroup}><FaMapMarkerAlt style={styles.icon} /><input name="restAddress" value={storeInfo.restAddress} onChange={handleInputChange} placeholder="가게 주소" style={styles.input} /></div>
        <div style={styles.formGroup}><FaClock style={styles.icon} /><input name="restBusiHours" value={storeInfo.restBusiHours} onChange={handleInputChange} placeholder="운영 시간 (예: 11:00 - 21:00)" style={styles.input} /></div>
      </div>

      {/* 메뉴 리스트 섹션 */}
      <div style={styles.section}>
        <h4 style={{marginBottom: '15px'}}>메뉴 및 사진 등록</h4>
        {menuList.map((m, i) => (
          <div key={i} style={styles.menuItem}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              {m.imagePreviewUrl && <img src={m.imagePreviewUrl} alt="menu" style={styles.menuImg} />}
              <span>{m.name} - {Number(m.price).toLocaleString()}원</span>
            </div>
            <FaTimesCircle color="#ff4d4f" onClick={() => handleRemoveMenu(i)} style={{cursor: 'pointer'}} />
          </div>
        ))}
        
        <div style={{marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
          <input placeholder="메뉴명" value={newMenu.name} onChange={(e)=>setNewMenu({...newMenu, name: e.target.value})} style={{...styles.input, minWidth: '120px'}} />
          <input placeholder="가격" type="number" value={newMenu.price} onChange={(e)=>setNewMenu({...newMenu, price: e.target.value})} style={{...styles.input, maxWidth: '100px'}} />
          
          <label htmlFor="file-upload" style={styles.fileLabel}>
            <FaCamera /> {newMenu.imageFile ? "변경" : "사진 추가"}
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
          
          <button onClick={handleAddMenu} style={styles.addBtn}>메뉴 추가</button>
        </div>
      </div>

      <button onClick={handleRegisterClick} style={styles.registerBtn}>저장하기</button>
    </div>
  );
};

export default MerchantRegisterPanel;