import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 이전에 사용하던 고정된 더미 데이터를 삭제하고,
// ID를 기반으로 동적 데이터를 생성하는 함수를 만듭니다.
const generateRestaurantDetails = (id) => {
    // ID를 사용하여 일관성 있는 더미 데이터를 생성합니다.
    const numericId = parseInt(id, 10);
    const names = ['골드레스토랑', '실버레스토랑', '브론즈레스토랑', '다이아레스토랑'];
    const name = names[numericId % names.length];
    const rating = (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500) + 50;

    return {
        name,
        rating,
        reviewCount,
        // 필요에 따라 더미 사진, 메뉴, 리뷰 데이터를 추가할 수 있습니다.
        photos: [],
        menu: [],
        reviews: []
    };
};

const RestaurantDetailPage = () => {
    // 훅은 항상 컴포넌트 최상단에 선언합니다.
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    // 뒤로가기 버튼 핸들러
    const handleGoBack = useCallback(() => {
        navigate(-1); // 이전 페이지로 이동
    }, [navigate]);

    // 탭 클릭 핸들러
    const handleTabClick = useCallback((tabName) => {
        setActiveTab(tabName);
    }, []);

    // 컴포넌트 마운트 시 데이터 로딩
    useEffect(() => {
        // ID가 유효한지 확인합니다.
        if (restaurantId) {
            const data = generateRestaurantDetails(restaurantId);
            setRestaurant(data);
        }
    }, [restaurantId]);

    // 탭에 따라 다른 콘텐츠를 렌더링하는 함수
    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div>
                        <p>이곳은 홈 탭 콘텐츠입니다. 가게 정보 요약, 인기 메뉴 등을 표시합니다.</p>
                    </div>
                );
            case 'photos':
                return (
                    <div>
                        <p>이곳은 사진 탭 콘텐츠입니다. 가게 사진을 보여줍니다.</p>
                    </div>
                );
            case 'menu':
                return (
                    <div>
                        <p>이곳은 메뉴 탭 콘텐츠입니다. 상세 메뉴와 가격을 표시합니다.</p>
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <p>이곳은 리뷰 탭 콘텐츠입니다. 방문자들의 리뷰를 보여줍니다.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    // 데이터가 로딩되지 않았을 때 로딩 메시지 표시
    if (!restaurant) {
        return <div>로딩 중...</div>;
    }

    // 모든 훅이 호출된 후 JSX 렌더링
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <button 
                onClick={handleGoBack}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                {'<'} 뒤로가기
            </button>
            
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                {/* 가게 상세 정보 헤더 */}
                <h1 style={{ fontSize: '28px', color: '#333', marginBottom: '10px' }}>{restaurant.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#666' }}>
                    <span style={{ fontSize: '18px', marginRight: '15px' }}>★ {restaurant.rating}</span>
                    <span style={{ fontSize: '18px' }}>리뷰 {restaurant.reviewCount}개</span>
                </div>
                
                {/* 탭 네비게이션 */}
                <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', marginBottom: '20px' }}>
                    <button 
                        onClick={() => handleTabClick('home')}
                        style={{
                            padding: '15px 20px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontWeight: activeTab === 'home' ? 'bold' : 'normal',
                            color: activeTab === 'home' ? '#007bff' : '#666',
                            borderBottom: activeTab === 'home' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        홈
                    </button>
                    <button 
                        onClick={() => handleTabClick('photos')}
                        style={{
                            padding: '15px 20px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontWeight: activeTab === 'photos' ? 'bold' : 'normal',
                            color: activeTab === 'photos' ? '#007bff' : '#666',
                            borderBottom: activeTab === 'photos' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        사진
                    </button>
                    <button 
                        onClick={() => handleTabClick('menu')}
                        style={{
                            padding: '15px 20px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontWeight: activeTab === 'menu' ? 'bold' : 'normal',
                            color: activeTab === 'menu' ? '#007bff' : '#666',
                            borderBottom: activeTab === 'menu' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        메뉴
                    </button>
                    <button 
                        onClick={() => handleTabClick('reviews')}
                        style={{
                            padding: '15px 20px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontWeight: activeTab === 'reviews' ? 'bold' : 'normal',
                            color: activeTab === 'reviews' ? '#007bff' : '#666',
                            borderBottom: activeTab === 'reviews' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        리뷰
                    </button>
                </div>
                
                {/* 탭 콘텐츠 */}
                <div style={{ padding: '20px 0' }}>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetailPage;