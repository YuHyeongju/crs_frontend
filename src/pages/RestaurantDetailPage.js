import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeTab from '../components/HomeTab';
import PhotosTab from '../components/PhotosTab';
import MenuTab from '../components/MenuTab';
import ReviewsTab from '../components/ReviewsTab';

const RestaurantDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // HomePage에서 전달받은 식당 데이터
    const restaurantData = location.state?.restaurantData;
    
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    // 이전 페이지로 이동
    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // 탭 변경
    const handleTabClick = useCallback((tabName) => {
        setActiveTab(tabName);
    }, []);

    // 전달받은 데이터 설정
    useEffect(() => {
        if (restaurantData) {
            setRestaurant(restaurantData);
        } else {
            console.warn('식당 데이터가 전달되지 않았습니다.');
        }
    }, [restaurantData]);

    // 탭별 콘텐츠 렌더링
    const renderTabContent = () => {
        if (!restaurant) return null;

        switch (activeTab) {
            case 'home':
                return <HomeTab restaurant={restaurant} />;
            case 'photos':
                return <PhotosTab restaurant={restaurant} />;
            case 'menu':
                return <MenuTab restaurant={restaurant} />;
            case 'reviews':
                return <ReviewsTab restaurant={restaurant} />;
            default:
                return null;
        }
    };

    if (!restaurant) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                로딩 중...
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#f0f2f5', 
            minHeight: '100vh', 
            fontFamily: 'Arial, sans-serif' 
        }}>
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
                    fontSize: '14px',
                    fontWeight: 'bold',
                }}
            >
                {'<'} 뒤로가기
            </button>
            
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                padding: '30px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
            }}>
                <h1 style={{ fontSize: '28px', color: '#333', marginBottom: '10px' }}>
                    {restaurant.place_name}
                </h1>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '20px', 
                    color: '#666' 
                }}>
                    <span style={{ fontSize: '18px', marginRight: '15px' }}>
                        ★ {restaurant.rating}
                    </span>
                    <span style={{ fontSize: '18px' }}>
                        리뷰 {restaurant.reviewCount}개
                    </span>
                </div>
                
                {/* 탭 네비게이션 */}
                <div style={{ 
                    display: 'flex', 
                    borderBottom: '2px solid #e0e0e0', 
                    marginBottom: '20px' 
                }}>
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
                            fontSize: '15px',
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
                            fontSize: '15px',
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
                            fontSize: '15px',
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
                            fontSize: '15px',
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