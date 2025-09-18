// import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
// import RestaurantListPanel from '../components/RestaurantListPanel';
// import MapControls from '../components/MapControls';
// import GoToMyLocationButton from '../components/GoToMyLocationButton';
// import LocationPanel from '../components/LocationPanel';
// import CongestionChangePanel from '../components/CongestionChangePanel';
// import { AuthContext } from '../context/AuthContext'; 

// // 데스크톱 환경에서 식당 패널의 너비와 모바일 기준 해상도 정의
// const RESTAURANT_PANEL_WIDTH_DESKTOP = '280px';
// const MOBILE_BREAKPOINT = 768;

// // 식당의 평점, 리뷰 수, 혼잡도 등 동적 정보를 생성하는 함수
// const generateDynamicDetails = () => {
//     const ratings = (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1);
//     const reviewCounts = Math.floor(Math.random() * 200) + 10;
//     const congestions = ['매우 혼잡', '혼잡', '보통', '여유'];
//     const congestion = congestions[Math.random() < 0.2 ? 0 : Math.floor(Math.random() * congestions.length)];
//     return {
//         rating: ratings,
//         reviewCount: reviewCounts,
//         congestion: congestion,
//     };
// };

// const HomePage = () => {
//     // 페이지 이동을 위한 useNavigate 훅
//     const navigate = useNavigate();

//     // 로그인 상태 및 로그아웃 함수를 AuthContext에서 가져옴
//     const { isLoggedIn, logout } = useContext(AuthContext);

//     // 상태 변수들 (useState)
//     const [mapInstance, setMapInstance] = useState(null);
//     const [currentUserCoords, setCurrentUserCoords] = useState(null);
//     const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
//     const [showLocationPanel, setShowLocationPanel] = useState(true);
//     const [restaurantList, setRestaurantList] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentMapType, setCurrentMapType] = useState('road');
//     const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
//     const [showCongestionModal, setShowCongestionModal] = useState(false);
//     const [selectedRestaurant, setSelectedRestaurant] = useState(null);

//     // DOM 요소 및 객체 참조 (useRef)
//     const mapContainerRef = useRef(null);
//     const clickedMarkerRef = useRef(null);
//     const userLocationMarkerRef = useRef(null);
//     const restaurantMarkersRef = useRef([]);
//     const infoWindowRef = useRef(null);
//     const userMarkerImageRef = useRef(null);
//     const userLocationBlinkIntervalRef = useRef(null);
    
//     // 초기 위치 설정 여부 (useEffect의 무한 호출 방지)
//     const [initialLocationSet, setInitialLocationSet] = useState(false);

//     // 사용자 위치 정보를 업데이트하는 콜백 함수
//     const handleLocationUpdate = useCallback((coords) => {
//         setCurrentUserCoords(coords);
//     }, []);

//     // 로그아웃 처리 함수
//     const handleLogout = useCallback(() => {
//         logout();
//         alert('로그아웃 되었습니다.');
//         navigate('/');
//     }, [navigate, logout]);

//     // 화면 크기 변경을 감지하여 모바일 여부 상태를 업데이트하는 useEffect
//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
//         };
//         window.addEventListener('resize', handleResize);
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     // 지도에 표시된 모든 식당 마커를 제거하는 함수
//     const removeRestaurantMarkers = useCallback(() => {
//         for (let i = 0; i < restaurantMarkersRef.current.length; i++) {
//             restaurantMarkersRef.current[i].setMap(null);
//         }
//         restaurantMarkersRef.current = [];
//         if (infoWindowRef.current) {
//             infoWindowRef.current.close();
//         }
//     }, []);

//     // 현재 위치 마커의 깜빡임을 멈추는 함수
//     const stopBlinkingUserMarker = useCallback(() => {
//         if (userLocationBlinkIntervalRef.current) {
//             clearInterval(userLocationBlinkIntervalRef.current);
//             userLocationBlinkIntervalRef.current = null;
//             if (userLocationMarkerRef.current) {
//                 userLocationMarkerRef.current.setMap(mapInstance);
//             }
//         }
//     }, [mapInstance]);

