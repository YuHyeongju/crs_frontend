import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FaStore, FaPhone, FaMapMarkerAlt, FaClock, FaTimesCircle, FaTicketAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const MerchantEditDeletePanel = ({ storeId, onBack }) => {
  const navigate = useNavigate();
  const { userIdx } = useContext(AuthContext);
  const [storeInfo, setStoreInfo] = useState(null);
  const [newMenu, setNewMenu] = useState({ name: '', price: '', imageFile: null, imagePreviewUrl: '' });
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [editingCouponIdx, setEditingCouponIdx] = useState(null);
  const [editingCouponForm, setEditingCouponForm] = useState({});

  const fetchCoupons = useCallback(async () => {
    if (!userIdx) return;
    try {
      const res = await axios.get(`/api/coupons/my-store/${userIdx}`);
      setCoupons((res.data || []).filter(c => c.restIdx === Number(storeId)));
    } catch (err) {
      console.error('쿠폰 로드 실패:', err);
    }
  }, [userIdx, storeId]);

  // 1. 초기 데이터 로드 (상세 정보 가져오기)
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      try {
        setLoading(true);
        const [storeRes] = await Promise.all([
          axios.get(`/api/restaurants/edit/${storeId}`, { withCredentials: true }),
          fetchCoupons(),
        ]);
        setStoreInfo(storeRes.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert('식당 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [storeId, fetchCoupons]);

  if (loading || !storeInfo) return <div style={{ padding: '30px' }}>데이터를 불러오는 중...</div>;

  // --- 핸들러 함수들 ---

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
    }
  };

  const handleAddMenu = () => {
    if (newMenu.name && newMenu.price) {
      const updatedMenuList = [...(storeInfo.menulist || []), {
        menuName: newMenu.name,
        menuPrice: newMenu.price,
        imageFile: newMenu.imageFile,
        imagePreviewUrl: newMenu.imagePreviewUrl
      }];
      setStoreInfo(prev => ({ ...prev, menulist: updatedMenuList }));
      setNewMenu({ name: '', price: '', imageFile: null, imagePreviewUrl: '' });
    } else {
      alert('메뉴 이름과 가격을 입력해주세요.');
    }
  };

  const handleRemoveMenu = (indexToRemove) => {
    setStoreInfo(prev => ({
      ...prev,
      menulist: prev.menulist.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleFacilityChange = (e) => {
    const { name, checked } = e.target;
    setStoreInfo(prev => ({
      ...prev,
      facilities: { ...prev.facilities, [name]: checked }
    }));
  };

  // 2. 수정 완료 (Update) 로직
  const handleUpdateClick = async () => {
    try {
      const formData = new FormData();
      const dto = {
        restName: storeInfo.restName,
        restTel: storeInfo.restTel,
        restAddress: storeInfo.restAddress,
        restBusiHours: storeInfo.restBusiHours,
        facilities: storeInfo.facilities,
        menulist: storeInfo.menulist.map(m => ({
          menuName: m.menuName,
          menuPrice: parseInt(m.menuPrice)
        }))
      };
      formData.append("dto", new Blob([JSON.stringify(dto)], { type: 'application/json' }));

      storeInfo.menulist.forEach(menu => {
        if (menu.imageFile) {
          formData.append("menuImages", menu.imageFile);
        }
      });

      await axios.post(`/api/restaurants/update/${storeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      alert('식당 정보가 성공적으로 수정되었습니다!');
      if (onBack) onBack();
      else navigate('/');
    } catch (error) {
      console.error("수정 실패:", error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  
  const handleDeleteClick = async () => {
    if (window.confirm('정말로 삭제하시겠습니까? 관련 데이터와 사진이 모두 영구 삭제됩니다.')) {
      try {
        
        await axios.post(`/api/restaurants/delete/${storeId}`, {}, { withCredentials: true });

        alert('성공적으로 삭제되었습니다.');

        if (onBack) {
          onBack(); 
        } else {
          navigate('/'); 
        }
      } catch (error) {
        console.error("삭제 실패:", error);
        alert('삭제 처리 중 오류가 발생했습니다.');
      }
    }
  };

  // --- 쿠폰 핸들러 ---
  const handleCouponEditStart = (c) => {
    setEditingCouponIdx(c.couponIdx);
    setEditingCouponForm({
      title: c.title,
      description: c.description || '',
      pointCost: c.pointCost,
      validUntil: c.validUntil || '',
    });
  };

  const handleCouponEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCouponForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCouponEditSave = async (couponIdx) => {
    if (!editingCouponForm.title.trim()) { alert('쿠폰 이름을 입력해주세요.'); return; }
    if (!editingCouponForm.pointCost || Number(editingCouponForm.pointCost) <= 0) { alert('필요 포인트를 올바르게 입력해주세요.'); return; }
    try {
      await axios.post(`/api/coupons/update/${couponIdx}`, {
        title: editingCouponForm.title.trim(),
        description: editingCouponForm.description.trim(),
        pointCost: Number(editingCouponForm.pointCost),
        validUntil: editingCouponForm.validUntil || null,
      }, { params: { merchantUserIdx: Number(userIdx) } });
      setEditingCouponIdx(null);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data || '쿠폰 수정에 실패했습니다.');
    }
  };

  const handleCouponDelete = async (couponIdx) => {
    if (!window.confirm('이 쿠폰을 삭제(비활성화)할까요?')) return;
    try {
      await axios.post(`/api/coupons/delete/${couponIdx}`, null, {
        params: { merchantUserIdx: Number(userIdx) },
      });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data || '쿠폰 삭제에 실패했습니다.');
    }
  };

  // --- 스타일 정의 ---
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
    menuItemText: { flexGrow: 1, color: '#555', fontSize: '14px' },
    menuRemoveBtn: { border: 'none', backgroundColor: 'transparent', cursor: 'pointer' },
    menuAddGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
    menuAddInput: { flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '5px' },
    menuFileLabel: { padding: '8px 15px', backgroundColor: '#f0f0f0', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' },
    addMenuBtn: { padding: '8px 15px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' },
    facilitiesContainer: { display: 'flex', flexWrap: 'wrap', gap: '15px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '14px', color: '#555', cursor: 'pointer' },
    buttonsContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '20px' },
    updateBtn: { flexGrow: 1, padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
    deleteBtn: { flexGrow: 1, padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#dc3545', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
    couponInput: { width: '100%', padding: '9px 10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', marginTop: '4px' },
    couponLabel: { fontSize: '13px', fontWeight: 'bold', color: '#555' },
    couponRegisterBtn: { width: '100%', padding: '11px', border: 'none', borderRadius: '6px', backgroundColor: '#007bff', color: 'white', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
    couponItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '6px', padding: '12px 15px', marginBottom: '8px' },
    couponDeleteBtn: { border: '1px solid #dc3545', backgroundColor: 'white', color: '#dc3545', borderRadius: '5px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px' },
  };

  const facilityOptions = [
    { name: 'wifi', label: '와이파이' },
    { name: 'restRoom', label: '화장실' },
    { name: 'parkingAvailable', label: '주차가능' },
    { name: 'packingPossible', label: '포장 가능' },
    { name: 'kakaoPay', label: '카카오페이' },
    { name: 'samsungPay', label: '삼성페이' },
    { name: 'kiosk', label: '키오스크' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>식당 정보 관리</h2>

      {/* 기본 정보 */}
      <div style={styles.section}>
        <div style={styles.formGroup}><FaStore style={styles.icon} /><input type="text" name="restName" value={storeInfo.restName || ''} onChange={handleStoreInfoChange} placeholder="식당명" style={styles.input} /></div>
        <div style={styles.formGroup}><FaPhone style={styles.icon} /><input type="text" name="restTel" value={storeInfo.restTel || ''} onChange={handleStoreInfoChange} placeholder="전화번호" style={styles.input} /></div>
        <div style={styles.formGroup}><FaMapMarkerAlt style={styles.icon} /><input type="text" name="restAddress" value={storeInfo.restAddress || ''} onChange={handleStoreInfoChange} placeholder="식당 주소" style={styles.input} /></div>
        <div style={styles.formGroup}><FaClock style={styles.icon} /><input type="text" name="restBusiHours" value={storeInfo.restBusiHours || ''} onChange={handleStoreInfoChange} placeholder="영업 시간" style={styles.input} /></div>
      </div>

      {/* 메뉴 리스트 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>메뉴 정보</div>
        <div style={styles.menuList}>
          {storeInfo.menulist?.map((menu, index) => (
            <div key={index} style={styles.menuItem}>
              {(menu.imagePreviewUrl || menu.menuPict) &&
                <img
                  src={menu.imagePreviewUrl || `/uploads/${menu.menuPict}`}
                  alt={menu.menuName}
                  style={styles.menuItemImage}
                />
              }
              <span style={styles.menuItemText}>{menu.menuName} - {menu.menuPrice}원</span>
              <button onClick={() => handleRemoveMenu(index)} style={styles.menuRemoveBtn}>
                <FaTimesCircle color="#dc3545" size="18px" />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.menuAddGroup}>
          <input type="text" name="name" value={newMenu.name} onChange={handleNewMenuChange} placeholder="메뉴 이름" style={styles.menuAddInput} />
          <input type="text" name="price" value={newMenu.price} onChange={handleNewMenuChange} placeholder="가격" style={styles.menuAddInput} />
          <label htmlFor="edit-menu-image" style={styles.menuFileLabel}>사진 추가</label>
          <input type="file" id="edit-menu-image" onChange={handleMenuImageChange} style={{ display: 'none' }} />
          <button onClick={handleAddMenu} style={styles.addMenuBtn}>메뉴 추가</button>
        </div>
      </div>

      {/* 시설 정보 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>식당 시설 정보</div>
        <div style={styles.facilitiesContainer}>
          {facilityOptions.map(opt => (
            <label key={opt.name} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name={opt.name}
                onChange={handleFacilityChange}
                checked={storeInfo.facilities?.[opt.name] || false}
                style={{ marginRight: '5px' }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* 쿠폰 관리 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}><FaTicketAlt style={{ marginRight: '8px' }} />쿠폰 수정 / 삭제</div>

        {coupons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '14px', border: '1px dashed #ddd', borderRadius: '6px' }}>
            등록된 쿠폰이 없습니다.
          </div>
        ) : (
          coupons.map(c => (
            <div key={c.couponIdx} style={{ ...styles.couponItem, flexDirection: 'column', alignItems: 'stretch' }}>
              {editingCouponIdx === c.couponIdx ? (
                // 수정 모드
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={styles.couponLabel}>쿠폰 이름</div>
                    <input name="title" value={editingCouponForm.title} onChange={handleCouponEditChange} style={styles.couponInput} maxLength={100} />
                  </div>
                  <div>
                    <div style={styles.couponLabel}>설명</div>
                    <input name="description" value={editingCouponForm.description} onChange={handleCouponEditChange} style={styles.couponInput} maxLength={500} />
                  </div>
                  <div>
                    <div style={styles.couponLabel}>필요 포인트</div>
                    <input name="pointCost" type="number" min="1" value={editingCouponForm.pointCost} onChange={handleCouponEditChange} style={styles.couponInput} />
                  </div>
                  <div>
                    <div style={styles.couponLabel}>유효기간</div>
                    <input name="validUntil" type="date" value={editingCouponForm.validUntil} onChange={handleCouponEditChange} style={styles.couponInput} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={() => handleCouponEditSave(c.couponIdx)} style={{ ...styles.couponRegisterBtn, flexGrow: 1, marginTop: 0 }}>저장</button>
                    <button onClick={() => setEditingCouponIdx(null)} style={{ ...styles.couponDeleteBtn, flexGrow: 1 }}>취소</button>
                  </div>
                </div>
              ) : (
                // 보기 모드
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#444' }}>
                      {c.title} {!c.active && <span style={{ color: '#aaa', fontSize: '12px' }}>(중지됨)</span>}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>
                      <span style={{ color: '#007bff', fontWeight: 'bold' }}>{c.pointCost.toLocaleString()}P</span> · 유효기간: {c.validUntil || '무기한'}
                    </div>
                    {c.description && <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>{c.description}</div>}
                  </div>
                  {c.active && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ ...styles.couponDeleteBtn, color: '#28a745', borderColor: '#28a745' }} onClick={() => handleCouponEditStart(c)}>수정</button>
                      <button style={styles.couponDeleteBtn} onClick={() => handleCouponDelete(c.couponIdx)}>
                        <FaTrash style={{ marginRight: '4px' }} />삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 하단 버튼 */}
      <div style={styles.buttonsContainer}>
        <button onClick={handleUpdateClick} style={styles.updateBtn}>수정 완료</button>
        <button onClick={handleDeleteClick} style={styles.deleteBtn}>식당 삭제</button>
      </div>
    </div>
  );
};

export default MerchantEditDeletePanel;