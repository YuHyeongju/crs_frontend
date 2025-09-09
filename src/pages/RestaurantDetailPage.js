import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// HomePage.js에 있는 더미 데이터를 임시로 복사하여 사용
const dummyRestaurantDetails = {
    '1527741366': { rating: 4.5, reviewCount: 120, congestion: '보통', name: '백반이 맛있는 집', address: '제주특별자치도 제주시 첨단로 242' },
    '1527741367': { rating: 3.8, reviewCount: 75, congestion: '여유', name: '산방식당', address: '제주특별자치도 서귀포시 대정읍 하모리 1065-2' },
    '1527741368': { rating: 4.9, reviewCount: 340, congestion: '매우 혼잡', name: '올레국수', address: '제주특별자치도 제주시 연동 275' },
    '1527741369': { rating: 4.2, reviewCount: 95, congestion: '혼잡', name: '돔베돈', address: '제주특별자치도 제주시 연동 301-1' },
    '1527741370': { rating: 4.0, reviewCount: 50, congestion: '보통', name: '흑돼지촌', address: '제주특별자치도 서귀포시 안덕면 사계리 100-1' },
    // 필요에 따라 더 많은 더미 데이터를 추가하세요.
};

const RestaurantDetailPage = () => {
    const { id } = useParams(); // URL에서 'id' 파라미터를 가져옵니다.
    const navigate = useNavigate();

    // 더미 데이터에서 해당 ID의 식당 정보를 찾습니다.
    const restaurant = dummyRestaurantDetails[id];

    if (!restaurant) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>식당 정보를 찾을 수 없습니다. 😢</p>
                <button onClick={() => navigate('/')}>메인 페이지로 돌아가기</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                &lt; 뒤로 가기
            </button>
            <h1 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                {restaurant.name}
            </h1>
            <p style={{ fontSize: '18px', color: '#555' }}>
                **주소:** {restaurant.address}
            </p>
            <hr style={{ borderTop: '1px solid #eee' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', flex: 1, marginRight: '10px' }}>
                    <h2 style={{ color: '#333' }}>⭐ 평점</h2>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                        {restaurant.rating} / 5.0
                    </p>
                </div>
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', flex: 1, marginRight: '10px' }}>
                    <h2 style={{ color: '#333' }}>💬 리뷰</h2>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {restaurant.reviewCount} 개
                    </p>
                </div>
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', flex: 1 }}>
                    <h2 style={{ color: '#333' }}>📊 혼잡도</h2>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: restaurant.congestion === '매우 혼잡' ? '#dc3545' : '#28a745' }}>
                        {restaurant.congestion}
                    </p>
                </div>
            </div>
            {/* 여기에 추가적인 상세 정보를 표시할 수 있습니다. */}
            <p style={{ marginTop: '30px', color: '#777', fontStyle: 'italic' }}>
                자세한 메뉴 정보, 운영 시간, 사진 등은 추후 개발될 예정입니다.
            </p>
        </div>
    );
};

export default RestaurantDetailPage;