//     // 현재 위치 마커의 깜빡임을 시작하는 함수
//     const startBlinkingUserMarker = useCallback(() => {
//         if (userLocationMarkerRef.current && mapInstance) {
//             stopBlinkingUserMarker();
//             let isVisible = true;
//             userLocationBlinkIntervalRef.current = setInterval(() => {
//                 if (userLocationMarkerRef.current) {
//                     userLocationMarkerRef.current.setMap(isVisible ? mapInstance : null);
//                     isVisible = !isVisible;
//                 } else {
//                     stopBlinkingUserMarker();
//                 }
//             }, 500);
//         }
//     }, [mapInstance, stopBlinkingUserMarker]);

//     // 식당 리스트 항목을 클릭했을 때 해당 항목으로 스크롤하는 함수
//     const handleListItemClick = useCallback((placeId) => {
//         const targetElement = document.getElementById(`restaurant-item-${placeId}`);
//         if (targetElement) {
//             targetElement.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'center',
//             });
//         }
//     }, []);

//     // 혼잡도 변경 모달 열기 함수
//     const onCongestionChangeClick = useCallback((restaurant) => {
//         setSelectedRestaurant(restaurant);
//         setShowCongestionModal(true);
//     }, []);

//     // 혼잡도 변경 함수
//     const handleCongestionChange = useCallback((newCongestion) => {
//         if (selectedRestaurant) {
//             setRestaurantList(prevList =>
//                 prevList.map(item =>
//                     item.id === selectedRestaurant.id ? { ...item, congestion: newCongestion } : item
//                 )
//             );
//         }
//         setShowCongestionModal(false);
//     }, [selectedRestaurant]);

//     // 식당 마커 클릭 시 호출되는 함수
//     const handleMarkerClick = useCallback((placeId) => {
//         handleListItemClick(placeId);
//     }, [handleListItemClick]);

//     // 식당 리스트 클릭 시 상세 페이지로 이동하는 함수
//     const handleRestaurantClick = useCallback((restaurant) => {
//         navigate(`/restaurant/${restaurant.id}`);
//     }, [navigate]);

//     // 식당 마커를 생성하고 지도에 표시하는 함수
//     const createAndDisplayMarker = useCallback((place, map, index = null, onMarkerClick) => {
//         const position = new window.kakao.maps.LatLng(place.y, place.x);
//         let markerImage = null;
//         if (index !== null) {
//             // 커스텀 마커 이미지 (SVG) 생성
//             const markerSvg = `
//                 <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M15 0C6.71573 0 0 6.71573 0 15C0 25 15 40 15 40C15 40 30 25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#007bff"/>
//                     <circle cx="15" cy="15" r="10" fill="white"/>
//                     <text x="15" y="15" font-family="Arial" font-size="12" font-weight="bold" fill="#007bff" text-anchor="middle" alignment-baseline="middle">${index}</text>
//                 </svg>
//             `;
//             const markerDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`;
//             markerImage = new window.kakao.maps.MarkerImage(
//                 markerDataUrl,
//                 new window.kakao.maps.Size(30, 40),
//                 { offset: new window.kakao.maps.Point(15, 40) }
//             );
//         }

//         // 마커 객체 생성
//         const marker = new window.kakao.maps.Marker({
//             map: map,
//             position: position,
//             title: place.place_name,
//             image: markerImage
//         });

//         // 마커 클릭 이벤트 리스너 추가
//         window.kakao.maps.event.addListener(marker, 'click', () => {
//             // 인포윈도우에 표시할 내용
//             const content = `
//                 <div style="padding:10px;font-size:13px;line-height:1.5;text-align: left;">
//                     <strong style="font-size:15px;color:#007bff;">${place.place_name}</strong><br>
//                     ${place.road_address_name ? `도로명: ${place.road_address_name}<br>` : ''}
//                     ${place.phone ? `전화: ${place.phone}<br>` : ''}
//                     ${place.category_name ? `분류: ${place.category_name.split('>').pop().trim()}<br>` : ''}
//                     ${place.rating ? `평점: ${place.rating}점 ★<br>` : ''}
//                     ${place.reviewCount ? `리뷰: ${place.reviewCount}개<br>` : ''}
//                     ${place.congestion ? `혼잡도: ${place.congestion}` : ''}
//                 </div>
//             `;
//             // 인포윈도우 열기
//             if (infoWindowRef.current) {
//                 infoWindowRef.current.setContent(content);
//                 infoWindowRef.current.open(map, marker);
//             } else {
//                 infoWindowRef.current = new window.kakao.maps.InfoWindow({
//                     content: content,
//                     removable: true
//                 });
//                 infoWindowRef.current.open(map, marker);
//             }

