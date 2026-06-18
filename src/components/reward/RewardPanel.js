import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaGift } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const RewardPanel = () => {
  const { userIdx } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  // 쿠폰은 아직 백엔드 미구현 (1단계는 포인트만) — 빈 목록으로 정직하게 표시
  const [coupons, setCoupons] = useState([]);

  // 혼잡도 제보로 적립된 보유 포인트 조회
  useEffect(() => {
    if (!userIdx) {
      setLoading(false);
      return;
    }
    axios.get(`/api/rewards/balance/${userIdx}`)
      .then(res => {
        setPoints(res.data?.balance ?? 0);
      })
      .catch(err => {
        console.error('포인트 조회 실패:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userIdx]);

  // 쿠폰을 사용했을 때 목록에서 제거하는 기능 (쿠폰 기능 도입 시 사용)
  const handleUseCoupon = (couponId) => {
    const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
    setCoupons(updatedCoupons);
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>리워드</h2>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <FaGift style={styles.sectionIcon} />
          <span>보유 포인트</span>
        </div>
        <div style={styles.pointsBox}>
          <div style={styles.pointsText}>총 포인트</div>
          <div style={styles.pointsValue}>{loading ? '...' : `${points.toLocaleString()}P`}</div>
        </div>
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#888' }}>
          혼잡도를 제보하면 포인트가 적립돼요. (같은 가게는 30분에 한 번)
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <FaTicketAlt style={styles.sectionIcon} />
          <span>쿠폰</span>
        </div>
        {coupons.length > 0 ? (
          <div style={styles.couponList}>
            {coupons.map(coupon => (
              <div key={coupon.id} style={styles.couponItem}>
                <div style={styles.couponDetails}>
                  <div style={styles.couponTitle}>{coupon.title}</div>
                  <div style={styles.couponExpiry}>유효기간: {coupon.expiry}</div>
                </div>

                <button 
                  style={styles.useButton}
                  onClick={() => handleUseCoupon(coupon.id)}
                >
                  사용하기
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noCouponBox}>
            <FaTicketAlt style={{ fontSize: '40px', color: '#ccc' }} />
            <div style={styles.noCouponText}>아직 사용할 수 있는 쿠폰이 없어요.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardPanel;