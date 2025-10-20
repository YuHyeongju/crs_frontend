import React from 'react';

const HomeTab = ({ restaurant }) => {
    return (
        <div style={{ lineHeight: '1.8' }}>
            <h3 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>가게 정보</h3>
            
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
                    <strong>주소:</strong> {restaurant.road_address_name || restaurant.address_name}
                </p>
                {restaurant.phone && (
                    <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
                        <strong>전화번호:</strong> {restaurant.phone}
                    </p>
                )}
                {restaurant.category_name && (
                    <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
                        <strong>카테고리:</strong> {restaurant.category_name.split('>').pop().trim()}
                    </p>
                )}
                <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
                    <strong>현재 혼잡도:</strong> 
                    <span style={{
                        color: restaurant.congestion === '매우 혼잡' ? '#dc3545' : 
                               restaurant.congestion === '혼잡' ? '#ffc107' : '#28a745',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                    }}>
                        {restaurant.congestion}
                    </span>
                </p>
            </div>

            <div style={{ 
                backgroundColor: '#f0f2f5', 
                padding: '15px', 
                borderRadius: '8px',
                marginTop: '20px',
                textAlign: 'center'
            }}>
                <h4 style={{ color: '#333', marginBottom: '10px' }}>인기 정보</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    이 가게는 평점 {restaurant.rating}점으로 {restaurant.reviewCount}개의 리뷰를 받았습니다.
                </p>
            </div>
        </div>
    );
};

export default HomeTab;