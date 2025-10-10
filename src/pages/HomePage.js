import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RestaurantListPanel from '../components/RestaurantListPanel';
import MapControls from '../components/MapControls';
import GoToMyLocationButton from '../components/GoToMyLocationButton';
import LocationPanel from '../components/LocationPanel';
import CongestionChangePanel from '../components/CongestionChangePanel';
import { AuthContext } from '../context/AuthContext'; 

const RESTAURANT_PANEL_WIDTH_DESKTOP = '280px';
const MOBILE_BREAKPOINT = 768;

// 랜덤 평점, 리뷰 수, 혼잡도 생성
const generateDynamicDetails = () => {
    const ratings = (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1);
    const reviewCounts = Math.floor(Math.random() * 200) + 10;
    const congestions = ['매우 혼잡', '혼잡', '보통', '여유'];
    const congestion = congestions[Math.random() < 0.2 ? 0 : Math.floor(Math.random() * congestions.length)];
    return {
        rating: ratings,
        reviewCount: reviewCounts,
        congestion: congestion,
    };
};

const HomePage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);

    // 상태 관리
    const [mapInstance, setMapInstance] = useState(null);
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
    const [showLocationPanel, setShowLocationPanel] = useState(false);
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMapType, setCurrentMapType] = useState('road');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const [showCongestionModal, setShowCongestionModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [userMarkerVisible, setUserMarkerVisible] = useState(true);

    // Ref 관리
    const mapContainerRef = useRef(null);
    const clickedMarkerRef = useRef(null);
    const userLocationMarkerRef = useRef(null);
    const restaurantMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const userLocationBlinkIntervalRef = useRef(null);
    const searchAndDisplayRestaurantsRef = useRef();
    const mapInitializedRef = useRef(false);

    // 로그아웃 처리
    const handleLogout = useCallback(() => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    }, [navigate, logout]);

    // 모바일 화면 크기 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 식당 마커 전체 제거
    const removeRestaurantMarkers = useCallback(() => {
        for (let i = 0; i < restaurantMarkersRef.current.length; i++) {
            restaurantMarkersRef.current[i].setMap(null);
        }
        restaurantMarkersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    }, []);
    
    // 사용자 위치 마커 깜빡임 중지
    const stopBlinkingUserMarker = useCallback(() => {
        if (userLocationBlinkIntervalRef.current) {
            clearInterval(userLocationBlinkIntervalRef.current);
            userLocationBlinkIntervalRef.current = null;
        }
    }, []);

    // 사용자 위치 마커 깜빡임 시작
    const startBlinkingUserMarker = useCallback(() => {
        if (userLocationMarkerRef.current && mapInstance) {
            stopBlinkingUserMarker();
            let isVisible = true;
            userLocationBlinkIntervalRef.current = setInterval(() => {
                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setMap(isVisible ? mapInstance : null);
                    isVisible = !isVisible;
                } else {
                    stopBlinkingUserMarker();
                }
            }, 500);
        }
    }, [mapInstance, stopBlinkingUserMarker]);

    // 리스트 항목 클릭 시 스크롤
    const handleListItemClick = useCallback((placeId) => {
        const targetElement = document.getElementById(`restaurant-item-${placeId}`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, []);

    // 혼잡도 변경 모달 열기
    const onCongestionChangeClick = useCallback((restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowCongestionModal(true);
    }, []);

    // 혼잡도 변경 처리
    const handleCongestionChange = useCallback((newCongestion) => {
        if (selectedRestaurant) {
            setRestaurantList(prevList =>
                prevList.map(item =>
                    item.id === selectedRestaurant.id ? { ...item, congestion: newCongestion } : item
                )
            );
        }
        setShowCongestionModal(false);
    }, [selectedRestaurant]);

    // 마커 클릭 처리
    const handleMarkerClick = useCallback((placeId) => {
        handleListItemClick(placeId);
    }, [handleListItemClick]);

    // 상세 페이지로 데이터 전달하며 이동
    const handleRestaurantClick = useCallback((restaurant) => {
        navigate(`/restaurant-detail/${restaurant.id}`, { 
            state: { restaurantData: restaurant } 
        });
    }, [navigate]);

    // 식당 마커 생성 및 표시
    const createAndDisplayMarker = useCallback((place, map, index = null, onMarkerClick) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        let markerImage = null;
        
        if (index !== null) {
            const markerSvg = `
                <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.71573 0 0 6.71573 0 15C0 25 15 40 15 40C15 40 30 25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#007bff"/>
                    <circle cx="15" cy="15" r="10" fill="white"/>
                    <text x="15" y="15" font-family="Arial" font-size="12" font-weight="bold" fill="#007bff" text-anchor="middle" alignment-baseline="middle">${index}</text>
                </svg>
            `;
            const markerDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`;
            markerImage = new window.kakao.maps.MarkerImage(
                markerDataUrl,
                new window.kakao.maps.Size(30, 40),
                { offset: new window.kakao.maps.Point(15, 40) }
            );
        }

        const marker = new window.kakao.maps.Marker({
            map: map,
            position: position,
            title: place.place_name,
            image: markerImage
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
            const content = `
                <div style="padding:10px;font-size:13px;line-height:1.5;text-align: left;">
                    <strong style="font-size:15px;color:#007bff;">${place.place_name}</strong><br>
                    ${place.road_address_name ? `도로명: ${place.road_address_name}<br>` : ''}
                    ${place.phone ? `전화: ${place.phone}<br>` : ''}
                    ${place.category_name ? `분류: ${place.category_name.split('>').pop().trim()}<br>` : ''}
                    ${place.rating ? `평점: ${place.rating}점 ★<br>` : ''}
                    ${place.reviewCount ? `리뷰: ${place.reviewCount}개<br>` : ''}
                    ${place.congestion ? `혼잡도: ${place.congestion}` : ''}
                </div>
            `;
            
            if (!infoWindowRef.current) {
                infoWindowRef.current = new window.kakao.maps.InfoWindow({
                    removable: true
                });
            }

            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);
            
            window.kakao.maps.event.removeListener(infoWindowRef.current, 'close');
            window.kakao.maps.event.addListener(infoWindowRef.current, 'close', () => {
                setUserMarkerVisible(true);
            });

            setUserMarkerVisible(false);
            map.setCenter(position);

            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
            }

            if (onMarkerClick) {
                onMarkerClick(place.id);
            }
        });
        return marker;
    }, [infoWindowRef, setUserMarkerVisible]);

    // 카카오 API로 식당 검색 및 마커 표시
    const searchAndDisplayRestaurants = useCallback((centerLatLng, searchType = 'initial', keyword = '', setMapBounds = true) => {
        if (!mapInstance || !window.kakao || !window.kakao.maps.services) {
            return;
        }
        
        removeRestaurantMarkers();
        setRestaurantList([]);
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
        
        const ps = new window.kakao.maps.services.Places();
        const searchOptions = {
            location: centerLatLng,
            radius: isMobile ? 500 : 20000,
            size: isMobile ? 10 : 15,
        };
        
        const callback = (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const bounds = new window.kakao.maps.LatLngBounds();
                const newMarkers = [];
                const newRestaurantList = [];
                
                data.forEach((place, index) => {
                    if (place.category_group_code === 'FD6') {
                        const additionalData = generateDynamicDetails();
                        const mergedPlace = { ...place, ...additionalData };
                        const marker = createAndDisplayMarker(mergedPlace, mapInstance, index + 1, handleMarkerClick);
                        newMarkers.push(marker);
                        bounds.extend(new window.kakao.maps.LatLng(mergedPlace.y, mergedPlace.x));
                        newRestaurantList.push(mergedPlace);
                    }
                });
                
                restaurantMarkersRef.current = newMarkers;
                setRestaurantList(newRestaurantList);
                
                if (newMarkers.length > 0 && setMapBounds) {
                    mapInstance.setBounds(bounds);
                } else if (newMarkers.length === 0) {
                    alert(`주변에 검색된 음식점이 없습니다.`);
                }
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert(`주변에 검색된 음식점이 없습니다.`);
                setRestaurantList([]);
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert(`${searchType} 식당 로딩 중 오류가 발생했습니다.`);
                setRestaurantList([]);
            }
        };
        
        if (searchType === 'keyword') {
            ps.keywordSearch(keyword, callback, searchOptions);
        } else {
            ps.categorySearch('FD6', callback, searchOptions);
        }
    }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker, isMobile, handleMarkerClick]);

    useEffect(() => {
        searchAndDisplayRestaurantsRef.current = searchAndDisplayRestaurants;
    }, [searchAndDisplayRestaurants]);

    // 키워드 검색 처리
    const handleKeywordSearch = useCallback(() => {
        if (!mapInstance) {
            alert('지도가 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        if (searchTerm.trim() === '') {
            alert("검색어를 입력해주세요.");
            return;
        }
        
        if (clickedMarkerRef.current) {
            clickedMarkerRef.current.setMap(null);
            clickedMarkerRef.current = null;
        }
        
        setUserMarkerVisible(false);
        searchAndDisplayRestaurantsRef.current(mapInstance.getCenter(), 'keyword', searchTerm, true);
    }, [mapInstance, searchTerm, setUserMarkerVisible]);

    // 지도 초기화 (한 번만 실행)
    useEffect(() => {
        if (mapInitializedRef.current) return;
        
        if (window.kakao && window.kakao.maps && mapContainerRef.current) {
            mapInitializedRef.current = true;

            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainerRef.current, options);
                setMapInstance(map);

                // 지도 클릭 이벤트
                window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
                    const latlng = mouseEvent.latLng;
                    
                    if (clickedMarkerRef.current) {
                        clickedMarkerRef.current.setMap(null);
                        clickedMarkerRef.current = null;
                    }
                    
                    const newMarker = new window.kakao.maps.Marker({
                        position: latlng,
                        map: map,
                    });
                    
                    clickedMarkerRef.current = newMarker;
                    map.setCenter(latlng);
                    searchAndDisplayRestaurantsRef.current(latlng, 'click', '', false);
                });
                
                // 현재 위치 가져오기
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const newCoords = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                            };
                            setCurrentUserCoords(newCoords);
                            const moveLatLng = new window.kakao.maps.LatLng(newCoords.latitude, newCoords.longitude);
                            map.setCenter(moveLatLng);
                            map.setLevel(3);
                            searchAndDisplayRestaurantsRef.current(moveLatLng, 'initial', '', true);
                        },
                        (error) => {
                            console.error('위치 정보 가져오기 실패:', error);
                            searchAndDisplayRestaurantsRef.current(map.getCenter(), 'initial', '', true);
                        }
                    );
                } else {
                    console.log('브라우저가 위치 정보를 지원하지 않습니다.');
                    searchAndDisplayRestaurantsRef.current(map.getCenter(), 'initial', '', true);
                }
            });
        }
    }, []);

    // 사용자 위치 마커 표시/숨김
    useEffect(() => {
        if (mapInstance && currentUserCoords && window.kakao && window.kakao.maps) {
            const position = new window.kakao.maps.LatLng(currentUserCoords.latitude, currentUserCoords.longitude);
            
            if (!userLocationMarkerRef.current) {
                userLocationMarkerRef.current = new window.kakao.maps.Marker({
                    position: position,
                    image: new window.kakao.maps.MarkerImage(
                        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                        new window.kakao.maps.Size(24, 35),
                        { offset: new window.kakao.maps.Point(12, 35) }
                    ),
                    title: "내 위치"
                });
            } else {
                userLocationMarkerRef.current.setPosition(position);
            }
            
            if (userMarkerVisible) {
                userLocationMarkerRef.current.setMap(mapInstance);
                startBlinkingUserMarker();
            } else {
                userLocationMarkerRef.current.setMap(null);
                stopBlinkingUserMarker();
            }
        }
    }, [mapInstance, currentUserCoords, userMarkerVisible, startBlinkingUserMarker, stopBlinkingUserMarker]);

    // 지도 드래그/줌 이벤트 처리
    useEffect(() => {
        if (mapInstance) {
            const handleDragEnd = () => {
                const center = mapInstance.getCenter();
                if (clickedMarkerRef.current) {
                    clickedMarkerRef.current.setMap(null);
                    clickedMarkerRef.current = null;
                }
                searchAndDisplayRestaurantsRef.current(center, 'dragend', '', false);
            };

            const handleZoomChanged = () => {
                if (clickedMarkerRef.current) {
                    clickedMarkerRef.current.setMap(null);
                    clickedMarkerRef.current = null;
                }
            };
            
            window.kakao.maps.event.addListener(mapInstance, 'dragend', handleDragEnd);
            window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', handleZoomChanged);
            
            return () => {
                window.kakao.maps.event.removeListener(mapInstance, 'dragend', handleDragEnd);
                window.kakao.maps.event.removeListener(mapInstance, 'zoom_changed', handleZoomChanged);
            };
        }
    }, [mapInstance]);

    // 식당 목록 변경 시 마커 재생성
    useEffect(() => {
        if (mapInstance && restaurantList.length > 0) {
            removeRestaurantMarkers();
            restaurantList.forEach((restaurant, index) => {
                const marker = createAndDisplayMarker(restaurant, mapInstance, index + 1, handleMarkerClick);
                restaurantMarkersRef.current.push(marker);
            });
        }
    }, [mapInstance, restaurantList, removeRestaurantMarkers, createAndDisplayMarker, handleMarkerClick]);

    // 패널 표시/숨김 시 지도 레이아웃 재조정
    useEffect(() => {
        if (mapInstance) {
            const timer = setTimeout(() => {
                mapInstance.relayout();
                mapInstance.setCenter(mapInstance.getCenter());
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showRestaurantPanel, mapInstance]);

    // 지도 타입 변경
    const handleRoadmapClick = () => {
        if (mapInstance) {
            mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
            setCurrentMapType('road');
        }
    };

    const handleSkyviewClick = () => {
        if (mapInstance) {
            mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
            setCurrentMapType('sky');
        }
    };

    // 줌 인/아웃
    const handleZoomIn = () => {
        if (mapInstance) {
            const newLevel = mapInstance.getLevel() - 1;
            if (newLevel > 0) {
                mapInstance.setLevel(newLevel);
            }
        }
    };

    const handleZoomOut = () => {
        if (mapInstance) {
            const newLevel = mapInstance.getLevel() + 1;
            if (newLevel <= 14) {
                mapInstance.setLevel(newLevel);
            }
        }
    };

    // 내 위치로 이동
    const handleGoToMyLocation = () => {
        if (mapInstance && currentUserCoords && window.kakao && window.kakao.maps) {
            const moveLatLon = new window.kakao.maps.LatLng(currentUserCoords.latitude, currentUserCoords.longitude);
            mapInstance.setCenter(moveLatLon);
            
            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
            }

            setUserMarkerVisible(true);
            searchAndDisplayRestaurantsRef.current(moveLatLon, 'myLocation', '', false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleKeywordSearch}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                isMobile={isMobile}
            />

            {isLoggedIn && (
                <div style={{ position: 'absolute', top: '70px', left: '20px', zIndex: 10, background: 'lightgreen', padding: '5px 10px', borderRadius: '5px' }}>
                    로그인 상태입니다.
                </div>
            )}
            
            <div
                id="map"
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    transform: isMobile && showRestaurantPanel ? `translateX(${RESTAURANT_PANEL_WIDTH_DESKTOP})` : 'translateX(0)',
                    transition: 'transform 0.3s ease',
                }}
            ></div>
            
            {mapInstance ? (
                <>
                    <MapControls
                        isMobile={isMobile}
                        currentMapType={currentMapType}
                        handleRoadmapClick={handleRoadmapClick}
                        handleSkyviewClick={handleSkyviewClick}
                        handleZoomIn={handleZoomIn}
                        handleZoomOut={handleZoomOut}
                    />

                    <RestaurantListPanel
                        restaurantList={restaurantList}
                        handleListItemClick={handleListItemClick}
                        onCongestionChangeClick={onCongestionChangeClick}
                        onRestaurantClick={handleRestaurantClick}
                        onMarkerClick={handleMarkerClick}
                        showRestaurantPanel={showRestaurantPanel}
                        setShowRestaurantPanel={setShowRestaurantPanel}
                    />
                    
                    <GoToMyLocationButton
                        currentUserCoords={currentUserCoords}
                        handleGoToMyLocation={handleGoToMyLocation}
                    />
                    
                    <button
                        onClick={() => setShowLocationPanel(prev => !prev)}
                        style={{
                            position: 'fixed',
                            top: isMobile ? '130px' : '115px',
                            right: isMobile ? '10px' : '10px',
                            zIndex: 10,
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: showLocationPanel ? '#007bff' : 'rgba(255, 255, 255, 0.9)',
                            color: showLocationPanel ? 'white' : '#333',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                    >
                        내 위치 정보
                    </button>
                    
                    <LocationPanel
                        currentUserCoords={currentUserCoords}
                        showLocationPanel={showLocationPanel}
                        setShowLocationPanel={setShowLocationPanel}
                        handleLocationUpdate={setCurrentUserCoords}
                    />
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: 'calc(50vh - 30px)' }}>
                    지도 로딩 중...
                </div>
            )}

            {showCongestionModal && (
                <CongestionChangePanel
                    restaurant={selectedRestaurant}
                    onClose={() => setShowCongestionModal(false)}
                    onCongestionChange={handleCongestionChange}
                />
            )}
        </div>
    );
};

export default HomePage;