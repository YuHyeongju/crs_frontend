import React, { useState } from 'react';
import { FaTicketAlt, FaGift } from 'react-icons/fa';

const RewardPanel = () => {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      title: '5,000원 할인 쿠폰',
      expiry: '2025.12.31',
      details: '결제 시 5,000원 할인 (20,000원 이상 구매 시)',
    },
    {
      id: 2,
      title: '아메리카노 1잔 무료 쿠폰',
      expiry: '2025.10.31',
      details: '카페 방문 시 아메리카노 1잔 무료 제공',
    },
  ]);
  const [points, setPoints] = useState(15000);

  // 쿠폰을 사용했을 때 목록에서 제거하는 기능
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
          <div style={styles.pointsValue}>{points.toLocaleString()}P</div>
        </div>
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