//             // 인포윈도우가 닫힐 때 현재 위치 마커 깜빡임 재시작
//             if (infoWindowRef.current) {
//                 window.kakao.maps.event.addListener(infoWindowRef.current, 'close', () => {
//                     if (userLocationMarkerRef.current && userLocationBlinkIntervalRef.current === null) {
//                         startBlinkingUserMarker();
//                     }
//                 });
//             }

//             // 리스트 패널의 해당 항목으로 스크롤
//             if (onMarkerClick) {
//                 onMarkerClick(place.id);
//             }

//             // 마커 클릭 시 현재 위치 마커 깜빡임 중지
//             if (userLocationMarkerRef.current && userLocationBlinkIntervalRef.current) {
//                 stopBlinkingUserMarker();
//             }
//         });
//         return marker;
//     }, [infoWindowRef, stopBlinkingUserMarker, startBlinkingUserMarker, userLocationMarkerRef]);

//     // 중심 좌표를 기준으로 식당을 검색하고 마커로 표시하는 함수
//     const searchAndDisplayRestaurants = useCallback((centerLatLng, searchType = 'initial', keyword = '') => {
//         if (!mapInstance || !window.kakao || !window.kakao.maps.services) {
//             return;
//         }
//         removeRestaurantMarkers();
//         setRestaurantList([]);
//         if (infoWindowRef.current) {
//             infoWindowRef.current.close();
//         }
//         const ps = new window.kakao.maps.services.Places();
//         const searchOptions = {
//             location: centerLatLng,
//             radius: isMobile ? 500 : 20000,
//             size: isMobile ? 10 : 15,
//         };
//         const callback = (data, status) => {
//             if (status === window.kakao.maps.services.Status.OK) {
//                 const bounds = new window.kakao.maps.LatLngBounds();
//                 const newMarkers = [];
//                 const newRestaurantList = [];
//                 data.forEach((place, index) => {
//                     if (place.category_group_code === 'FD6') {
//                         const additionalData = generateDynamicDetails();
//                         const mergedPlace = { ...place, ...additionalData };

//                         const marker = createAndDisplayMarker(mergedPlace, mapInstance, index + 1, handleMarkerClick);
//                         newMarkers.push(marker);
//                         bounds.extend(new window.kakao.maps.LatLng(mergedPlace.y, mergedPlace.x));
//                         newRestaurantList.push(mergedPlace);
//                     }
//                 });
//                 restaurantMarkersRef.current = newMarkers;
//                 setRestaurantList(newRestaurantList);
//                 if (newMarkers.length > 0) {
//                     mapInstance.setBounds(bounds);
//                 } else {
//                     alert(`주변에 검색된 음식점이 없습니다.`);
//                 }
//             } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
//                 alert(`주변에 검색된 음식점이 없습니다.`);
//                 setRestaurantList([]);
//             } else if (status === window.kakao.maps.services.Status.ERROR) {
//                 alert(`${searchType} 식당 로딩 중 오류가 발생했습니다.`);
//                 setRestaurantList([]);
//             }
//         };
//         if (searchType === 'keyword') {
//             ps.keywordSearch(keyword, callback, searchOptions);
//         } else {
//             ps.categorySearch('FD6', callback, searchOptions);
//         }
//     }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker, isMobile, handleMarkerClick]);

