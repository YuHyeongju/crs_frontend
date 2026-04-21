import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import HomeTab from './tabs/HomeTab';
import PhotosTab from './tabs/PhotosTab';
import MenuTab from './tabs/MenuTab';
import ReviewsTab from './tabs/ReviewsTab';

const RestaurantDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurantId } = useParams();

    const restaurantDataFromState = location.state?.restaurantData;
    const restaurantNameFromState = location.state?.restaurantName;

    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(false);
    const isProcessing = useRef(false);

    const fetchCombinedData = useCallback(async (id, name) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;
        if (isProcessing.current) return;

        isProcessing.current = true;
        setLoading(true);

        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(name, async (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const matched = data.find(place => String(place.id) === String(id));

                if (matched) {
                    try {
                        // 1. 서버에 식당 정보 전송 (DB 등록 및 식당 엔티티 수신)
                        const restRes = await axios.post('http://localhost:8080/api/restaurants/detail', {
                            kakaoId: id,
                            restName: matched.place_name,
                            restAddress: matched.road_address_name || matched.address_name,
                            restPhone: matched.phone
                        }, { withCredentials: true });

                        // 서버가 반환한 Restaurant 엔티티 데이터
                        const serverData = restRes.data;

                        // 2. 혼잡도 정보 요청
                        const congRes = await axios.get(`http://localhost:8080/api/congestion/${id}`);

                        setRestaurant({
                            ...matched,
                            // [핵심] matched.id(카카오ID) 대신 서버 엔티티의 PK를 할당합니다.
                            // 만약 Restaurant 엔티티의 PK 필드명이 restIdx라면 serverData.restIdx를 사용하세요.
                            id: serverData.restIdx || serverData.id,
                            dataStatus: serverData.status,
                            congestion: congRes.data === "null" ? "정보없음" : congRes.data,
                            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                            reviewCount: Math.floor(Math.random() * 100)
                        });
                    } catch (error) {
                        console.error("서버 데이터 연동 실패:", error);
                        setRestaurant({ ...matched, congestion: '연동실패' });
                    } finally {
                        isProcessing.current = false;
                        setLoading(false);
                    }
                } else {
                    isProcessing.current = false;
                    setLoading(false);
                }
            } else {
                console.error("카카오 검색 실패:", status);
                isProcessing.current = false;
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        const targetName = restaurantNameFromState || restaurantDataFromState?.place_name || restaurantDataFromState?.restName;
        if (restaurantId && targetName) {
            fetchCombinedData(restaurantId, targetName);
        }
    }, [restaurantId, restaurantNameFromState, restaurantDataFromState, fetchCombinedData]);

    if (loading && !restaurant) return <div style={styles.loading}>정보를 동기화 중입니다...</div>;
    if (!restaurant) return <div style={styles.loading}>정보를 불러올 수 없습니다.</div>;

    return (
        <div style={styles.pageContainer}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>뒤로가기</button>

            <div style={styles.card}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{restaurant.place_name}</h1>
                        <p style={styles.category}>{restaurant.category_name}</p>
                    </div>
                    <div style={styles.stats}>
                        <div style={styles.rating}>⭐ {restaurant.rating}</div>
                        <div style={styles.statusBadge(restaurant.congestion)}>
                            현재 혼잡도: {restaurant.congestion}
                        </div>
                    </div>
                </div>

                <div style={styles.tabBar}>
                    {['home', 'photos', 'menu', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={styles.tabBtn(activeTab === tab)}
                        >
                            {tab === 'home' ? '홈' : tab === 'photos' ? '사진' : tab === 'menu' ? '메뉴' : '리뷰'}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: '20px' }}>
                    {activeTab === 'home' && <HomeTab restaurant={restaurant} />}
                    {activeTab === 'photos' && <PhotosTab restaurant={restaurant} />}
                    {activeTab === 'menu' && <MenuTab restaurant={restaurant} />}
                    {activeTab === 'reviews' && restaurant.id && (
                        <ReviewsTab
                            restaurant={restaurant}
                            restIdx={restaurant.id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: { padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
    loading: { padding: '100px', textAlign: 'center', fontSize: '18px' },
    backBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
    card: { backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { margin: 0, fontSize: '28px' },
    category: { color: '#888', marginTop: '5px' },
    stats: { textAlign: 'right' },
    rating: { fontSize: '22px', fontWeight: 'bold', color: '#f39c12' },
    statusBadge: (status) => {
        const isBusy = status === '혼잡' || status === '매우 혼잡';
        const isNormal = status === '보통';
        const isFree = status === '여유';
        return {
            marginTop: '10px', padding: '6px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
            backgroundColor: isBusy ? '#ffebee' : isNormal ? '#e3f2fd' : isFree ? '#e8f5e9' : '#f5f5f5',
            color: isBusy ? '#d32f2f' : isNormal ? '#1976d2' : isFree ? '#2e7d32' : '#666',
            border: `1px solid ${isBusy ? '#ffcdd2' : isNormal ? '#90caf9' : isFree ? '#c8e6c9' : '#ddd'}`
        };
    },
    tabBar: { display: 'flex', borderBottom: '2px solid #eee', marginTop: '20px' },
    tabBtn: (active) => ({
        padding: '15px 30px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
        color: active ? '#007bff' : '#666', fontWeight: active ? 'bold' : 'normal',
        borderBottom: active ? '3px solid #007bff' : 'none'
    })
};

export default RestaurantDetailPage;