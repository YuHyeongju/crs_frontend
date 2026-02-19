// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import HomeTab from './tabs/HomeTab';
// import PhotosTab from './tabs/PhotosTab';
// import MenuTab from './tabs/MenuTab';
// import ReviewsTab from './tabs/ReviewsTab';

// const RestaurantDetailPage = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { restaurantId } = useParams();
    
//     const restaurantDataFromState = location.state?.restaurantData;
//     const restaurantNameFromState = location.state?.restaurantName;
    
//     const [restaurant, setRestaurant] = useState(null);
//     const [activeTab, setActiveTab] = useState('home');
//     const [loading, setLoading] = useState(false);

//     const fetchCombinedData = useCallback(async (id, name) => {
//         setLoading(true);
//         try {
//             const ps = new window.kakao.maps.services.Places();
//             ps.keywordSearch(name, async (data, status) => {
//                 if (status === window.kakao.maps.services.Status.OK) {
//                     const matched = data.find(place => String(place.id) === String(id));
                    
//                     if (matched) {
//                         try {
                          
//                             const dbRes = await axios.post(`http://localhost:8080/api/restaurants/detail`, {
//                                 kakaoId: id,
//                                 restName: matched.place_name,
//                                 restAddress: matched.road_address_name || matched.address_name,
//                                 restPhone: matched.phone
//                             }, { withCredentials: true });

//                             console.log("백엔드 응답 데이터:", dbRes.data);