//     // 검색 버튼 클릭 시 키워드 검색을 실행하는 함수
//     const handleKeywordSearch = useCallback(() => {
//         if (!mapInstance) {
//             alert('지도가 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.');
//             return;
//         }
//         if (searchTerm.trim() === '') {
//             alert("검색어를 입력해주세요.");
//             return;
//         }
//         if (clickedMarkerRef.current) {
//             clickedMarkerRef.current.setMap(null);
//             clickedMarkerRef.current = null;
//         }
//         if (userLocationMarkerRef.current) {
//             userLocationMarkerRef.current.setMap(null);
//             stopBlinkingUserMarker();
//         }
//         const mapCenter = mapInstance.getCenter();
//         searchAndDisplayRestaurants(mapCenter, 'keyword', searchTerm);
//         setShowRestaurantPanel(true);
//     }, [mapInstance, searchTerm, searchAndDisplayRestaurants, stopBlinkingUserMarker]);

//     // 지도 타입을 일반 지도로 변경하는 함수
//     const handleRoadmapClick = useCallback(() => {
//         if (mapInstance) {
//             mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
//             setCurrentMapType('road');
//         }
//     }, [mapInstance]);

//     // 지도 타입을 스카이뷰로 변경하는 함수
//     const handleSkyviewClick = useCallback(() => {
//         if (mapInstance) {
//             mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
//             setCurrentMapType('sky');
//         }
//     }, [mapInstance]);

//     // 지도를 확대하는 함수
//     const handleZoomIn = useCallback(() => {
//         if (mapInstance) {
//             const currentLevel = mapInstance.getLevel();
//             mapInstance.setLevel(currentLevel - 1);
//         }
//     }, [mapInstance]);

//     // 지도를 축소하는 함수
//     const handleZoomOut = useCallback(() => {
//         if (mapInstance) {
//             const currentLevel = mapInstance.getLevel();
//             mapInstance.setLevel(currentLevel + 1);
//         }
//     }, [mapInstance]);

//     // 컴포넌트 마운트 시 카카오 지도 API를 로드하고 지도 인스턴스를 생성하는 useEffect
//     useEffect(() => {
//         if (mapContainerRef.current && window.kakao && window.kakao.maps) {
//             window.kakao.maps.load(() => {
//                 const mapContainer = mapContainerRef.current;
//                 const mapOption = {
//                     center: new window.kakao.maps.LatLng(33.450701, 126.570667),
//                     level: 3
//                 };
//                 const map = new window.kakao.maps.Map(mapContainer, mapOption);
//                 setMapInstance(map);
//                 infoWindowRef.current = new window.kakao.maps.InfoWindow({ removable: true });
//                 const redCircleSvg = `
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <circle cx="12" cy="12" r="10" fill="red" stroke="white" stroke-width="2"/>
//                     </svg>
//                 `;
//                 const redMarkerDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(redCircleSvg)}`;
//                 userMarkerImageRef.current = new window.kakao.maps.MarkerImage(
//                     redMarkerDataUrl,
//                     new window.kakao.maps.Size(24, 24),
//                     { offset: new window.kakao.maps.Point(12, 24) }
//                 );
//             });
//         }
//     }, []);

//     // currentUserCoords가 변경될 때마다 현재 위치 마커를 업데이트하는 useEffect
//     useEffect(() => {
//         if (mapInstance && currentUserCoords) {
//             const { latitude, longitude } = currentUserCoords;
//             const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);
//             if (!initialLocationSet) {
//                 removeRestaurantMarkers();
//                 const marker = new window.kakao.maps.Marker({
//                     map: mapInstance,
//                     position: userLatLng,
//                     image: userMarkerImageRef.current,
//                 });
//                 userLocationMarkerRef.current = marker;
//                 mapInstance.setCenter(userLatLng);
//                 setInitialLocationSet(true);
//                 startBlinkingUserMarker();
//                 searchAndDisplayRestaurants(userLatLng, 'initial');
//             } else {
//                 if (!clickedMarkerRef.current) {
//                     if (userLocationMarkerRef.current) {
//                         userLocationMarkerRef.current.setPosition(userLatLng);
//                         userLocationMarkerRef.current.setMap(mapInstance);
//                         startBlinkingUserMarker();
//                     }
//                 } else {
//                     if (userLocationMarkerRef.current) {
//                         userLocationMarkerRef.current.setMap(null);
//                         stopBlinkingUserMarker();
//                     }
//                 }
//             }
//         } else if (mapInstance && !currentUserCoords && userLocationMarkerRef.current) {
//             userLocationMarkerRef.current.setMap(null);
//             userLocationMarkerRef.current = null;
//             stopBlinkingUserMarker();
//         }
//         return () => {
//             stopBlinkingUserMarker();
//         };
//     }, [mapInstance, currentUserCoords, initialLocationSet, searchAndDisplayRestaurants, removeRestaurantMarkers, startBlinkingUserMarker, stopBlinkingUserMarker]);

