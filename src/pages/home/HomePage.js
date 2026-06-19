import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RestaurantListPanel from './RestaurantListPanel';
import MapControls from '../../components/map/MapControls';
import GoToMyLocationButton from '../../components/map/GoToMyLocationButton';
import CongestionChangePanel from '../../components/congestion/CongestionChangePanel';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const RESTAURANT_PANEL_WIDTH_DESKTOP = '280px';
const MOBILE_BREAKPOINT = 768;



const HomePage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout, user, userIdx } = useContext(AuthContext);

    const [mapInstance, setMapInstance] = useState(null);
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentMapType, setCurrentMapType] = useState('road');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const [showCongestionModal, setShowCongestionModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [userMarkerVisible, setUserMarkerVisible] = useState(true);
    const [myBookmarkIds, setMyBookmarkIds] = useState([]);

    const mapContainerRef = useRef(null);
    const clickedMarkerRef = useRef(null);
    const userLocationMarkerRef = useRef(null);
    const restaurantMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const userLocationBlinkIntervalRef = useRef(null);
    const searchAndDisplayRestaurantsRef = useRef();
    const mapInitializedRef = useRef(false);

    const normalizeMerchantPin = useCallback((pin) => {
        const isDbOnly = !pin.kakaoId;
        const id = isDbOnly ? `db-${pin.restIdx}` : String(pin.kakaoId);

        return {
            id,
            kakaoId: pin.kakaoId,
            restIdx: pin.restIdx,
            isDbOnly,
            isMerchantStore: true,
            place_name: pin.restName,
            road_address_name: pin.restAddress,
            address_name: pin.restAddress,
            phone: pin.restTel || '',
            x: String(pin.longitude),
            y: String(pin.latitude),
            averageRating: pin.averageRating || 0,
            reviewCount: pin.reviewCount || 0,
            ownerUserIdx: pin.ownerUserIdx ?? null,
            category_name: isDbOnly ? '등록 가게' : '카카오 연동 가게',
            congestion: '혼잡도 이력 없음'
        };
    }, []);

    const fetchMerchantPlaces = useCallback(async ({ keyword = '', bounds = null, existingKakaoIds = new Set() } = {}) => {
        try {
            const response = await axios.get('/api/restaurants/merchant-pins');
            const normalizedKeyword = keyword.trim().toLowerCase();

            return (response.data || [])
                .filter(pin => pin.latitude != null && pin.longitude != null)
                .filter(pin => {
                    if (pin.kakaoId && existingKakaoIds.has(String(pin.kakaoId))) return false;

                    if (normalizedKeyword) {
                        const target = `${pin.restName || ''} ${pin.restAddress || ''}`.toLowerCase();
                        return target.includes(normalizedKeyword);
                    }

                    return true;
                })
                .map(normalizeMerchantPin);
        } catch (error) {
            console.warn('merchant-pins 조회 실패:', error);
            return [];
        }
    }, [normalizeMerchantPin]);

    const handleLogout = useCallback(() => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    }, [navigate, logout]);


    const handleBookmarkToggle = useCallback(async (restaurant) => {

        console.log("현재 로그인 상태:", isLoggedIn);
        console.log("전체 유저 정보(user):", user);
        console.log("꺼내려는 userIdx:", user?.userIdx);

        if (!isLoggedIn) {
            alert("로그인 후 이용 가능합니다.");
            navigate('/login');
            return;
        }

        try {

            const payload = restaurant.isDbOnly
                ? { userIdx, restIdx: restaurant.restIdx, restName: restaurant.place_name }
                : { userIdx, kakaoId: restaurant.kakaoId || restaurant.id, restName: restaurant.place_name, restAddress: restaurant.road_address_name || restaurant.address_name, restTel: restaurant.phone };

            await axios.post('/api/bookmarks/toggle', payload);

            setMyBookmarkIds((prev) => {
                const bookmarkId = restaurant.isDbOnly ? `db-${restaurant.restIdx}` : (restaurant.kakaoId || restaurant.id);
                const isExist = prev.includes(bookmarkId);
                return isExist
                    ? prev.filter(id => String(id) !== String(bookmarkId))
                    : [...prev, bookmarkId];
            });

        } catch (error) {
            console.error("즐겨찾기 처리 중 오류 발생:", error);
            alert("처리에 실패했습니다. 다시 시도해주세요.");
        }
    }, [isLoggedIn, userIdx, user, navigate]);

    useEffect(() => {
        const fetchBookmarkIds = async () => {
            if (isLoggedIn && userIdx) {
                try {
                    const response = await axios.get(`/api/bookmarks/my-bookmark-list/${userIdx}`);
                    const stringIds = response.data.map(id => String(id));
                    setMyBookmarkIds(stringIds);
                } catch (error) {
                    console.error("북마크 ID 로드 실패:", error);
                }
            } else {
                setMyBookmarkIds([]);
            }
        };
        fetchBookmarkIds();
    }, [isLoggedIn, userIdx]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. 백엔드에서 실제 혼잡도 데이터를 가져와 리스트에 적용하는 함수 (추가됨)
    const fetchAndApplyCongestion = useCallback(async (currentList) => {
        try {
            const kakaoIds = currentList
                .map(item => item.kakaoId || (!item.isDbOnly ? item.id : null))
                .filter(Boolean);
            const dbOnlyItems = currentList.filter(item => item.isDbOnly && item.restIdx);
            if (kakaoIds.length === 0 && dbOnlyItems.length === 0) return;

            let realData = {};
            if (kakaoIds.length > 0) {
                const response = await axios.post('/api/congestion/bulkStatus', kakaoIds);
                realData = response.data || {};
            }

            const dbCongestionPairs = await Promise.all(dbOnlyItems.map(async (item) => {
                try {
                    const response = await axios.get(`/api/congestion/restIdx/${item.restIdx}`);
                    return [item.id, response.data];
                } catch (error) {
                    console.warn('DB 식당 혼잡도 조회 실패:', item.restIdx, error);
                    return [item.id, null];
                }
            }));
            const dbCongestionMap = Object.fromEntries(dbCongestionPairs);

            setRestaurantList(prev => prev.map(item => ({
                ...item,
                congestion: item.isDbOnly
                    ? (dbCongestionMap[item.id] || '혼잡도 이력 없음')
                    : (realData[item.kakaoId || item.id] || '혼잡도 이력 없음')
            })));
        } catch (error) {
            console.error("DB 혼잡도 로드 실패:", error);
        }
    }, []);

    // 혼잡도 변경 후 리스트 상태를 즉시 업데이트하는 함수
    const handleCongestionChange = useCallback((id, newStatusName) => {
        setRestaurantList(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, congestion: newStatusName }
                    : item
            )
        );
        setShowCongestionModal(false);
    }, []);

    const removeRestaurantMarkers = useCallback(() => {
        restaurantMarkersRef.current.forEach(m => m.setMap(null));
        restaurantMarkersRef.current = [];
        if (infoWindowRef.current) infoWindowRef.current.close();
    }, []);

    const stopBlinkingUserMarker = useCallback(() => {
        if (userLocationBlinkIntervalRef.current) {
            clearInterval(userLocationBlinkIntervalRef.current);
            userLocationBlinkIntervalRef.current = null;
        }
    }, []);

    const startBlinkingUserMarker = useCallback(() => {
        if (userLocationMarkerRef.current && mapInstance) {
            stopBlinkingUserMarker();
            let isVisible = true;
            userLocationBlinkIntervalRef.current = setInterval(() => {
                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setMap(isVisible && userMarkerVisible ? mapInstance : null);
                    isVisible = !isVisible;
                } else stopBlinkingUserMarker();
            }, 500);
        }
    }, [mapInstance, stopBlinkingUserMarker, userMarkerVisible]);

    const handleListItemClick = useCallback((placeId) => {
        const targetElement = document.getElementById(`restaurant-item-${placeId}`);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const handlePanelItemClick = useCallback((place) => {
        if (!mapInstance || !place) return;
        const latLng = new window.kakao.maps.LatLng(place.y, place.x);
        if (mapInstance.getLevel() > 4) mapInstance.setLevel(4);
        mapInstance.panTo(latLng);
    }, [mapInstance]);

    const createAndDisplayMarker = useCallback((place, map, index, onMarkerClick) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);

        const isMerchant = !!place.isMerchantStore;
        const markerSvg = `<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.71573 0 0 6.71573 0 15C0 25 15 40 15 40C15 40 30 25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#007bff"/><circle cx="15" cy="15" r="10" fill="white"/><text x="15" y="15" font-family="Arial" font-size="12" font-weight="bold" fill="#007bff" text-anchor="middle" alignment-baseline="middle">${index}</text></svg>`;
        const markerImage = new window.kakao.maps.MarkerImage(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`, new window.kakao.maps.Size(30, 40));

        // 마커 생성
        const marker = new window.kakao.maps.Marker({ map, position, image: markerImage });

        window.kakao.maps.event.addListener(marker, 'click', () => {
            const projection = map.getProjection();
            const markerPixel = projection.pointFromCoords(position);
            const mapHeight = mapContainerRef.current.offsetHeight;

            // 1. 마커 위치를 기준으로 계산 (마커가 화면의 하단 3/4 지점에 오게 설정)
            // 이렇게 하면 마커 위에 떠 있는 인포윈도우 본체가 화면 중앙(2/4) 부근에 걸립니다.
            const targetY = markerPixel.y - (mapHeight / 2) + 150; // 150px은 인포윈도우의 대략적인 절반 높이
            const targetCenter = projection.coordsFromPoint(new window.kakao.maps.Point(markerPixel.x, targetY));

            // 2. 부드럽게 이동
            map.panTo(targetCenter);

            // 3. 인포윈도우 표시 (이동 후 약간의 지연을 주어 정확한 위치에 고정)
            setTimeout(() => {
                // 1. 서버에서 온 값이 문자열 "null"이거나 진짜 null/undefined일 경우를 필터링
                const displayCongestion = (place.congestion && place.congestion !== 'null')
                    ? place.congestion
                    : '혼잡도 이력 없음';

                const content = `
            <div style="padding:15px; font-size:13px; min-width:220px; width:auto; line-height: 1.5; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <strong style="font-size:15px; color:#007bff; display:block; margin-bottom:5px;">
                    ${index}. ${place.place_name}
                </strong>
                <div style="border-top: 1px solid #eee; padding-top: 5px;">
                    <span> 가게이름: ${place.place_name}</span><br/>
                    <span> 주소: ${place.road_address_name || place.address_name}</span><br/>
                    <span> 전화번호: ${place.phone || '정보 없음'}</span><br/>
                    <span> 평점: ${place.averageRating}</span><br/>
                    <span> 리뷰: ${place.reviewCount}개</span><br/>
                    <span style="color: ${displayCongestion === '매우 혼잡' ? '#dc3545' :
                        displayCongestion === '혼잡' ? '#ffc107' :
                            displayCongestion === '보통' ? '#17a2b8' :
                                displayCongestion === '여유' ? '#28a745' : '#666'
                    }; font-weight: bold;"> 혼잡도: ${displayCongestion}</span>
                </div>
            </div>
        `;

                if (infoWindowRef.current) infoWindowRef.current.close();
                infoWindowRef.current = new window.kakao.maps.InfoWindow({
                    content: content,
                    removable: true
                });
                infoWindowRef.current.open(map, marker);
            }, 100);

            setUserMarkerVisible(false);
            if (onMarkerClick) onMarkerClick(place.id);
        });

        return marker;
    }, []);

    // 45개 검색 로직 복구 (Pagination 활용)
    const searchAndDisplayRestaurants = useCallback(async (centerLatLng, searchType = 'initial', keyword = '', setMapBounds = false) => {
        if (!mapInstance || !window.kakao) return;
        removeRestaurantMarkers();

        const ps = new window.kakao.maps.services.Places();
        let allResults = [];

        const callback = async (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const results = data.filter(p => p.category_group_code === 'FD6');
                allResults = [...allResults, ...results];

                // 최대 45개(3페이지)까지 가져오기
                if (pagination.hasNextPage && allResults.length < 45) {
                    pagination.nextPage();
                    return;
                }

                if (allResults.length === 0) {
                    setRestaurantList([]);
                    if (searchType === 'keyword') {
                        alert('음식점 카테고리에서 검색 결과가 없습니다.');
                    }
                    return;
                }

                const bounds = new window.kakao.maps.LatLngBounds();

                // 모든 식당 상세(평점/리뷰수)를 한 번의 요청으로
                const ids = allResults.map(p => p.id);
                let detailsMap = {};
                try {
                    const response = await axios.post('/api/restaurants/bulkDetails', ids);
                    detailsMap = response.data || {};
                } catch (error) {
                    console.warn("식당 상세 일괄 조회 실패:", error);
                }

                // 마커는 데이터 다 받은 뒤 동기 루프로 한꺼번에 생성
                const newList = allResults.map((place, i) => {
                    const detail = detailsMap[place.id] || { averageRating: 0, reviewCount: 0 };
                    const merged = {
                        ...place,
                        averageRating: detail.averageRating || 0,
                        reviewCount: detail.reviewCount || 0,
                        congestion: '혼잡도 이력 없음'
                    };
                    const marker = createAndDisplayMarker(merged, mapInstance, i + 1, handleListItemClick);
                    restaurantMarkersRef.current.push(marker);
                    bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
                    return merged;
                });

                if (setMapBounds && !bounds.isEmpty() && mapInstance) {
                    mapInstance.setBounds(bounds);
                }

                const merchantPins = await fetchMerchantPlaces({
                    bounds: mapInstance.getBounds(),
                    existingKakaoIds: new Set(ids),
                    keyword: searchType === 'keyword' ? keyword : ''
                });
                const fullList = [...newList, ...(merchantPins || [])];
                setRestaurantList(fullList);
                fetchAndApplyCongestion(fullList);

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                setRestaurantList([]);
                if (searchType === 'keyword') {
                    alert('검색 결과가 없습니다.');
                }
            } else {
                console.error('카카오 검색 오류:', status);
                if (searchType === 'keyword') {
                    alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                }
            }
        };

        const options = searchType === 'keyword'
            ? { location: centerLatLng }
            : { location: centerLatLng, radius: 2000 };
        if (searchType === 'keyword') ps.keywordSearch(keyword, callback, options);
        else ps.categorySearch('FD6', callback, options);
    }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker, handleListItemClick, fetchAndApplyCongestion, fetchMerchantPlaces]);

    useEffect(() => { searchAndDisplayRestaurantsRef.current = searchAndDisplayRestaurants; }, [searchAndDisplayRestaurants]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setIsSearchMode(false);
        setUserMarkerVisible(true);
        if (clickedMarkerRef.current) { clickedMarkerRef.current.setMap(null); clickedMarkerRef.current = null; }
        searchAndDisplayRestaurantsRef.current(mapInstance.getCenter(), 'initial', '', false);
    }, [mapInstance]);

    // [핵심] 리스트(혼잡도 포함)가 바뀔 때마다 지도의 마커를 최신화하는 로직
    useEffect(() => {
        // 지도 객체가 생성되어 있고, 보여줄 식당 리스트가 있을 때만 작동
        if (!mapInstance || restaurantList.length === 0) return;

        // 1. 기존 지도에 그려진 마커들을 모두 지웁니다.
        removeRestaurantMarkers();

        // 2. 현재 상태(restaurantList)를 순회하며 업데이트된 정보로 마커를 다시 생성합니다.
        restaurantList.forEach((place, i) => {
            const marker = createAndDisplayMarker(
                place,
                mapInstance,
                i + 1,
                handleListItemClick
            );
            // 마커 관리 배열(Ref)에 새 마커들을 저장합니다.
            restaurantMarkersRef.current.push(marker);
        });
    }, [restaurantList, mapInstance, createAndDisplayMarker, removeRestaurantMarkers, handleListItemClick]);

    // --- 그 다음 기존 useEffect가 이어짐 ---



    useEffect(() => {
        if (window.kakao && mapContainerRef.current && !mapInitializedRef.current) {
            mapInitializedRef.current = true;
            window.kakao.maps.load(() => {
                const map = new window.kakao.maps.Map(mapContainerRef.current, { center: new window.kakao.maps.LatLng(37.5665, 126.9780), level: 3 });
                setMapInstance(map);
                window.kakao.maps.event.addListener(map, 'click', (e) => {
                    if (clickedMarkerRef.current) clickedMarkerRef.current.setMap(null);
                    clickedMarkerRef.current = new window.kakao.maps.Marker({ position: e.latLng, map });
                    setIsSearchMode(false);
                    searchAndDisplayRestaurantsRef.current(e.latLng, 'click', '', false);
                });
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((p) => {
                        const latLng = new window.kakao.maps.LatLng(p.coords.latitude, p.coords.longitude);
                        setCurrentUserCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude });
                        map.setCenter(latLng);
                        searchAndDisplayRestaurantsRef.current(latLng);
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        if (mapInstance && currentUserCoords) {
            if (!userLocationMarkerRef.current) {
                userLocationMarkerRef.current = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(currentUserCoords.latitude, currentUserCoords.longitude),
                    map: mapInstance
                });
            }
            startBlinkingUserMarker();
        }
        return () => stopBlinkingUserMarker();
    }, [currentUserCoords, mapInstance, startBlinkingUserMarker, stopBlinkingUserMarker, userMarkerVisible]);

    useEffect(() => {
        if (mapInstance) {
            const handleDragEnd = () => { if (!isSearchMode) searchAndDisplayRestaurantsRef.current(mapInstance.getCenter()); };
            window.kakao.maps.event.addListener(mapInstance, 'dragend', handleDragEnd);
            return () => window.kakao.maps.event.removeListener(mapInstance, 'dragend', handleDragEnd);
        }
    }, [mapInstance, isSearchMode]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Header
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                onSearch={() => { setIsSearchMode(true); setUserMarkerVisible(false); searchAndDisplayRestaurantsRef.current(mapInstance.getCenter(), 'keyword', searchTerm, true); }}
                onClear={handleClearSearch} isSearchMode={isSearchMode} isLoggedIn={isLoggedIn} handleLogout={handleLogout} isMobile={isMobile}
            />

            {showCongestionModal && (
                <CongestionChangePanel
                    restaurant={selectedRestaurant}
                    onClose={() => setShowCongestionModal(false)}
                    // 익명 함수 대신 정의한 handleCongestionChange를 연결
                    onCongestionChange={handleCongestionChange}
                />
            )}

            <div ref={mapContainerRef} style={{
                width: '100%', height: '100%', position: 'absolute',
                transform: isMobile && showRestaurantPanel ? `translateX(${RESTAURANT_PANEL_WIDTH_DESKTOP})` : 'translateX(0)',
                transition: 'transform 0.3s ease'
            }}></div>

            {mapInstance && (
                <>
                    <MapControls
                        isMobile={isMobile} currentMapType={currentMapType}
                        handleRoadmapClick={() => { mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP); setCurrentMapType('road'); }}
                        handleSkyviewClick={() => { mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID); setCurrentMapType('sky'); }}
                        handleZoomIn={() => mapInstance.setLevel(mapInstance.getLevel() - 1)}
                        handleZoomOut={() => mapInstance.setLevel(mapInstance.getLevel() + 1)}
                    />
                    <RestaurantListPanel
                        restaurantList={restaurantList}
                        isSearchMode={isSearchMode}
                        onClearSearch={handleClearSearch}
                        showRestaurantPanel={showRestaurantPanel}
                        setShowRestaurantPanel={setShowRestaurantPanel}

                        // 1. 여기에 즐겨찾기 관련 Props 추가
                        myBookmarkIds={myBookmarkIds}
                        onBookmarkToggle={handleBookmarkToggle}

                        // 2. 상세보기로 갈 때 찜 여부 상태도 같이 들고 가기 (선택사항이지만 추천!)
                        onRestaurantClick={(r) => {
                            navigate(`/restaurant-detail/${r.id}`, {
                                state: {
                                    restaurantData: r,
                                    restaurantName: r.place_name,
                                    isBookmarked: r.isDbOnly ? false : myBookmarkIds.includes(Number(r.id))
                                }
                            });
                        }}

                        isLoggedIn={isLoggedIn}
                        onCongestionChangeClick={async (r) => {
                            if (!isLoggedIn) {
                                alert('혼잡도 변경은 로그인 후 이용 가능합니다.');
                                return;
                            }
                            try {
                                const response = await axios.get(`/api/congestion/${r.id}`);
                                const restaurantWithLatest = { ...r, congestion: response.data };
                                setSelectedRestaurant(restaurantWithLatest);
                                setShowCongestionModal(true);
                            } catch (error) {
                                console.error("최근 혼잡도 조회 실패 ", error);
                                setSelectedRestaurant(r);
                                setShowCongestionModal(true);
                            }
                        }}
                        handleListItemClick={handleListItemClick}
                        onPanelItemClick={handlePanelItemClick}
                    />
                    <GoToMyLocationButton
                        currentUserCoords={currentUserCoords}
                        handleGoToMyLocation={() => {
                            if (!currentUserCoords) return;
                            const latLon = new window.kakao.maps.LatLng(currentUserCoords.latitude, currentUserCoords.longitude);
                            mapInstance.setCenter(latLon);
                            handleClearSearch();
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default HomePage;