//                             // 카카오 데이터 + DB 데이터(status, rating) 병합
//                             setRestaurant({
//                                 ...matched,
//                                 // DTO 필드명인 status를 사용하여 혼잡도 표시
//                                 status: dbRes.data.status || '보통',
//                                 rating: dbRes.data.rating || '0.0',
//                                 reviewCount: dbRes.data.reviewCount || 0
//                             });
//                         } catch (dbErr) {
//                             console.error("DB 연동 실패:", dbErr);
//                             setRestaurant({ ...matched, status: '정보없음', rating: '0.0', reviewCount: 0 });
//                         }
//                     }
//                 }
//                 setLoading(false);
//             });
//         } catch (error) {
//             console.error("데이터 로딩 중 에러:", error);
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         if (restaurantDataFromState) {
//             setRestaurant(restaurantDataFromState);
//         } else if (restaurantId && restaurantNameFromState) {
//             fetchCombinedData(restaurantId, restaurantNameFromState);
//         }
//     }, [restaurantDataFromState, restaurantId, restaurantNameFromState, fetchCombinedData]);

//     if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>데이터를 동기화 중입니다...</div>;
//     if (!restaurant) return <div style={{ padding: '100px', textAlign: 'center' }}>가게 정보를 찾을 수 없습니다.</div>;

//     return (
//         <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
//             <button onClick={() => navigate(-1)} style={styles.backBtn}>뒤로가기</button>
//             <div style={styles.card}>
//                 <div style={styles.header}>
//                     <div>
//                         <h1 style={styles.title}>{restaurant.place_name}</h1>
//                         <p style={styles.category}>{restaurant.category_name}</p>
//                     </div>
//                     <div style={styles.stats}>
//                         <div style={styles.rating}>⭐ {parseFloat(restaurant.rating || 0).toFixed(1)}</div>
//                         {/* status 값을 배지에 표시 */}
//                         <div style={styles.statusBadge(restaurant.status)}>
//                             혼잡도: {restaurant.status || '보통'}
//                         </div>
//                     </div>
//                 </div>

//                 <div style={styles.tabBar}>
//                     {['home', 'photos', 'menu', 'reviews'].map((tab) => (
//                         <button key={tab} onClick={() => setActiveTab(tab)} style={styles.tabBtn(activeTab === tab)}>
//                             {tab === 'home' ? '홈' : tab === 'photos' ? '사진' : tab === 'menu' ? '메뉴' : '리뷰'}
//                         </button>
//                     ))}
//                 </div>
//                 <div style={{ marginTop: '20px' }}>
//                     {activeTab === 'home' && <HomeTab restaurant={restaurant} />}
//                     {activeTab === 'photos' && <PhotosTab restaurant={restaurant} />}
//                     {activeTab === 'menu' && <MenuTab restaurant={restaurant} />}
//                     {activeTab === 'reviews' && <ReviewsTab restaurant={restaurant} />}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     backBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
//     card: { backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
//     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
//     title: { margin: 0, fontSize: '28px' },
//     category: { color: '#888', marginTop: '5px' },
//     stats: { textAlign: 'right' },
//     rating: { fontSize: '22px', fontWeight: 'bold', color: '#f39c12' },
//     statusBadge: (status) => ({
//         marginTop: '10px', padding: '6px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
//         backgroundColor: status === '혼잡' ? '#ffebee' : '#e8f5e9',
//         color: status === '혼잡' ? '#d32f2f' : '#2e7d32',
//         border: `1px solid ${status === '혼잡' ? '#ffcdd2' : '#c8e6c9'}`
//     }),
//     tabBar: { display: 'flex', borderBottom: '2px solid #eee', marginTop: '20px' },
//     tabBtn: (active) => ({
//         padding: '15px 30px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
//         color: active ? '#007bff' : '#666', fontWeight: active ? 'bold' : 'normal',
//         borderBottom: active ? '3px solid #007bff' : 'none'
//     })
// };

// export default RestaurantDetailPage;

import React, { useState, useEffect, useCallback } from 'react';
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

    /**
     * [핵심 로직] 
     * 1. 카카오 API로 장소 정보 획득
     * 2. RestaurantController로 식당 등록/조회
     * 3. CongestionController로 실제 혼잡도("여유", "보통" 등) 획득
     */
    const fetchCombinedData = useCallback(async (id, name) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;

        setLoading(true);
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(name, async (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const matched = data.find(place => String(place.id) === String(id));

                if (matched) {
                    try {
                        // A. 식당 기본 정보 및 데이터 상태(TEMP 등) 가져오기
                        const restRes = await axios.post('http://localhost:8080/api/restaurants/detail', {
                            kakaoId: id,
                            restName: matched.place_name,
                            restAddress: matched.road_address_name || matched.address_name,
                            restPhone: matched.phone
                        }, { withCredentials: true });

                        // B. [중요] CongestionController를 통해 실제 혼잡도 문자열("여유", "보통" 등) 가져오기
                        // CongestionService.getCurrentcongestion(kakaoId) 로직 호출
                        const congRes = await axios.get(`http://localhost:8080/api/congestion/${id}`);
                        
                        // 결과값 확인 (콘솔)
                        console.log("식당 데이터 상태:", restRes.data.status); // TEMP 등
                        console.log("실제 혼잡도 값:", congRes.data); // "여유", "보통", "혼잡" 등

                        setRestaurant({
                            ...matched,
                            // 식당 엔티티의 status는 데이터 구분용으로 보관
                            dataStatus: restRes.data.status, 
                            // 배지에 표시할 진짜 혼잡도 정보 (서버 응답이 "null" 문자열일 경우 처리)
                            congestion: congRes.data === "null" ? "정보없음" : congRes.data,
                            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                            reviewCount: Math.floor(Math.random() * 100)
                        });
                    } catch (error) {
                        console.error("서버 데이터 연동 실패:", error);
                        setRestaurant({ ...matched, congestion: '연동실패' });
                    }
                }
            } else {
                console.error("카카오 검색 실패:", status);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const targetName = restaurantNameFromState || restaurantDataFromState?.place_name || restaurantDataFromState?.restName;
        if (restaurantId && targetName) {
            fetchCombinedData(restaurantId, targetName);
        }
    }, [restaurantId, restaurantNameFromState, restaurantDataFromState, fetchCombinedData]);

    if (loading) return <div style={styles.loading}>정보를 동기화 중입니다...</div>;
    if (!restaurant) return <div style={styles.loading}>정보를 불러올 수 없습니다.</div>;

    return (
        <div style={styles.pageContainer}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>뒤로가기</button>

            <div style={styles.card}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{restaurant.place_name}</h1>
                        <p style={styles.category}>{restaurant.category_name}</p>
                        {/* 데이터 상태(TEMP/ACTIVE)를 작게 표시 (선택 사항) */}
                        <span style={{fontSize: '11px', color: '#aaa'}}>소스: {restaurant.dataStatus}</span>
                    </div>
                    <div style={styles.stats}>
                        <div style={styles.rating}>⭐ {restaurant.rating}</div>
                        {/* ★ 실제 혼잡도 값을 배지에 바인딩 */}
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
                    {activeTab === 'reviews' && <ReviewsTab restaurant={restaurant} />}
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