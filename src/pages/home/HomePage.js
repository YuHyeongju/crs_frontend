import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RestaurantListPanel from './RestaurantListPanel';
import MapControls from '../../components/map/MapControls';
import GoToMyLocationButton from '../../components/map/GoToMyLocationButton';
import LocationPanel from '../../components/map/LocationPanel';
import CongestionChangePanel from '../../components/congestion/CongestionChangePanel';
import { AuthContext } from '../../context/AuthContext';

const RESTAURANT_PANEL_WIDTH_DESKTOP = '280px';
const MOBILE_BREAKPOINT = 768;

const generateDynamicDetails = () => {
    const ratings = (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1);
    const reviewCounts = Math.floor(Math.random() * 200) + 10;
    const congestions = ['매우 혼잡', '혼잡', '보통', '여유'];
    const congestion = congestions[Math.random() < 0.2 ? 0 : Math.floor(Math.random() * congestions.length)];
    return { rating: ratings, reviewCount: reviewCounts, congestion: congestion };
};

const HomePage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);

    const [mapInstance, setMapInstance] = useState(null);
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
    const [showLocationPanel, setShowLocationPanel] = useState(false);
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [currentMapType, setCurrentMapType] = useState('road');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const [showCongestionModal, setShowCongestionModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [userMarkerVisible, setUserMarkerVisible] = useState(true);

    const mapContainerRef = useRef(null);
    const clickedMarkerRef = useRef(null);
    const userLocationMarkerRef = useRef(null);
    const restaurantMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const userLocationBlinkIntervalRef = useRef(null);
    const searchAndDisplayRestaurantsRef = useRef();
    const mapInitializedRef = useRef(false);

    const handleLogout = useCallback(() => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    }, [navigate, logout]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

    const createAndDisplayMarker = useCallback((place, map, index, onMarkerClick) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        const markerSvg = `<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.71573 0 0 6.71573 0 15C0 25 15 40 15 40C15 40 30 25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#007bff"/><circle cx="15" cy="15" r="10" fill="white"/><text x="15" y="15" font-family="Arial" font-size="12" font-weight="bold" fill="#007bff" text-anchor="middle" alignment-baseline="middle">${index}</text></svg>`;
        const markerImage = new window.kakao.maps.MarkerImage(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`, new window.kakao.maps.Size(30, 40));

        const marker = new window.kakao.maps.Marker({ map, position, image: markerImage });

        window.kakao.maps.event.addListener(marker, 'click', () => {
            const content = `<div style="padding:10px; font-size:12px;"><strong>${place.place_name}</strong></div>`;
            if (infoWindowRef.current) infoWindowRef.current.close();
            infoWindowRef.current = new window.kakao.maps.InfoWindow({ content, removable: true });
            infoWindowRef.current.open(map, marker);
            setUserMarkerVisible(false);
            if (onMarkerClick) onMarkerClick(place.id);
        });
        return marker;
    }, []);

    // 45개 검색 로직 복구 (Pagination 활용)
    const searchAndDisplayRestaurants = useCallback((centerLatLng, searchType = 'initial', keyword = '', setMapBounds = true) => {
        if (!mapInstance || !window.kakao) return;
        removeRestaurantMarkers();

        const ps = new window.kakao.maps.services.Places();
        let allResults = [];

        const callback = (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const results = data.filter(p => p.category_group_code === 'FD6');
                allResults = [...allResults, ...results];

                // 최대 45개(3페이지)까지 가져오기
                if (pagination.hasNextPage && allResults.length < 45) {
                    pagination.nextPage();
                    return;
                }

                const bounds = new window.kakao.maps.LatLngBounds();
                const newList = allResults.map((place, i) => {
                    const merged = { ...place, ...generateDynamicDetails() };
                    const marker = createAndDisplayMarker(merged, mapInstance, i + 1, handleListItemClick);
                    restaurantMarkersRef.current.push(marker);
                    bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
                    return merged;
                });

                setRestaurantList(newList);
                if (setMapBounds && newList.length > 0) mapInstance.setBounds(bounds);
            }
        };

        const options = { location: centerLatLng, radius: 2000 };
        if (searchType === 'keyword') ps.keywordSearch(keyword, callback, options);
        else ps.categorySearch('FD6', callback, options);
    }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker, handleListItemClick]);

    useEffect(() => { searchAndDisplayRestaurantsRef.current = searchAndDisplayRestaurants; }, [searchAndDisplayRestaurants]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setIsSearchMode(false);
        setUserMarkerVisible(true);
        if (clickedMarkerRef.current) { clickedMarkerRef.current.setMap(null); clickedMarkerRef.current = null; }
        searchAndDisplayRestaurantsRef.current(mapInstance.getCenter(), 'initial', '', false);
    }, [mapInstance]);

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
                        restaurantList={restaurantList} isSearchMode={isSearchMode} onClearSearch={handleClearSearch}
                        showRestaurantPanel={showRestaurantPanel} setShowRestaurantPanel={setShowRestaurantPanel}
                        onRestaurantClick={(r) => navigate(`/restaurant-detail/${r.id}`, { state: { restaurantData: r } })}
                        onCongestionChangeClick={(r) => { setSelectedRestaurant(r); setShowCongestionModal(true); }}
                        handleListItemClick={handleListItemClick}
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
                    <button onClick={() => setShowLocationPanel(!showLocationPanel)} style={{ position: 'fixed', top: '120px', right: '10px', zIndex: 10, padding: '10px', background: showLocationPanel ? '#007bff' : 'white', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}>내 위치 정보</button>
                    <LocationPanel currentUserCoords={currentUserCoords} showLocationPanel={showLocationPanel} setShowLocationPanel={setShowLocationPanel} handleLocationUpdate={setCurrentUserCoords} />
                </>
            )}

            {showCongestionModal && (
                <CongestionChangePanel
                    restaurant={selectedRestaurant}
                    onClose={() => setShowCongestionModal(false)}
                    onCongestionChange={(val) => {
                        setRestaurantList(prev => prev.map(item => item.id === selectedRestaurant.id ? { ...item, congestion: val } : item));
                        setShowCongestionModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default HomePage;