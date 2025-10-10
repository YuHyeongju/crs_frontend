import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
                return (
                    <div style={{ lineHeight: '1.8' }}>
                        <h3 style={{ color: '#333', marginBottom: '15px' }}>가게 정보</h3>
                        
                        <div style={{ marginBottom: '20px' }}>
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
                            marginTop: '20px'
                        }}>
                            <h4 style={{ color: '#333', marginBottom: '10px' }}>인기 정보</h4>
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                이 가게는 평점 {restaurant.rating}점으로 {restaurant.reviewCount}개의 리뷰를 받았습니다.
                            </p>
                        </div>
                    </div>
                );
            case 'photos':
                return (
                    <div>
                        <h3 style={{ color: '#333', marginBottom: '15px' }}>사진</h3>
                        <p style={{ color: '#777', fontSize: '15px' }}>
                            이곳은 사진 탭 콘텐츠입니다. 가게 사진을 보여줍니다.
                        </p>
                        <div style={{ 
                            backgroundColor: '#f9f9f9', 
                            padding: '40px', 
                            textAlign: 'center',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{ color: '#999' }}>사진이 준비 중입니다.</p>
                        </div>
                    </div>
                );
            case 'menu':
                return (
                    <div>
                        <h3 style={{ color: '#333', marginBottom: '15px' }}>메뉴</h3>
                        <p style={{ color: '#777', fontSize: '15px' }}>
                            이곳은 메뉴 탭 콘텐츠입니다. 상세 메뉴와 가격을 표시합니다.
                        </p>
                        <div style={{ 
                            backgroundColor: '#f9f9f9', 
                            padding: '40px', 
                            textAlign: 'center',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{ color: '#999' }}>메뉴 정보가 준비 중입니다.</p>
                        </div>
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <h3 style={{ color: '#333', marginBottom: '15px' }}>리뷰 ({restaurant.reviewCount}개)</h3>
                        <p style={{ color: '#777', fontSize: '15px', marginBottom: '20px' }}>
                            이곳은 리뷰 탭 콘텐츠입니다. 방문자들의 리뷰를 보여줍니다.
                        </p>
                        <div style={{ 
                            backgroundColor: '#f9f9f9', 
                            padding: '40px', 
                            textAlign: 'center',
                            borderRadius: '8px'
                        }}>
                            <p style={{ color: '#999' }}>리뷰가 준비 중입니다.</p>
                        </div>
                    </div>
                );
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