import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import HomeTab from './tabs/HomeTab';
import PhotosTab from './tabs/PhotosTab';
import MenuTab from './tabs/MenuTab';
import ReviewsTab from './tabs/ReviewsTab';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as ProfileIcon } from '../../assets/Vector.svg';

const RestaurantDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurantId } = useParams();
    const { isLoggedIn, userIdx, logout } = useContext(AuthContext);

    const restaurantDataFromState = location.state?.restaurantData;
    const restaurantNameFromState = location.state?.restaurantName;

    const isDbOnly = restaurantId?.startsWith('db-');
    const dbRestIdx = isDbOnly ? parseInt(restaurantId.replace('db-', ''), 10) : null;

    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [menus, setMenus] = useState([]);
    const [myPoints, setMyPoints] = useState(0);
    const isProcessing = useRef(false);

    const fetchDbOnlyData = useCallback(async (restIdx) => {
        setLoading(true);
        try {
            const [pinRes, congRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/restaurants/restIdx/${restIdx}`),
                axios.get(`http://localhost:8080/api/congestion/restIdx/${restIdx}`)
            ]);
            const pin = pinRes.data;
            setRestaurant({
                id: pin.restIdx,
                place_name: pin.restName,
                road_address_name: pin.restAddress,
                address_name: pin.restAddress,
                phone: pin.restTel || '',
                category_name: null,
                averageRating: pin.averageRating || 0,
                reviewCount: pin.reviewCount || 0,
                ownerUserIdx: pin.ownerUserIdx ?? null,
                congestion: congRes.data || '혼잡도 이력 없음',
                dataStatus: 'ACTIVE',
                isDbOnly: true,
            });
        } catch (error) {
            console.error("DB 가게 데이터 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCombinedData = useCallback(async (id, name, preloadedPlace = null) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setLoading(true);

        const processPlace = async (placeData) => {
            try {
                const restRes = await axios.post('http://localhost:8080/api/restaurants/detail', {
                    kakaoId: id,
                    restName: placeData.place_name,
                    restAddress: placeData.road_address_name || placeData.address_name,
                    restTel: placeData.phone
                }, { withCredentials: true });

                const serverData = restRes.data;

                const [congRes, statsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/congestion/${id}`).catch(() => ({ data: '혼잡도 이력 없음' })),
                    axios.get(`http://localhost:8080/api/restaurants/kakaoId/${id}`).catch(() => ({ data: { averageRating: 0, reviewCount: 0, ownerUserIdx: null } }))
                ]);

                setRestaurant({
                    ...placeData,
                    id: serverData.restIdx || serverData.id,
                    dataStatus: serverData.status,
                    congestion: congRes.data === "null" ? "정보없음" : congRes.data,
                    averageRating: statsRes.data.averageRating || 0,
                    reviewCount: statsRes.data.reviewCount || 0,
                    ownerUserIdx: statsRes.data.ownerUserIdx ?? null
                });
            } catch (error) {
                console.error("서버 데이터 연동 실패:", error);
                setRestaurant({ ...placeData, congestion: '연동실패' });
            } finally {
                isProcessing.current = false;
                setLoading(false);
            }
        };

        // state로 데이터가 넘어온 경우 카카오 재검색 생략
        if (preloadedPlace) {
            await processPlace(preloadedPlace);
            return;
        }

        // 직접 URL 접근 또는 새로고침 시 카카오 재검색으로 폴백
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
            isProcessing.current = false;
            setLoading(false);
            return;
        }

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(name, async (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const matched = data.find(place => String(place.id) === String(id));
                if (matched) {
                    await processPlace(matched);
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
        if (isDbOnly && dbRestIdx) {
            fetchDbOnlyData(dbRestIdx);
            return;
        }
        if (restaurantId) {
            if (restaurantDataFromState && !restaurantDataFromState.isDbOnly) {
                fetchCombinedData(restaurantId, null, restaurantDataFromState);
            } else {
                const targetName = restaurantNameFromState || restaurantDataFromState?.place_name || restaurantDataFromState?.restName;
                if (targetName) fetchCombinedData(restaurantId, targetName);
            }
        }
    }, [restaurantId, isDbOnly, dbRestIdx, restaurantNameFromState, restaurantDataFromState, fetchCombinedData, fetchDbOnlyData]);

    // 가게 로드 후 메뉴 + 쿠폰 + 내 포인트 조회
    useEffect(() => {
        if (!restaurant) return;
        const restIdx = restaurant.id;
        axios.get(`http://localhost:8080/api/restaurants/${restIdx}/menus`)
            .then(res => setMenus(res.data || []))
            .catch(() => setMenus([]));
        axios.get(`http://localhost:8080/api/coupons/available/restaurant/${restIdx}`)
            .then(res => setCoupons(res.data || []))
            .catch(() => setCoupons([]));
        if (isLoggedIn && userIdx) {
            axios.get(`http://localhost:8080/api/rewards/balance/${userIdx}`)
                .then(res => setMyPoints(res.data?.balance ?? 0))
                .catch(() => setMyPoints(0));
        }
    }, [restaurant, isLoggedIn, userIdx]);

    const refreshStats = useCallback(async () => {
        if (!restaurant) return;
        try {
            if (isDbOnly) {
                const res = await axios.get(`http://localhost:8080/api/restaurants/restIdx/${dbRestIdx}`);
                setRestaurant(prev => ({
                    ...prev,
                    averageRating: res.data.averageRating ?? prev.averageRating,
                    reviewCount: res.data.reviewCount ?? prev.reviewCount,
                }));
            } else {
                const res = await axios.get(`http://localhost:8080/api/restaurants/kakaoId/${restaurantId}`);
                setRestaurant(prev => ({
                    ...prev,
                    averageRating: res.data.averageRating ?? prev.averageRating,
                    reviewCount: res.data.reviewCount ?? prev.reviewCount,
                }));
            }
        } catch (e) {
            console.warn('평점 갱신 실패:', e);
        }
    }, [restaurant, isDbOnly, dbRestIdx, restaurantId]);

    const handleCouponRedeem = useCallback(async (coupon) => {
        if (!isLoggedIn) {
            alert('로그인 후 이용 가능합니다.');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (myPoints < coupon.pointCost) {
            alert(`포인트가 부족합니다. (보유 ${myPoints}P / 필요 ${coupon.pointCost}P)`);
            return;
        }
        if (!window.confirm(`'${coupon.title}' 쿠폰을 ${coupon.pointCost.toLocaleString()}P에 교환할까요?`)) return;
        try {
            await axios.post(`http://localhost:8080/api/coupons/${coupon.couponIdx}/redeem`, null, {
                params: { userIdx: Number(userIdx) },
            });
            alert('쿠폰을 교환했습니다.');
            setMyPoints(prev => prev - coupon.pointCost);
        } catch (err) {
            alert(err.response?.data || '교환에 실패했습니다.');
        }
    }, [isLoggedIn, userIdx, myPoints, navigate, location.pathname]);

    // 진입 시 현재 가게가 즐겨찾기 되어 있는지 조회
    useEffect(() => {
        if (!isLoggedIn || !userIdx || !restaurantId) {
            setIsBookmarked(false);
            return;
        }
        axios.get(`http://localhost:8080/api/bookmarks/my-bookmark-list/${userIdx}`)
            .then(res => {
                const ids = (res.data || []).map(String);
                setIsBookmarked(ids.includes(String(restaurantId)));
            })
            .catch(err => console.warn("즐겨찾기 상태 조회 실패:", err));
    }, [isLoggedIn, userIdx, restaurantId]);

    const handleBookmarkToggle = useCallback(async () => {
        if (!isLoggedIn) {
            alert("로그인 후 이용 가능합니다.");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        try {
            const payload = isDbOnly
                ? { userIdx, restIdx: restaurant?.id, restName: restaurant?.place_name }
                : { userIdx, kakaoId: restaurantId, restName: restaurant?.place_name, restAddress: restaurant?.road_address_name || restaurant?.address_name, restTel: restaurant?.phone };
            await axios.post('http://localhost:8080/api/bookmarks/toggle', payload, { withCredentials: true });
            setIsBookmarked(prev => !prev);
        } catch (error) {
            console.error("즐겨찾기 처리 실패:", error);
            alert("처리에 실패했습니다. 다시 시도해주세요.");
        }
    }, [isLoggedIn, userIdx, restaurantId, restaurant, navigate, location.pathname, isDbOnly]);

    if (loading && !restaurant) return <div style={styles.loading}>정보를 동기화 중입니다...</div>;
    if (!restaurant) return <div style={styles.loading}>정보를 불러올 수 없습니다.</div>;

    return (
        <div style={styles.pageContainer}>
            <div style={styles.topBar}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>뒤로가기</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {isLoggedIn ? (
                    <>
                        <button onClick={logout} style={styles.logoutBtn}>로그아웃</button>
                        <Link to="/mypage" style={styles.profileCircle}>
                            <ProfileIcon style={{ width: '80%', height: '100%' }} />
                        </Link>
                    </>
                ) : (
                    <Link to="/login" style={styles.loginBtn}>로그인</Link>
                )}
            </div>
        </div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={styles.title}>{restaurant.place_name}</h1>
                            <button
                                onClick={handleBookmarkToggle}
                                style={styles.bookmarkBtn}
                                title={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                            >
                                {isBookmarked ? '⭐' : '☆'}
                            </button>
                        </div>
                        {restaurant.category_name && <p style={styles.category}>{restaurant.category_name}</p>}
                    </div>
                    <div style={styles.stats}>
                        <div style={styles.rating}>⭐ {restaurant.averageRating ?? 0}</div>
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
                    {activeTab === 'home' && (
                        <>
                            <HomeTab restaurant={restaurant} />
                            {coupons.length > 0 && (
                                <div style={{ marginTop: '24px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                                        이 가게 쿠폰
                                    </h4>
                                    {isLoggedIn && (
                                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                                            보유 포인트: <strong style={{ color: '#007bff' }}>{myPoints.toLocaleString()}P</strong>
                                        </p>
                                    )}
                                    {coupons.map(c => {
                                        const affordable = isLoggedIn && myPoints >= c.pointCost;
                                        return (
                                            <div key={c.couponIdx} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                border: '1px solid #ddd', borderRadius: '8px', padding: '12px 15px',
                                                marginBottom: '8px', backgroundColor: '#fff'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{c.title}</div>
                                                    {c.description && <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>{c.description}</div>}
                                                    <div style={{ fontSize: '13px', color: '#007bff', fontWeight: 'bold', marginTop: '4px' }}>
                                                        {c.pointCost.toLocaleString()}P · 유효기간: {c.validUntil || '무기한'}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCouponRedeem(c)}
                                                    style={{
                                                        backgroundColor: affordable ? '#28a745' : '#ccc',
                                                        color: 'white', border: 'none', borderRadius: '6px',
                                                        padding: '8px 14px', fontSize: '13px', fontWeight: 'bold',
                                                        cursor: affordable ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap'
                                                    }}
                                                    disabled={!isLoggedIn || !affordable}
                                                >
                                                    {!isLoggedIn ? '로그인 필요' : affordable ? '교환' : '포인트 부족'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'photos' && <PhotosTab menus={menus} />}
                    {activeTab === 'menu' && <MenuTab menus={menus} />}
                    {activeTab === 'reviews' && restaurant.id && (
                        <ReviewsTab
                            restaurant={restaurant}
                            restIdx={restaurant.id}
                            ownerUserIdx={restaurant.ownerUserIdx}
                            onReviewSubmitted={refreshStats}
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
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    backBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
    logoutBtn: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
    profileCircle: { width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loginBtn: { textDecoration: 'none', backgroundColor: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' },
    card: { backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { margin: 0, fontSize: '28px' },
    category: { color: '#888', marginTop: '5px' },
    stats: { textAlign: 'right' },
    rating: { fontSize: '22px', fontWeight: 'bold', color: '#f39c12' },
    bookmarkBtn: { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', padding: '0', lineHeight: '1' },
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