//     // 지도 클릭 시 동작을 정의하는 useEffect
//     useEffect(() => {
//         let clickHandler;
//         if (mapInstance) {
//             clickHandler = function (mouseEvent) {
//                 const latlng = mouseEvent.latLng;
//                 if (clickedMarkerRef.current) {
//                     clickedMarkerRef.current.setMap(null);
//                 }
//                 if (userLocationMarkerRef.current) {
//                     userLocationMarkerRef.current.setMap(null);
//                     stopBlinkingUserMarker();
//                 }
//                 const newClickedMarker = new window.kakao.maps.Marker({
//                     position: latlng,
//                     map: mapInstance
//                 });
//                 clickedMarkerRef.current = newClickedMarker;
//                 searchAndDisplayRestaurants(latlng, 'click');
//                 setShowRestaurantPanel(true);
//             };
//             window.kakao.maps.event.addListener(mapInstance, 'click', clickHandler);
//         }
//         return () => {
//             if (mapInstance && clickHandler) {
//                 window.kakao.maps.event.removeListener(mapInstance, 'click', clickHandler);
//             }
//         };
//     }, [mapInstance, searchAndDisplayRestaurants, stopBlinkingUserMarker]);

//     // "내 위치로 이동" 버튼 클릭 시 동작을 정의하는 함수
//     const handleGoToMyLocation = useCallback(() => {
//         if (!currentUserCoords) {
//             alert("위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
//             return;
//         }
//         if (mapInstance && userMarkerImageRef.current) {
//             const { latitude, longitude } = currentUserCoords;
//             const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);
//             if (clickedMarkerRef.current) {
//                 clickedMarkerRef.current.setMap(null);
//                 clickedMarkerRef.current = null;
//             }
//             mapInstance.setCenter(userLatLng);
//             if (userLocationMarkerRef.current) {
//                 userLocationMarkerRef.current.setPosition(userLatLng);
//                 userLocationMarkerRef.current.setMap(mapInstance);
//                 userLocationMarkerRef.current.setImage(userMarkerImageRef.current);
//             } else {
//                 const marker = new window.kakao.maps.Marker({
//                     map: mapInstance,
//                     position: userLatLng,
//                     image: userMarkerImageRef.current,
//                 });
//                 userLocationMarkerRef.current = marker;
//             }
//             startBlinkingUserMarker();
//             searchAndDisplayRestaurants(userLatLng, 'myLocation');
//             setShowRestaurantPanel(true);
//         }
//     }, [mapInstance, currentUserCoords, searchAndDisplayRestaurants, startBlinkingUserMarker]);

//     // 지도 너비 및 위치를 계산하는 변수
//     const mapWidth = isMobile ? '100vw' : (showRestaurantPanel ? `calc(100vw - ${RESTAURANT_PANEL_WIDTH_DESKTOP})` : '100vw');
//     const mapLeft = isMobile ? '0' : (showRestaurantPanel ? RESTAURANT_PANEL_WIDTH_DESKTOP : '0');

//     // 컴포넌트 렌더링
//     return (
//         <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
//             <Header
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 handleKeywordSearch={handleKeywordSearch}
//                 isLoggedIn={isLoggedIn}
//                 handleLogout={handleLogout}
//                 isMobile={isMobile}
//             />

//             <div
//                 id="map"
//                 ref={mapContainerRef}
//                 style={{
//                     width: mapWidth,
//                     height: '100vh',
//                     backgroundColor: 'lightgray',
//                     marginTop: isMobile ? '120px' : '60px',
//                     left: mapLeft,
//                     position: 'absolute',
//                     transition: 'none',
//                 }}
//             >
//                 지도 로딩 중...
//             </div>

//             <MapControls
//                 currentMapType={currentMapType}
//                 handleRoadmapClick={handleRoadmapClick}
//                 handleSkyviewClick={handleSkyviewClick}
//                 handleZoomIn={handleZoomIn}
//                 handleZoomOut={handleZoomOut}
//                 isMobile={isMobile}
//             />

