import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaGift } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const RewardPanel = () => {
  const { userIdx } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [myCoupons, setMyCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // 보유 포인트 + 보유 쿠폰 조회
  const fetchAll = useCallback(async () => {
    if (!userIdx) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [balanceRes, myRes] = await Promise.all([
        axios.get(`/api/rewards/balance/${userIdx}`),
        axios.get(`/api/coupons/my/${userIdx}`),
      ]);
      setPoints(balanceRes.data?.balance ?? 0);
      setMyCoupons(myRes.data || []);
    } catch (err) {
      console.error('리워드 정보 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [userIdx]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 보유 쿠폰 사용
  const handleUseCoupon = async (userCouponIdx) => {
    if (!window.confirm('이 쿠폰을 사용 처리할까요?')) return;
    try {
      await axios.post(`/api/coupons/use/${userCouponIdx}`, null, {
        params: { userIdx: Number(userIdx) },
      });
      alert('쿠폰을 사용했습니다.');
      fetchAll();
    } catch (err) {
      console.error('쿠폰 사용 실패:', err);
      alert(err.response?.data || '사용에 실패했습니다.');
    }
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
    section: {
      marginBottom: '25px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: '10px',
    },
    pointsBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#e6f5ff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    pointsText: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    pointsValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#007bff',
    },
    couponList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    couponItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    couponDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    couponTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#444',
    },
    couponExpiry: {
      fontSize: '14px',
      color: '#888',
      marginTop: '5px',
    },
    couponCost: {
      marginTop: '6px',
      fontWeight: 'bold',
      color: '#007bff',
    },
    noCouponBox: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      border: '1px dashed #ccc',
      borderRadius: '10px',
      color: '#777',
      fontSize: '16px',
    },
    noCouponText: {
      marginTop: '15px',
      fontSize: '16px',
    },
    useButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 15px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    usedText: {
      color: '#aaa',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    hint: {
      marginTop: '12px',
      fontSize: '13px',
      color: '#888',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>리워드</h2>

      {/* 보유 포인트 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <FaGift style={styles.sectionIcon} />
          <span>보유 포인트</span>
        </div>
        <div style={styles.pointsBox}>
          <div style={styles.pointsText}>총 포인트</div>
          <div style={styles.pointsValue}>{loading ? '...' : `${points.toLocaleString()}P`}</div>
        </div>
        <p style={styles.hint}>혼잡도를 제보하면 포인트가 적립돼요. (같은 가게는 30분에 한 번)</p>
      </div>

      {/* 보유 쿠폰 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <FaTicketAlt style={styles.sectionIcon} />
          <span>보유 쿠폰</span>
        </div>
        {myCoupons.length > 0 ? (
          <div style={styles.couponList}>
            {myCoupons.map(c => (
              <div key={c.userCouponIdx} style={styles.couponItem}>
                <div style={styles.couponDetails}>
                  <div style={styles.couponTitle}>{c.title}</div>
                  <div style={styles.couponExpiry}>{c.restName} · 유효기간: {c.validUntil || '무기한'}</div>
                </div>
                {c.used ? (
                  <span style={styles.usedText}>사용 완료</span>
                ) : (
                  <button style={styles.useButton} onClick={() => handleUseCoupon(c.userCouponIdx)}>
                    사용하기
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noCouponBox}>
            <FaTicketAlt style={{ fontSize: '40px', color: '#ccc' }} />
            <div style={styles.noCouponText}>아직 보유한 쿠폰이 없어요.</div>
          </div>
        )}
      </div>

    </div>
  );
};

export default RewardPanel;
