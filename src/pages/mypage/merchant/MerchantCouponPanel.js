import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';

const MerchantCouponPanel = () => {
  const { userIdx } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    restIdx: '',
    title: '',
    description: '',
    pointCost: '',
    validUntil: '',
  });

  // 내 가게 목록 + 내가 등록한 쿠폰 목록 조회
  const fetchData = useCallback(async () => {
    if (!userIdx) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [storeRes, couponRes] = await Promise.all([
        axios.get('/api/restaurants/my-restaurant-list', { withCredentials: true }),
        axios.get(`/api/coupons/my-store/${userIdx}`),
      ]);
      setStores(storeRes.data || []);
      setCoupons(couponRes.data || []);
    } catch (err) {
      console.error('쿠폰 관리 정보 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [userIdx]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.restIdx) { alert('가게를 선택해주세요.'); return; }
    if (!form.title.trim()) { alert('쿠폰 이름을 입력해주세요.'); return; }
    if (!form.pointCost || Number(form.pointCost) <= 0) { alert('필요 포인트를 올바르게 입력해주세요.'); return; }
    try {
      await axios.post('/api/coupons/register', {
        merchantUserIdx: Number(userIdx),
        restIdx: Number(form.restIdx),
        title: form.title.trim(),
        description: form.description.trim(),
        pointCost: Number(form.pointCost),
        validUntil: form.validUntil || null,
      });
      alert('쿠폰이 등록되었습니다.');
      setForm({ restIdx: '', title: '', description: '', pointCost: '', validUntil: '' });
      fetchData();
    } catch (err) {
      console.error('쿠폰 등록 실패:', err);
      alert(err.response?.data || '등록에 실패했습니다.');
    }
  };

  const handleDelete = async (couponIdx) => {
    if (!window.confirm('이 쿠폰을 삭제(비활성화)할까요?')) return;
    try {
      await axios.post(`/api/coupons/delete/${couponIdx}`, null, {
        params: { merchantUserIdx: Number(userIdx) },
      });
      alert('쿠폰이 삭제되었습니다.');
      fetchData();
    } catch (err) {
      console.error('쿠폰 삭제 실패:', err);
      alert(err.response?.data || '삭제에 실패했습니다.');
    }
  };

  const styles = {
    container: { padding: '10px' },
    title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#333' },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: '#f9fbff',
      border: '1px solid #e0e8f5',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '30px',
    },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '4px' },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    submitButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '12px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 'bold',
      marginTop: '5px',
    },
    listTitle: { fontSize: '17px', fontWeight: 'bold', color: '#333', marginBottom: '15px' },
    couponItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
    },
    couponTitle: { fontSize: '16px', fontWeight: 'bold', color: '#444' },
    couponMeta: { fontSize: '13px', color: '#888', marginTop: '5px' },
    cost: { color: '#007bff', fontWeight: 'bold' },
    deleteButton: {
      backgroundColor: 'white',
      color: '#dc3545',
      border: '1px solid #dc3545',
      borderRadius: '5px',
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    emptyBox: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      border: '1px dashed #ccc',
      borderRadius: '10px',
      color: '#777',
    },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>불러오는 중입니다...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>쿠폰 관리</h2>

      {/* 쿠폰 등록 폼 */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <div style={styles.label}>가게 선택</div>
          <select name="restIdx" value={form.restIdx} onChange={handleChange} style={styles.input}>
            <option value="">-- 승인된 내 가게를 선택하세요 --</option>
            {stores.map(s => (
              <option key={s.restIdx} value={s.restIdx}>{s.restName}</option>
            ))}
          </select>
          {stores.length === 0 && (
            <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '6px' }}>
              승인된 가게가 없습니다. 가게 등록·승인 후 쿠폰을 만들 수 있어요.
            </div>
          )}
        </div>
        <div>
          <div style={styles.label}>쿠폰 이름</div>
          <input name="title" value={form.title} onChange={handleChange} style={styles.input}
                 placeholder="예: 아메리카노 1잔 무료" maxLength={100} />
        </div>
        <div>
          <div style={styles.label}>설명 (선택)</div>
          <input name="description" value={form.description} onChange={handleChange} style={styles.input}
                 placeholder="예: 방문 시 아메리카노 1잔 무료 제공" maxLength={500} />
        </div>
        <div>
          <div style={styles.label}>필요 포인트</div>
          <input name="pointCost" type="number" min="1" value={form.pointCost} onChange={handleChange}
                 style={styles.input} placeholder="예: 1000" />
        </div>
        <div>
          <div style={styles.label}>유효기간 (선택, 없으면 무기한)</div>
          <input name="validUntil" type="date" value={form.validUntil} onChange={handleChange} style={styles.input} />
        </div>
        <button type="submit" style={styles.submitButton}>쿠폰 등록</button>
      </form>

      {/* 등록한 쿠폰 목록 */}
      <h3 style={styles.listTitle}>등록한 쿠폰</h3>
      {coupons.length === 0 ? (
        <div style={styles.emptyBox}>
          <FaTicketAlt style={{ fontSize: '40px', color: '#ccc', marginBottom: '10px' }} />
          <div>아직 등록한 쿠폰이 없습니다.</div>
        </div>
      ) : (
        coupons.map(c => (
          <div key={c.couponIdx} style={styles.couponItem}>
            <div>
              <div style={styles.couponTitle}>
                {c.title} {!c.active && <span style={{ color: '#aaa', fontSize: '13px' }}>(중지됨)</span>}
              </div>
              <div style={styles.couponMeta}>
                {c.restName} · <span style={styles.cost}>{c.pointCost.toLocaleString()}P</span> · 유효기간: {c.validUntil || '무기한'}
              </div>
            </div>
            {c.active && (
              <button style={styles.deleteButton} onClick={() => handleDelete(c.couponIdx)}>
                <FaTrash style={{ marginRight: '5px' }} />삭제
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MerchantCouponPanel;