//             <RestaurantListPanel
//                 restaurantList={restaurantList}
//                 handleListItemClick={handleListItemClick}
//                 onCongestionChangeClick={onCongestionChangeClick} 
//                 onRestaurantClick={handleRestaurantClick} 
//                 showRestaurantPanel={showRestaurantPanel}
//                 setShowRestaurantPanel={setShowRestaurantPanel}
//             />

//             <GoToMyLocationButton
//                 currentUserCoords={currentUserCoords}
//                 handleGoToMyLocation={handleGoToMyLocation}
//             />

//             <LocationPanel
//                 currentUserCoords={currentUserCoords}
//                 showLocationPanel={showLocationPanel}
//                 setShowLocationPanel={setShowLocationPanel}
//                 handleLocationUpdate={handleLocationUpdate}
//             />
            
//             {showCongestionModal && (
//                 <CongestionChangePanel
//                     restaurant={selectedRestaurant}
//                     onClose={() => setShowCongestionModal(false)}
//                     onCongestionChange={handleCongestionChange}
//                 />
//             )}
//         </div>
//     );
// };

// export default HomePage;

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RestaurantListPanel from '../components/RestaurantListPanel';
import MapControls from '../components/MapControls';
import GoToMyLocationButton from '../components/GoToMyLocationButton';
import LocationPanel from '../components/LocationPanel';
import CongestionChangePanel from '../components/CongestionChangePanel';
import { AuthContext } from '../context/AuthContext'; 

// 데스크톱 환경에서 식당 패널의 너비와 모바일 기준 해상도 정의
const RESTAURANT_PANEL_WIDTH_DESKTOP = '280px';
const MOBILE_BREAKPOINT = 768;

