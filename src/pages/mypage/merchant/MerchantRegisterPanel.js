// import React, { useState } from 'react';
// import axios from 'axios';
// import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle, FaUtensils } from 'react-icons/fa';

// const MerchantRegisterPanel = () => {
//   // 1. 백엔드 RestaurantRequestDto 구조에 최적화된 상태 관리
//   const [storeInfo, setStoreInfo] = useState({
//     kakaoId: '',
//     restName: '',
//     restTel: '',
//     restAddress: '',
//     restBusiHours: '',
//   });

//   // UI용 메뉴 리스트 상태 (객체 배열로 관리)
//   const [menuList, setMenuList] = useState([]);
//   const [newMenu, setNewMenu] = useState({ name: '', price: '' });

//   // 입력값 변경 핸들러
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStoreInfo(prev => ({ ...prev, [name]: value }));
//   };

//   // 메뉴 추가 핸들러
//   const handleAddMenu = () => {
//     if (newMenu.name && newMenu.price) {
//       setMenuList([...menuList, { ...newMenu }]);
//       setNewMenu({ name: '', price: '' }); // 입력창 초기화
//     } else {
//       alert('메뉴 이름과 가격을 입력해주세요.');
//     }
//   };

//   // 메뉴 삭제 핸들러
//   const handleRemoveMenu = (indexToRemove) => {
//     setMenuList(menuList.filter((_, index) => index !== indexToRemove));
//   };

//   // 2. 서버 전송 핸들러 (수정된 핵심 로직)
//   const handleRegisterClick = async () => {
//     if (!storeInfo.kakaoId || !storeInfo.restName) {
//       alert("식당 정보와 카카오 ID를 확인해주세요.");
//       return;
//     }

//     // [중요] 백엔드 DTO 규격에 맞게 데이터 최종 가공
//     const requestData = {
//       kakaoId: storeInfo.kakaoId,
//       restName: storeInfo.restName,
//       restTel: storeInfo.restTel,
//       restAddress: storeInfo.restAddress,
//       restBusiHours: storeInfo.restBusiHours,
      
//       // 메뉴 리스트를 DTO의 정적 내부 클래스 필드명과 일치시킴
//       menulist: menuList.map(m => ({
//         menuName: m.name,         // DTO 필드: menuName
//         menuPrice: parseInt(m.price) // DTO 필드: menuPrice (정수형 변환)
//       }))
//     };

//     try {
//       // API 경로는 컨트롤러 설정(@RequestMapping)에 맞춰 수정 필요
//       const response = await axios.post(
//         'http://localhost:8080/api/restaurant/register', 
//         requestData,
//         { withCredentials: true } 
//       );

//       if (response.status === 200 || response.status === 201) {
//         alert('식당과 메뉴가 성공적으로 등록되었습니다!');
//         console.log("서버 응답:", response.data);
//       }
//     } catch (error) {
//       console.error("등록 실패:", error);
//       alert(error.response?.data || "등록 중 오류가 발생했습니다. 필드 형식을 확인하세요.");
//     }
//   };

//   // 스타일 객체 (가독성을 위해 유지)
//   const styles = {
//     container: { padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
//     title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' },
//     section: { marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff' },
//     formGroup: { marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
//     input: { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' },
//     icon: { color: '#007bff', fontSize: '18px' },
//     addBtn: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//     registerBtn: { width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>내 식당 등록</h2>

//       {/* 기본 정보 */}
//       <div style={styles.section}>
//         <div style={styles.formGroup}><FaStore style={styles.icon} /><input name="restName" value={storeInfo.restName} onChange={handleInputChange} placeholder="식당명" style={styles.input} /></div>
//         <div style={styles.formGroup}><FaPhone style={styles.icon} /><input name="restTel" value={storeInfo.restTel} onChange={handleInputChange} placeholder="전화번호" style={styles.input} /></div>
//         <div style={styles.formGroup}><FaMapMarkerAlt style={styles.icon} /><input name="restAddress" value={storeInfo.restAddress} onChange={handleInputChange} placeholder="주소" style={styles.input} /></div>
//         <div style={styles.formGroup}><FaClock style={styles.icon} /><input name="restBusiHours" value={storeInfo.restBusiHours} onChange={handleInputChange} placeholder="영업시간 (예: 09:00~21:00)" style={styles.input} /></div>
//         <div style={styles.formGroup}><FaUtensils style={styles.icon} /><input name="kakaoId" value={storeInfo.kakaoId} onChange={handleInputChange} placeholder="카카오 장소 ID" style={styles.input} /></div>
//       </div>

//       {/* 메뉴 관리 */}
//       <div style={styles.section}>
//         <h4 style={{marginBottom: '10px'}}>메뉴 등록</h4>
//         {menuList.map((m, i) => (
//           <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee'}}>
//             <span>{m.name} - {Number(m.price).toLocaleString()}원</span>
//             <FaTimesCircle color="#ff4d4f" onClick={() => handleRemoveMenu(i)} style={{cursor: 'pointer'}} />
//           </div>
//         ))}
        
//         <div style={{...styles.formGroup, marginTop: '15px'}}>
//           <input placeholder="메뉴명" value={newMenu.name} onChange={(e)=>setNewMenu({...newMenu, name: e.target.value})} style={styles.input} />
//           <input placeholder="가격" type="number" value={newMenu.price} onChange={(e)=>setNewMenu({...newMenu, price: e.target.value})} style={styles.input} />
//           <button onClick={handleAddMenu} style={styles.addBtn}>추가</button>
//         </div>
//       </div>

//       <button onClick={handleRegisterClick} style={styles.registerBtn}>식당 등록하기</button>
//     </div>
//   );
// };

// export default MerchantRegisterPanel;

import React, { useState } from 'react';
import axios from 'axios';
import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle, FaCamera } from 'react-icons/fa';

const MerchantRegisterPanel = () => {
  // 1. 입력이 불필요한 kakaoId는 상태에서 초기화만 해둡니다.
  const [storeInfo, setStoreInfo] = useState({
    kakaoId: '', // 직접 등록 시에는 빈 값으로 유지
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

      if (response.status === 200) {
        alert('식당 정보가 성공적으로 저장되었습니다!');
        console.log("등록 결과:", response.data);
      }
    } catch (error) {
      console.error("등록 실패:", error);
      alert(error.response?.data || "등록 중 오류가 발생했습니다.");
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

      {/* 기본 정보 섹션 - 카카오 ID 입력란 삭제 */}
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