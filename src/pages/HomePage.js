import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RestaurantListPanel from '../components/RestaurantListPanel';
import MapControls from '../components/MapControls';
import GoToMyLocationButton from '../components/GoToMyLocationButton';
import LocationPanel from '../components/LocationPanel';
import { AuthContext } from '../context/AuthContext'; 

const RESTAURANT_PANEL_WIDTH_DESKTOP = '320px';
const MOBILE_BREAKPOINT = 768;

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
    const [mapInstance, setMapInstance] = useState(null);
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
    const [showLocationPanel, setShowLocationPanel] = useState(true);
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMapType, setCurrentMapType] = useState('road');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

    const mapContainerRef = useRef(null);
    const clickedMarkerRef = useRef(null);
    const userLocationMarkerRef = useRef(null);
    const restaurantMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const userMarkerImageRef = useRef(null);
    const userLocationBlinkIntervalRef = useRef(null);
    const [initialLocationSet, setInitialLocationSet] = useState(false);

    const handleLocationUpdate = useCallback((coords) => {
        setCurrentUserCoords(coords);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    }, [navigate, logout]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const removeRestaurantMarkers = useCallback(() => {
        for (let i = 0; i < restaurantMarkersRef.current.length; i++) {
            restaurantMarkersRef.current[i].setMap(null);
        }
        restaurantMarkersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    }, []);

    const stopBlinkingUserMarker = useCallback(() => {
        if (userLocationBlinkIntervalRef.current) {
            clearInterval(userLocationBlinkIntervalRef.current);
            userLocationBlinkIntervalRef.current = null;
            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setMap(mapInstance);
            }
        }
    }, [mapInstance]);

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

    const handleListItemClick = useCallback((placeId) => {
        const targetElement = document.getElementById(`restaurant-item-${placeId}`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, []);

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
            if (infoWindowRef.current) {
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
            } else {
                infoWindowRef.current = new window.kakao.maps.InfoWindow({
                    content: content,
                    removable: true
                });
                infoWindowRef.current.open(map, marker);
            }
            if (onMarkerClick) {
                onMarkerClick(place.id);
            }
        });
        return marker;
    }, [infoWindowRef]);

    const searchAndDisplayRestaurants = useCallback((centerLatLng, searchType = 'initial', keyword = '') => {
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

                        const marker = createAndDisplayMarker(mergedPlace, mapInstance, index + 1, handleListItemClick);
                        newMarkers.push(marker);
                        bounds.extend(new window.kakao.maps.LatLng(mergedPlace.y, mergedPlace.x));
                        newRestaurantList.push(mergedPlace);
                    }
                });
                restaurantMarkersRef.current = newMarkers;
                setRestaurantList(newRestaurantList);
                if (newMarkers.length > 0) {
                    mapInstance.setBounds(bounds);
                } else {
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
    }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker, isMobile, handleListItemClick]);

    const handleKeywordSearch = useCallback(() => {
        if (searchTerm.trim() === '') {
            alert("검색어를 입력해주세요.");
            return;
        }
        if (clickedMarkerRef.current) {
            clickedMarkerRef.current.setMap(null);
            clickedMarkerRef.current = null;
        }
        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
            stopBlinkingUserMarker();
        }
        const mapCenter = mapInstance.getCenter();
        searchAndDisplayRestaurants(mapCenter, 'keyword', searchTerm);
        setShowRestaurantPanel(true);
    }, [mapInstance, searchTerm, searchAndDisplayRestaurants, stopBlinkingUserMarker]);

    const handleRoadmapClick = useCallback(() => {
        if (mapInstance) {
            mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
            setCurrentMapType('road');
        }
    }, [mapInstance]);

    const handleSkyviewClick = useCallback(() => {
        if (mapInstance) {
            mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
            setCurrentMapType('sky');
        }
    }, [mapInstance]);

    const handleZoomIn = useCallback(() => {
        if (mapInstance) {
            const currentLevel = mapInstance.getLevel();
            mapInstance.setLevel(currentLevel - 1);
        }
    }, [mapInstance]);

    const handleZoomOut = useCallback(() => {
        if (mapInstance) {
            const currentLevel = mapInstance.getLevel();
            mapInstance.setLevel(currentLevel + 1);
        }
    }, [mapInstance]);

    useEffect(() => {
        if (mapContainerRef.current && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const mapContainer = mapContainerRef.current;
                const mapOption = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);
                setMapInstance(map);
                infoWindowRef.current = new window.kakao.maps.InfoWindow({ removable: true });
                const redCircleSvg = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="red" stroke="white" stroke-width="2"/>
                    </svg>
                `;
                const redMarkerDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(redCircleSvg)}`;
                userMarkerImageRef.current = new window.kakao.maps.MarkerImage(
                    redMarkerDataUrl,
                    new window.kakao.maps.Size(24, 24),
                    { offset: new window.kakao.maps.Point(12, 24) }
                );
            });
        }
    }, []);

    useEffect(() => {
        if (mapInstance && currentUserCoords) {
            const { latitude, longitude } = currentUserCoords;
            const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);
            if (!initialLocationSet) {
                removeRestaurantMarkers();
                const marker = new window.kakao.maps.Marker({
                    map: mapInstance,
                    position: userLatLng,
                    image: userMarkerImageRef.current,
                });
                userLocationMarkerRef.current = marker;
                mapInstance.setCenter(userLatLng);
                setInitialLocationSet(true);
                startBlinkingUserMarker();
                searchAndDisplayRestaurants(userLatLng, 'initial');
            } else {
                if (!clickedMarkerRef.current) {
                    if (userLocationMarkerRef.current) {
                        userLocationMarkerRef.current.setPosition(userLatLng);
                        userLocationMarkerRef.current.setMap(mapInstance);
                        startBlinkingUserMarker();
                    }
                } else {
                    if (userLocationMarkerRef.current) {
                        userLocationMarkerRef.current.setMap(null);
                        stopBlinkingUserMarker();
                    }
                }
            }
        } else if (mapInstance && !currentUserCoords && userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
            userLocationMarkerRef.current = null;
            stopBlinkingUserMarker();
        }
        return () => {
            stopBlinkingUserMarker();
        };
    }, [mapInstance, currentUserCoords, initialLocationSet, searchAndDisplayRestaurants, removeRestaurantMarkers, startBlinkingUserMarker, stopBlinkingUserMarker]);

    useEffect(() => {
        let clickHandler;
        if (mapInstance) {
            clickHandler = function (mouseEvent) {
                const latlng = mouseEvent.latLng;
                if (clickedMarkerRef.current) {
                    clickedMarkerRef.current.setMap(null);
                }
                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setMap(null);
                    stopBlinkingUserMarker();
                }
                const newClickedMarker = new window.kakao.maps.Marker({
                    position: latlng,
                    map: mapInstance
                });
                clickedMarkerRef.current = newClickedMarker;
                searchAndDisplayRestaurants(latlng, 'click');
                setShowRestaurantPanel(true);
            };
            window.kakao.maps.event.addListener(mapInstance, 'click', clickHandler);
        }
        return () => {
            if (mapInstance && clickHandler) {
                window.kakao.maps.event.removeListener(mapInstance, 'click', clickHandler);
            }
        };
    }, [mapInstance, searchAndDisplayRestaurants, stopBlinkingUserMarker]);

    const handleGoToMyLocation = useCallback(() => {
        if (!currentUserCoords) {
            alert("위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        if (mapInstance && userMarkerImageRef.current) {
            const { latitude, longitude } = currentUserCoords;
            const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);
            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
            }
            mapInstance.setCenter(userLatLng);
            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setPosition(userLatLng);
                userLocationMarkerRef.current.setMap(mapInstance);
                userLocationMarkerRef.current.setImage(userMarkerImageRef.current);
            } else {
                const marker = new window.kakao.maps.Marker({
                    map: mapInstance,
                    position: userLatLng,
                    image: userMarkerImageRef.current,
                });
                userLocationMarkerRef.current = marker;
            }
            startBlinkingUserMarker();
            // 수정된 부분: handleListItemClick 함수를 인자로 전달하여 오류 해결
            searchAndDisplayRestaurants(userLatLng, 'myLocation');
            setShowRestaurantPanel(true);
        }
    }, [mapInstance, currentUserCoords, searchAndDisplayRestaurants, startBlinkingUserMarker]);

    const mapWidth = isMobile ? '100vw' : (showRestaurantPanel ? `calc(100vw - ${RESTAURANT_PANEL_WIDTH_DESKTOP})` : '100vw');
    const mapLeft = isMobile ? '0' : (showRestaurantPanel ? RESTAURANT_PANEL_WIDTH_DESKTOP : '0');

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleKeywordSearch={handleKeywordSearch}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                isMobile={isMobile}
            />

            <div
                id="map"
                ref={mapContainerRef}
                style={{
                    width: mapWidth,
                    height: '100vh',
                    backgroundColor: 'lightgray',
                    marginTop: isMobile ? '120px' : '60px',
                    left: mapLeft,
                    position: 'absolute',
                    transition: 'none',
                }}
            >
                지도 로딩 중...
            </div>

            <MapControls
                currentMapType={currentMapType}
                handleRoadmapClick={handleRoadmapClick}
                handleSkyviewClick={handleSkyviewClick}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                isMobile={isMobile}
            />

            <RestaurantListPanel
                restaurantList={restaurantList}
                handleListItemClick={handleListItemClick}
                showRestaurantPanel={showRestaurantPanel}
                setShowRestaurantPanel={setShowRestaurantPanel}
            />

            <GoToMyLocationButton
                currentUserCoords={currentUserCoords}
                handleGoToMyLocation={handleGoToMyLocation}
            />

            <LocationPanel
                currentUserCoords={currentUserCoords}
                showLocationPanel={showLocationPanel}
                setShowLocationPanel={setShowLocationPanel}
                handleLocationUpdate={handleLocationUpdate}
            />
        </div>
    );
};

export default HomePage;