// 식당의 평점, 리뷰 수, 혼잡도 등 동적 정보를 생성하는 함수
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
    // 페이지 이동을 위한 useNavigate 훅
    const navigate = useNavigate();

    // 로그인 상태 및 로그아웃 함수를 AuthContext에서 가져옴
    const { isLoggedIn, logout } = useContext(AuthContext);

    // 상태 변수들 (useState)
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
    const [userMarkerVisible, setUserMarkerVisible] = useState(true); // 현재 위치 핀 가시성 상태

    // DOM 요소 및 객체 참조 (useRef)
    const mapContainerRef = useRef(null);
    const clickedMarkerRef = useRef(null);
    const userLocationMarkerRef = useRef(null);
    const restaurantMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const userLocationBlinkIntervalRef = useRef(null);
    
    // useRef를 사용하여 함수 참조를 저장하여 종속성 안정화
    const searchAndDisplayRestaurantsRef = useRef();

    // 초기 위치 설정 여부 (useEffect의 무한 호출 방지)
    const [initialLocationSet, setInitialLocationSet] = useState(false);

    // 로그아웃 처리 함수
    const handleLogout = useCallback(() => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    }, [navigate, logout]);

    // 화면 크기 변경을 감지하여 모바일 여부 상태를 업데이트하는 useEffect
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 지도에 표시된 모든 식당 마커를 제거하는 함수
    const removeRestaurantMarkers = useCallback(() => {
        for (let i = 0; i < restaurantMarkersRef.current.length; i++) {
            restaurantMarkersRef.current[i].setMap(null);
        }
        restaurantMarkersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    }, []);
    
    // 현재 위치 마커의 깜빡임을 멈추는 함수
    const stopBlinkingUserMarker = useCallback(() => {
        if (userLocationBlinkIntervalRef.current) {
            clearInterval(userLocationBlinkIntervalRef.current);
            userLocationBlinkIntervalRef.current = null;
        }
    }, []);

    // 현재 위치 마커의 깜빡임을 시작하는 함수
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

    // 식당 리스트 항목을 클릭했을 때 해당 항목으로 스크롤하는 함수
    const handleListItemClick = useCallback((placeId) => {
        const targetElement = document.getElementById(`restaurant-item-${placeId}`);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, []);

    // 혼잡도 변경 모달 열기 함수
    const onCongestionChangeClick = useCallback((restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowCongestionModal(true);
    }, []);

    // 혼잡도 변경 함수
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

    // 식당 마커 클릭 시 호출되는 함수
    const handleMarkerClick = useCallback((placeId) => {
        handleListItemClick(placeId);
    }, [handleListItemClick]);

    // 식당 리스트 클릭 시 상세 페이지로 이동하는 함수
    const handleRestaurantClick = useCallback((restaurant) => {
        navigate(`/restaurant/${restaurant.id}`);
    }, [navigate]);

    // 식당 마커를 생성하고 지도에 표시하는 함수
    const createAndDisplayMarker = useCallback((place, map, index = null, onMarkerClick) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        let markerImage = null;
        if (index !== null) {
            // 커스텀 마커 이미지 (SVG) 생성
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

        // 마커 객체 생성
        const marker = new window.kakao.maps.Marker({
            map: map,
            position: position,
            title: place.place_name,
            image: markerImage
        });

        // 마커 클릭 이벤트 리스너 추가
        window.kakao.maps.event.addListener(marker, 'click', () => {
            // 인포윈도우에 표시할 내용
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
            // 인포윈도우가 이미 존재하면 내용만 업데이트, 없으면 새로 생성
            if (!infoWindowRef.current) {
                infoWindowRef.current = new window.kakao.maps.InfoWindow({
                    removable: true
                });
            }

            // 인포윈도우의 내용을 업데이트하고 지도에 표시
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);
            
            // 인포윈도우가 닫힐 때 현재 위치 핀 다시 보이게 하기
            // 이전 리스너를 제거하고 새로운 리스너를 추가하여 중복을 방지합니다.
            window.kakao.maps.event.removeListener(infoWindowRef.current, 'close');
            window.kakao.maps.event.addListener(infoWindowRef.current, 'close', () => {
                setUserMarkerVisible(true);
            });

            // 마커 클릭 시 현재 위치 핀 숨김
            setUserMarkerVisible(false);

            // 리스트 패널의 해당 항목으로 스크롤
            if (onMarkerClick) {
                onMarkerClick(place.id);
            }
        });
        return marker;
    }, [infoWindowRef, setUserMarkerVisible]); // 종속성 배열을 `infoWindowRef`와 `setUserMarkerVisible`로 수정

    // 중심 좌표를 기준으로 식당을 검색하고 마커로 표시하는 함수
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
                        const marker = createAndDisplayMarker(mergedPlace, mapInstance, index + 1, handleMarkerClick);
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
            } else if (status === window.kakao.maps.maps.services.Status.ZERO_RESULT) {
                alert(`주변에 검색된 음식점이 없습니다.`);
                setRestaurantList([]);
            } else if (status === window.kakao.maps.maps.services.Status.ERROR) {
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

    // useRef에 최신 함수를 저장하여 항상 최신 상태를 참조하도록 함
    useEffect(() => {
        searchAndDisplayRestaurantsRef.current = searchAndDisplayRestaurants;
    }, [searchAndDisplayRestaurants]);
    

    // 검색 버튼 클릭 시 키워드 검색을 실행하는 함수
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
        setUserMarkerVisible(false); // 키워드 검색 시 현재 위치 핀 숨기기
        searchAndDisplayRestaurantsRef.current(mapInstance.getCenter(), 'keyword', searchTerm);
    }, [mapInstance, searchTerm, setUserMarkerVisible]);

    // 지도 인스턴스 초기화 및 이벤트 리스너 설정
    useEffect(() => {
        if (!initialLocationSet && window.kakao && window.kakao.maps && mapContainerRef.current) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainerRef.current, options);
                setMapInstance(map);

                // 지도 클릭 이벤트를 감지하는 리스너를 등록합니다.
                window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
                    const latlng = mouseEvent.latLng;
                    
                    // 기존에 찍힌 마커가 있다면 제거
                    if (clickedMarkerRef.current) {
                        clickedMarkerRef.current.setMap(null);
                    }
                    
                    // 새로운 마커 생성 및 지도에 표시
                    const newMarker = new window.kakao.maps.Marker({
                        position: latlng,
                        map: map,
                    });
                    
                    clickedMarkerRef.current = newMarker;

                    // 지도 중심을 클릭한 위치로 이동시키고 확대 (확대 레벨 3)
                    map.setCenter(latlng);
                    map.setLevel(3);
                });
                
                // 현재 위치 가져오기
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const newCoords = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            setCurrentUserCoords(newCoords);
                            const moveLatLng = new window.kakao.maps.LatLng(newCoords.latitude, newCoords.longitude);
                            map.setCenter(moveLatLng);
                            map.setLevel(3);
                            setInitialLocationSet(true);
                            searchAndDisplayRestaurantsRef.current(moveLatLng, 'initial');
                        },
                        (error) => {
                            console.error('위치 정보 가져오기 실패:', error);
                            setInitialLocationSet(true);
                            searchAndDisplayRestaurantsRef.current(map.getCenter(), 'initial');
                        }
                    );
                } else {
                    console.log('브라우저가 위치 정보를 지원하지 않습니다.');
                    setInitialLocationSet(true);
                    searchAndDisplayRestaurantsRef.current(map.getCenter(), 'initial');
                }
            });
        }
    }, [initialLocationSet]);

    // currentUserCoords가 업데이트될 때마다 현재 위치 마커를 생성하고, userMarkerVisible 상태에 따라 표시/숨김
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
            // userMarkerVisible 상태에 따라 마커 표시/숨김 및 깜빡임 제어
            if (userMarkerVisible) {
                userLocationMarkerRef.current.setMap(mapInstance);
                startBlinkingUserMarker();
            } else {
                userLocationMarkerRef.current.setMap(null);
                stopBlinkingUserMarker();
            }
        }
    }, [mapInstance, currentUserCoords, userMarkerVisible, startBlinkingUserMarker, stopBlinkingUserMarker]);

    // 지도 중앙 및 줌 레벨 변경 시 식당 검색
    useEffect(() => {
        if (mapInstance && initialLocationSet) {
            const handleMapEvents = () => {
                const center = mapInstance.getCenter();
                searchAndDisplayRestaurantsRef.current(center, 'initial');
            };
            window.kakao.maps.event.addListener(mapInstance, 'dragend', handleMapEvents);
            window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', handleMapEvents);
            return () => {
                window.kakao.maps.event.removeListener(mapInstance, 'dragend', handleMapEvents);
                window.kakao.maps.event.removeListener(mapInstance, 'zoom_changed', handleMapEvents);
            };
        }
    }, [mapInstance, initialLocationSet]);

    // 식당 목록이 업데이트될 때 마커 생성
    useEffect(() => {
        if (mapInstance && restaurantList.length > 0) {
            removeRestaurantMarkers();
            restaurantList.forEach((restaurant, index) => {
                const marker = createAndDisplayMarker(restaurant, mapInstance, index + 1, handleMarkerClick);
                restaurantMarkersRef.current.push(marker);
            });
        }
    }, [mapInstance, restaurantList, removeRestaurantMarkers, createAndDisplayMarker, handleMarkerClick]);

    // 리사이즈 시 지도 레이아웃 재조정
    useEffect(() => {
        if (mapInstance) {
            const timer = setTimeout(() => {
                mapInstance.relayout();
                mapInstance.setCenter(mapInstance.getCenter());
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showRestaurantPanel, mapInstance]);

    // 지도 컨트롤 및 기능 관련 핸들러 함수들
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

    const handleGoToMyLocation = () => {
        if (mapInstance && currentUserCoords && window.kakao && window.kakao.maps) {
            const moveLatLon = new window.kakao.maps.LatLng(currentUserCoords.latitude, currentUserCoords.longitude);
            mapInstance.setCenter(moveLatLon);
            mapInstance.setLevel(3);
            
            // 수정된 부분: 상태를 업데이트하여 마커를 다시 표시합니다.
            setUserMarkerVisible(true);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleKeywordSearch={handleKeywordSearch}
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
                    
                    {/* LocationPanel 토글 버튼 추가 */}
                    <button
                        onClick={() => setShowLocationPanel(prev => !prev)}
                        style={{
                            position: 'fixed',
                            top: isMobile ? '130px' : '16.5vh',
                            right: isMobile ? '10px' : '0.5vw',
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

