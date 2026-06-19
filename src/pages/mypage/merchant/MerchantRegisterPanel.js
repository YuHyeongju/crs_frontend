import React, { useState } from 'react';
import axios from 'axios';
import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle, FaCamera, FaCheckSquare, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MerchantRegisterPanel = () => {
  const navigate = useNavigate();

  const [storeInfo, setStoreInfo] = useState({
    kakaoId: '',
    restName: '',
    restTel: '',
    restAddress: '',
    restBusiHours: '',
    latitude: null,
    longitude: null,
  });

  const [facilities, setFacilities] = useState({
    wifi: false,
    restRoom: false,
    parkingAvailable: false,
    packingPossible: false,
    kakaoPay: false,
    samsungPay: false,
    kiosk: false
  });

  const [menuList, setMenuList] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: '',
    price: '',
    imageFile: null,
    imagePreviewUrl: ''
  });

  // 카카오 장소 검색 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
  };

  // 카카오에서 내 가게 검색 (지도와 동일한 services.Places 사용)
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    if (!window.kakao || !window.kakao.maps) {
      alert('카카오 지도 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    window.kakao.maps.load(() => {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(searchKeyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
          alert('검색 결과가 없습니다.');
        }
      });
    });
  };

  // 검색 결과에서 내 가게 선택 → 카카오 정보 자동 채움 (kakaoId 포함)
  // kakaoId가 채워져야 백엔드가 지도에 이미 있는 가게(restIdx)를 찾아 claim 함
  const handleSelectPlace = (place) => {
    setStoreInfo(prev => ({
      ...prev,
      kakaoId: place.id,
      restName: place.place_name,
      restTel: place.phone || '',
      restAddress: place.road_address_name || place.address_name || '',
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    }));
    setSearchResults([]);
    setSearchKeyword('');
  };

  const handleFacilityChange = (e) => {
    const { name, checked } = e.target;
    setFacilities(prev => ({ ...prev, [name]: checked }));
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

  const geocodeAddress = (address) => new Promise((resolve) => {
    if (!window.kakao?.maps?.services) { resolve({ lat: null, lng: null }); return; }
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        resolve({ lat: null, lng: null });
      }
    });
  });

  const handleRegisterClick = async () => {
    if (!storeInfo.restName) {
      alert("식당 이름을 입력해주세요.");
      return;
    }

    let lat = storeInfo.latitude;
    let lng = storeInfo.longitude;

    // 카카오 검색 없이 직접 입력한 경우 주소로 좌표 변환 시도
    if ((lat === null || lng === null) && storeInfo.restAddress) {
      const coords = await geocodeAddress(storeInfo.restAddress);
      lat = coords.lat;
      lng = coords.lng;
    }

    const formData = new FormData();

    const requestData = {
      kakaoId: storeInfo.kakaoId || null,
      restName: storeInfo.restName,
      restTel: storeInfo.restTel,
      restAddress: storeInfo.restAddress,
      restBusiHours: storeInfo.restBusiHours,
      latitude: lat,
      longitude: lng,
      facilities: facilities,
      menulist: menuList.map(m => ({
        menuName: m.name,
        menuPrice: parseInt(m.price)
      }))
    };

    console.log(">>> [프론트엔드 디버깅] 백엔드로 전송하는 데이터(JSON):", JSON.stringify(requestData, null, 2));

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
        navigate('/');
      }
    } catch (error) {
      console.error("등록 실패:", error);
      // 백엔드 메시지(예: "이미 다른 사업자가 등록한 가게입니다.")를 그대로 노출
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
    registerBtn: { width: '100%', padding: '18px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    facilityGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' },
    previewContainer: { position: 'relative', display: 'flex', alignItems: 'center' },
    removePreviewIcon: { position: 'absolute', top: '-5px', right: '5px', color: '#ff4d4f', cursor: 'pointer', background: '#fff', borderRadius: '50%', fontSize: '14px' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>내 식당 등록</h2>

      {/* 카카오 장소 검색 섹션 — 지도에 이미 뜨는 내 가게를 찾아 연결(claim) */}
      <div style={styles.section}>
        <h4 style={{ marginBottom: '10px' }}><FaSearch style={styles.icon} /> 카카오에서 내 가게 찾기</h4>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px', lineHeight: '1.6', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
          <b>이미 카카오맵에 등록된 가게</b>라면 검색해서 선택해 주세요. 기존에 쌓인 리뷰·혼잡도가 그대로 이어집니다.<br/>
          <b>신규 창업 등 카카오에 없는 가게</b>라면 이 단계를 건너뛰고 아래 기본 정보를 직접 입력해 주세요.
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
            placeholder="내 가게 이름 검색 (예: 김밥천국 강남점)"
            style={styles.input}
          />
          <button type="button" onClick={handleSearch} style={styles.addBtn}>검색</button>
        </div>

        {searchResults.length > 0 && (
          <div style={{ marginTop: '12px', maxHeight: '220px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
            {searchResults.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
              >
                <div style={{ fontWeight: 'bold' }}>{place.place_name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{place.road_address_name || place.address_name}</div>
              </div>
            ))}
          </div>
        )}

        {storeInfo.kakaoId && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e6f5ff', borderRadius: '8px', fontSize: '13px', color: '#007bff' }}>
            ✓ 선택된 가게: <b>{storeInfo.restName}</b> — 카카오 연결됨
          </div>
        )}
      </div>

      {/* 기본 정보 섹션 */}
      <div style={styles.section}>
        <div style={styles.formGroup}><FaStore style={styles.icon} /><input name="restName" value={storeInfo.restName} onChange={handleInputChange} placeholder="식당 이름 (필수)" style={styles.input} /></div>
        <div style={styles.formGroup}><FaPhone style={styles.icon} /><input name="restTel" value={storeInfo.restTel} onChange={handleInputChange} placeholder="연락처" style={styles.input} /></div>
        <div style={styles.formGroup}><FaMapMarkerAlt style={styles.icon} /><input name="restAddress" value={storeInfo.restAddress} onChange={handleInputChange} placeholder="가게 주소" style={styles.input} /></div>
        <div style={styles.formGroup}><FaClock style={styles.icon} /><input name="restBusiHours" value={storeInfo.restBusiHours} onChange={handleInputChange} placeholder="운영 시간 (예: 11:00 - 21:00)" style={styles.input} /></div>
      </div>

      {/* 시설 정보 섹션 */}
      <div style={styles.section}>
        <h4 style={{ marginBottom: '10px' }}><FaCheckSquare style={styles.icon} /> 등록할 식당 시설 선택</h4>
        <div style={styles.facilityGrid}>
          {Object.keys(facilities).map(key => (
            <label key={key} style={styles.checkboxLabel}>
              <input type="checkbox" name={key} checked={facilities[key]} onChange={handleFacilityChange} />
              {key === 'wifi' ? '와이파이' : key === 'restRoom' ? '화장실' : key === 'parkingAvailable' ? '주차 가능' : key === 'packingPossible' ? '포장 가능' : key === 'kakaoPay' ? '카카오페이' : key === 'samsungPay' ? '삼성페이' : '키오스크'}
            </label>
          ))}
        </div>
      </div>

      {/* 메뉴 리스트 섹션 */}
      <div style={styles.section}>
        <h4 style={{ marginBottom: '15px' }}>메뉴 및 사진 등록</h4>

        {/* 이미 추가된 메뉴 목록 */}
        {menuList.map((m, i) => (
          <div key={i} style={styles.menuItem}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {m.imagePreviewUrl && <img src={m.imagePreviewUrl} alt="menu" style={styles.menuImg} />}
              <span>{m.name} - {Number(m.price).toLocaleString()}원</span>
            </div>
            <FaTimesCircle color="#ff4d4f" onClick={() => handleRemoveMenu(i)} style={{ cursor: 'pointer' }} />
          </div>
        ))}

        {/* 새 메뉴 입력 영역 */}
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>

          {/* 🌟 사진 선택 시 즉시 나타나는 미리보기 */}
          {newMenu.imagePreviewUrl && (
            <div style={styles.previewContainer}>
              <img src={newMenu.imagePreviewUrl} alt="preview" style={styles.menuImg} />
              <FaTimesCircle
                style={styles.removePreviewIcon}
                onClick={() => setNewMenu({...newMenu, imageFile: null, imagePreviewUrl: ''})}
              />
            </div>
          )}

          <input
            placeholder="메뉴명"
            value={newMenu.name}
            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
            style={{ ...styles.input, minWidth: '120px' }}
          />
          <input
            placeholder="가격"
            type="number"
            value={newMenu.price}
            onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
            style={{ ...styles.input, maxWidth: '100px' }}
          />

          {/* 사진 선택 버튼 (label 내부 input 구조로 클릭 오류 해결) */}
          <label style={styles.fileLabel}>
            <FaCamera />
            {newMenu.imageFile ? "변경" : "사진 추가"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          <button onClick={handleAddMenu} style={styles.addBtn}>메뉴 추가</button>
        </div>
      </div>

      <button onClick={handleRegisterClick} style={styles.registerBtn}>저장하기</button>
    </div>
  );
};

export default MerchantRegisterPanel;
