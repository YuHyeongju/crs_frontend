// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaSearch, FaMapMarkerAlt, FaCompass, FaChevronLeft, FaTimes } from 'react-icons/fa';
// import MyLocationComponent from '../components/CurrentLocation';
// import { ReactComponent as ProfileIcon } from '../assets/Vector.svg';

// const RESTAURANT_CATEGORY_CODE = 'FD6';
// const RESTAURANT_PANEL_WIDTH = '320px';
// const LOCATION_PANEL_WIDTH = '280px';
// const RIGHT_OFFSET = '10px';

// const HomePage = () => {
//     const navigate = useNavigate();
//     const [mapInstance, setMapInstance] = useState(null);
//     const [currentUserCoords, setCurrentUserCoords] = useState(null);
//     const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
//     const [showLocationPanel, setShowLocationPanel] = useState(true);
//     const [restaurantList, setRestaurantList] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentMapType, setCurrentMapType] = useState('road');
//     // 로그인 상태를 관리하는 새로운 상태 변수
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     const mapContainerRef = useRef(null);
//     const clickedMarkerRef = useRef(null);
//     const userLocationMarkerRef = useRef(null);
//     const restaurantMarkersRef = useRef([]);
//     const infoWindowRef = useRef(null);
//     const userMarkerImageRef = useRef(null);
//     const userLocationBlinkIntervalRef = useRef(null);
//     const [initialLocationSet, setInitialLocationSet] = useState(false);

//     // MyLocationComponent에서 위치 정보를 업데이트 받을 콜백
//     const handleLocationUpdate = useCallback((coords) => {
//         setCurrentUserCoords(coords);
//     }, []);

//     // 로그아웃 처리 함수
//     const handleLogout = useCallback(() => {
//         localStorage.removeItem('isLoggedIn');
//         setIsLoggedIn(false);
//         alert('로그아웃 되었습니다.');
//         navigate('/');
//     }, [navigate]);

//     const removeRestaurantMarkers = useCallback(() => {
//         console.log("HomePage: removeRestaurantMarkers 실행.");
//         for (let i = 0; i < restaurantMarkersRef.current.length; i++) {
//             restaurantMarkersRef.current[i].setMap(null);
//         }
//         restaurantMarkersRef.current = [];
//         if (infoWindowRef.current) {
//             infoWindowRef.current.close();
//         }
//     }, []);

//     const stopBlinkingUserMarker = useCallback(() => {
//         if (userLocationBlinkIntervalRef.current) {
//             clearInterval(userLocationBlinkIntervalRef.current);
//             userLocationBlinkIntervalRef.current = null;
//             if (userLocationMarkerRef.current) {
//                 userLocationMarkerRef.current.setMap(mapInstance);
//             }
//             console.log("HomePage: 사용자 마커 깜빡임 중지.");
//         }
//     }, [mapInstance]);

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
//             console.log("HomePage: 사용자 마커 깜빡임 시작.");
//         }
//     }, [mapInstance, stopBlinkingUserMarker]);

//     // 공통 마커 생성 및 인포윈도우 설정 로직
//     const createAndDisplayMarker = useCallback((place, map, index = null) => {
//         const position = new window.kakao.maps.LatLng(place.y, place.x);
//         let markerImage = null;
//         if (index !== null) {
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

//         const marker = new window.kakao.maps.Marker({
//             map: map,
//             position: position,
//             title: place.place_name,
//             image: markerImage
//         });

//         window.kakao.maps.event.addListener(marker, 'click', function () {
//             console.log(`마커 클릭: ${place.place_name}`);
//             const detailPageLink = `/restaurant-detail/${place.id}`;
//             const content = `
//                 <div style="padding:10px;font-size:13px;line-height:1.5;">
//                     <strong style="font-size:15px;color:#007bff;">${place.place_name}</strong><br>
//                     ${place.road_address_name ? `도로명: ${place.road_address_name}<br>` : ''}
//                     ${place.phone ? `전화: ${place.phone}<br>` : ''}
//                     ${place.category_name ? `분류: ${place.category_name.split('>').pop().trim()}<br>` : ''}
//                     <a href="${detailPageLink}" style="color:#28a745;text-decoration:none;">상세보기</a>
//                 </div>
//             `;
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
//         });
//         return marker;
//     }, [infoWindowRef]);

//     const searchAndDisplayRestaurants = useCallback((centerLatLng, searchType = 'initial', keyword = '') => {
//         console.log(`HomePage: ${searchType} 식당 검색 실행. 중심:`, centerLatLng);

//         if (!mapInstance || !window.kakao || !window.kakao.maps.services) {
//             console.log("HomePage: 지도 인스턴스 또는 카카오 서비스 미준비. 식당 로드 불가.");
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
//             radius: 20000
//         };

//         const callback = (data, status) => {
//             if (status === window.kakao.maps.services.Status.OK) {
//                 console.log(`HomePage: ${searchType} 검색 결과 수신 성공.`, data);

//                 const bounds = new window.kakao.maps.LatLngBounds();
//                 const newMarkers = [];
//                 const newRestaurantList = [];

//                 data.forEach((place, index) => {
//                     if (place.category_group_code === RESTAURANT_CATEGORY_CODE) {
//                         const marker = createAndDisplayMarker(place, mapInstance, index + 1);
//                         newMarkers.push(marker);
//                         bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
//                         newRestaurantList.push(place);
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
//             ps.categorySearch(RESTAURANT_CATEGORY_CODE, callback, searchOptions);
//         }
//     }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker]);

//     const handleKeywordSearch = useCallback(() => {
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

//     // 지도 유형 '일반지도'로 변경
//     const handleRoadmapClick = useCallback(() => {
//         if (mapInstance) {
//             mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
//             setCurrentMapType('road');
//         }
//     }, [mapInstance]);

//     // 지도 유형 '스카이뷰'로 변경
//     const handleSkyviewClick = useCallback(() => {
//         if (mapInstance) {
//             mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
//             setCurrentMapType('sky');
//         }
//     }, [mapInstance]);

//     // 지도 확대
//     const handleZoomIn = useCallback(() => {
//         if (mapInstance) {
//             const currentLevel = mapInstance.getLevel();
//             mapInstance.setLevel(currentLevel - 1);
//         }
//     }, [mapInstance]);

//     // 지도 축소
//     const handleZoomOut = useCallback(() => {
//         if (mapInstance) {
//             const currentLevel = mapInstance.getLevel();
//             mapInstance.setLevel(currentLevel + 1);
//         }
//     }, [mapInstance]);

//     // 로그인 상태를 localStorage에서 확인하여 상태 업데이트
//     useEffect(() => {
//         const loggedInStatus = localStorage.getItem('isLoggedIn');
//         if (loggedInStatus === 'true') {
//             setIsLoggedIn(true);
//         }
//     }, []);

//     useEffect(() => {
//         console.log("HomePage: 지도 초기화 useEffect 실행.");
//         if (mapContainerRef.current && window.kakao && window.kakao.maps) {
//             window.kakao.maps.load(() => {
//                 console.log("HomePage: 카카오 맵 SDK 로드 완료.");
//                 const mapContainer = mapContainerRef.current;
//                 const mapOption = {
//                     center: new window.kakao.maps.LatLng(33.450701, 126.570667),
//                     level: 3
//                 };
//                 const map = new window.kakao.maps.Map(mapContainer, mapOption);
//                 setMapInstance(map);

//                 // 카카오맵 기본 컨트롤 제거
//                 // const mapTypeControl = new window.kakao.maps.MapTypeControl();
//                 // map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
//                 // const zoomControl = new window.kakao.maps.ZoomControl();
//                 // map.addControl(zoomControl, window.kakao.maps.ControlPosition.BOTTOMRIGHT);

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

//     useEffect(() => {
//         console.log("HomePage: 사용자 위치 및 초기 로드 useEffect 실행.");
//         if (mapInstance && currentUserCoords && userMarkerImageRef.current && !initialLocationSet) {
//             const { latitude, longitude } = currentUserCoords;
//             const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

//             removeRestaurantMarkers();

//             const marker = new window.kakao.maps.Marker({
//                 map: mapInstance,
//                 position: userLatLng,
//                 image: userMarkerImageRef.current,
//             });
//             userLocationMarkerRef.current = marker;
//             mapInstance.setCenter(userLatLng);
//             setInitialLocationSet(true);
//             startBlinkingUserMarker();
//             searchAndDisplayRestaurants(userLatLng, 'initial');
//         } else if (mapInstance && currentUserCoords && initialLocationSet) {
//             const { latitude, longitude } = currentUserCoords;
//             const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

//             if (!clickedMarkerRef.current) {
//                 if (userLocationMarkerRef.current) {
//                     userLocationMarkerRef.current.setPosition(userLatLng);
//                     userLocationMarkerRef.current.setMap(mapInstance);
//                     startBlinkingUserMarker();
//                 }
//             } else {
//                 if (userLocationMarkerRef.current) {
//                     userLocationMarkerRef.current.setMap(null);
//                     stopBlinkingUserMarker();
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

//     useEffect(() => {
//         let clickHandler;
//         if (mapInstance) {
//             clickHandler = function (mouseEvent) {
//                 const latlng = mouseEvent.latLng;
//                 console.log(`지도 클릭: 위도 ${latlng.getLat()}, 경도 ${latlng.getLng()}`);
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

//     const handleGoToMyLocation = useCallback(() => {
//         console.log("내 위치로 이동 버튼 클릭됨.");
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

//     const handleListItemClick = useCallback((placeId) => {
//         const targetPlace = restaurantList.find(p => p.id === placeId);
//         if (!targetPlace) return;

//         const targetMarker = restaurantMarkersRef.current.find(marker => marker.getTitle() === targetPlace.place_name);
//         if (targetMarker && mapInstance) {
//             mapInstance.setCenter(targetMarker.getPosition());
//             window.kakao.maps.event.trigger(targetMarker, 'click');
//         } else if (mapInstance) {
//             const position = new window.kakao.maps.LatLng(targetPlace.y, targetPlace.x);
//             mapInstance.setCenter(position);
//             const detailPageLink = `/restaurant-detail/${targetPlace.id}`;
//             const content = `
//                 <div style="padding:10px;font-size:13px;line-height:1.5;">
//                     <strong style="font-size:15px;color:#007bff;">${targetPlace.place_name}</strong><br>
//                     ${targetPlace.road_address_name ? `도로명: ${targetPlace.road_address_name}<br>` : ''}
//                     ${targetPlace.phone ? `전화: ${targetPlace.phone}<br>` : ''}
//                     ${targetPlace.category_name ? `분류: ${targetPlace.category_name.split('>').pop().trim()}<br>` : ''}
//                     <a href="${detailPageLink}" style="color:#28a745;text-decoration:none;">상세보기</a>
//                 </div>
//             `;
//             if (infoWindowRef.current) {
//                 infoWindowRef.current.setContent(content);
//                 infoWindowRef.current.open(mapInstance, new window.kakao.maps.Marker({ position: position }));
//             }
//         }
//     }, [mapInstance, restaurantList]);


//     const mapWidth = showRestaurantPanel ? `calc(100% - ${RESTAURANT_PANEL_WIDTH})` : '100%';
//     const mapLeft = showRestaurantPanel ? RESTAURANT_PANEL_WIDTH : '0px';

//     return (
//         <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

//             {/* --- 상단 헤더: 로고, 검색창, 로그인/프로필 버튼 --- */}
//             <nav style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '98vw',
//                 padding: '10px 20px',
//                 borderBottom: '1px solid #ccc',
//                 backgroundColor: '#f0f0f0',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 height: '40px',
//                 zIndex: 100
//             }}>

//                 <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
//                     <FaMapMarkerAlt style={{ fontSize: '24px', color: '#E74C3C' }} />
//                     <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' }}>
//                         CRS
//                     </span>
//                 </Link>

//                 <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     backgroundColor: 'white',
//                     borderRadius: '25px',
//                     padding: '5px 15px',
//                     border: '1px solid #ddd',
//                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                 }}>
//                     <input
//                         type="text"
//                         placeholder="식당 검색..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleKeywordSearch();
//                             }
//                         }}
//                         style={{
//                             border: 'none',
//                             outline: 'none',
//                             fontSize: '15px',
//                             padding: '5px 0',
//                             width: '200px',
//                             marginRight: '10px'
//                         }}
//                     />
//                     <FaSearch
//                         onClick={handleKeywordSearch}
//                         style={{ color: '#007bff', cursor: 'pointer' }}
//                     />
//                 </div>

//                 {/* 로그인 상태에 따라 버튼 또는 프로필 사진을 조건부로 렌더링 */}
//                 {isLoggedIn ? (
//                     <div
//                         onClick={handleLogout}
//                         style={{
//                             width: '40px',
//                             height: '40px',
//                             borderRadius: '50%',
//                             overflow: 'hidden',
//                             cursor: 'pointer',
//                             border: '2px solid #fff',
//                             boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
//                         }}
//                         title="로그아웃"
//                     >
//                         <ProfileIcon style={{ width: '80%', height: '100%' }} /> 
//                     </div>
//                 ) : (
//                     <Link to="/login" style={{
//                         textDecoration: 'none',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         padding: '5px 15px',
//                         borderRadius: '5px',
//                         fontWeight: 'bold',
//                         fontSize: '16px'
//                     }}>
//                         로그인
//                     </Link>
//                 )}
//             </nav>

//             {/* --- 지도 --- */}
//             <div
//                 id="map"
//                 ref={mapContainerRef}
//                 style={{
//                     width: mapWidth,
//                     height: 'calc(100vh - 60px)',
//                     backgroundColor: 'lightgray',
//                     marginTop: '60px',
//                     left: mapLeft,
//                     position: 'absolute',
//                     transition: 'none',
//                 }}
//             >
//                 지도 로딩 중...
//             </div>

//             {/* 스카이뷰/일반지도 전환 버튼 그룹 */}
//             <div style={{
//                 position: 'absolute',
//                 top: '70px',
//                 right: '10px',
//                 zIndex: 10,
//                 display: 'flex',
//                 gap: '5px',
//             }}>
//                 <button
//                     onClick={handleRoadmapClick}
//                     style={{
//                         backgroundColor: currentMapType === 'road' ? '#007bff' : 'rgba(255, 255, 255, 0.9)',
//                         color: currentMapType === 'road' ? 'white' : '#333',
//                         border: '1px solid #ccc',
//                         borderRadius: '5px',
//                         padding: '8px 12px',
//                         cursor: 'pointer',
//                         boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         transition: 'background-color 0.3s ease, color 0.3s ease',
//                     }}
//                     title="일반 지도로 전환"
//                 >
//                     일반지도
//                 </button>
//                 <button
//                     onClick={handleSkyviewClick}
//                     style={{
//                         backgroundColor: currentMapType === 'sky' ? '#007bff' : 'rgba(255, 255, 255, 0.9)',
//                         color: currentMapType === 'sky' ? 'white' : '#333',
//                         border: '1px solid #ccc',
//                         borderRadius: '5px',
//                         padding: '8px 12px',
//                         cursor: 'pointer',
//                         boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         transition: 'background-color 0.3s ease, color 0.3s ease',
//                     }}
//                     title="스카이뷰로 전환"
//                 >
//                     스카이뷰
//                 </button>
//             </div>

//             {/* 커스텀 확대/축소 버튼 */}
//             <div style={{
//                 position: 'absolute',
//                 bottom: '5vh',
//                 right: '0.5vw',
//                 zIndex: 10,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                 border: '1px solid #ccc',
//                 borderRadius: '5px',
//                 overflow: 'hidden',
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
//             }}>
//                 <button
//                     onClick={handleZoomIn}
//                     style={{
//                         width: '36px',
//                         height: '36px',
//                         border: 'none',
//                         borderBottom: '1px solid #ccc',
//                         backgroundColor: 'transparent',
//                         fontSize: '24px',
//                         fontWeight: 'bold',
//                         color: '#555',
//                         cursor: 'pointer',
//                         padding: 0
//                     }}
//                     title="확대"
//                 >
//                     +
//                 </button>
//                 <button
//                     onClick={handleZoomOut}
//                     style={{
//                         width: '36px',
//                         height: '36px',
//                         border: 'none',
//                         backgroundColor: 'transparent',
//                         fontSize: '24px',
//                         fontWeight: 'bold',
//                         color: '#555',
//                         cursor: 'pointer',
//                         padding: 0
//                     }}
//                     title="축소"
//                 >
//                     -
//                 </button>
//             </div>


//             {/* 좌측 식당 목록 패널 (오버레이) */}
//             {showRestaurantPanel && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         top: '60px',
//                         left: 0,
//                         width: RESTAURANT_PANEL_WIDTH,
//                         height: 'calc(100vh - 60px)',
//                         backgroundColor: '#f8f8f8',
//                         zIndex: 90,
//                         boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         transform: showRestaurantPanel ? 'translateX(0)' : `translateX(-${RESTAURANT_PANEL_WIDTH})`,
//                         transition: 'transform 0.3s ease-out',
//                     }}
//                 >
//                     {/* 패널 숨기기 버튼 (패널 내부에 있을 때) */}
//                     <button
//                         onClick={() => setShowRestaurantPanel(false)}
//                         style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '-20px',
//                             backgroundColor: '#fff',
//                             border: '1px solid #ddd',
//                             borderRadius: '50%',
//                             width: '30px',
//                             height: '30px',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             cursor: 'pointer',
//                             zIndex: 10,
//                             boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                         }}
//                         title="패널 숨기기"
//                     >
//                         <FaChevronLeft style={{ fontSize: '16px', color: '#555' }} />
//                     </button>

//                     {/* 식당 목록 */}
//                     <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
//                         <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
//                             검색 결과 ({restaurantList.length}개)
//                         </h3>
//                         {restaurantList.length > 0 ? (
//                             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//                                 {restaurantList.map((place, index) => (
//                                     <li
//                                         key={place.id}
//                                         onClick={() => handleListItemClick(place.id)}
//                                         style={{
//                                             padding: '12px 10px',
//                                             borderBottom: '1px solid #eee',
//                                             cursor: 'pointer',
//                                             backgroundColor: (index % 2 === 0) ? '#fff' : '#fefefe',
//                                             borderRadius: '5px',
//                                             marginBottom: '8px',
//                                             boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//                                             transition: 'background-color 0.2s',
//                                         }}
//                                         onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
//                                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = (index % 2 === 0) ? '#fff' : '#fefefe'}
//                                     >
//                                         <strong style={{ color: '#007bff', fontSize: '16px' }}>{index + 1}. {place.place_name}</strong><br />
//                                         <span style={{ fontSize: '13px', color: '#555' }}>
//                                             {place.road_address_name || place.address_name}
//                                         </span><br />
//                                         {place.phone && <span style={{ fontSize: '12px', color: '#777' }}>📞 {place.phone}</span>}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>
//                                 검색된 식당이 없습니다.
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {!showRestaurantPanel && (
//                 <button
//                     onClick={() => setShowRestaurantPanel(true)}
//                     style={{
//                         position: 'absolute',
//                         top: 'calc(60px + 10px)',
//                         left: '10px',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         padding: '8px 15px',
//                         borderRadius: '5px',
//                         border: 'none',
//                         cursor: 'pointer',
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//                         fontSize: '14px',
//                         zIndex: 95,
//                     }}
//                     title="패널 보기"
//                 >
//                     패널 보기
//                 </button>
//             )}

//             {/* 우측 현재 위치 정보 패널 (오버레이) */}
//             {showLocationPanel && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         top: '60px',
//                         right: RIGHT_OFFSET,
//                         width: LOCATION_PANEL_WIDTH,
//                         height: 'auto',
//                         backgroundColor: '#f8f8f8',
//                         zIndex: 90,
//                         boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         padding: '15px',
//                         borderRadius: '8px',
//                         transform: showLocationPanel ? 'translateX(0)' : `translateX(${LOCATION_PANEL_WIDTH})`,
//                         transition: 'transform 0.3s ease-out',
//                     }}
//                 >
//                     <button
//                         onClick={() => setShowLocationPanel(false)}
//                         style={{
//                             position: 'absolute',
//                             top: '20px',
//                             left: '20px',
//                             backgroundColor: '#fff',
//                             border: '1px solid #ddd',
//                             borderRadius: '50%',
//                             width: '30px',
//                             height: '30px',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             cursor: 'pointer',
//                             zIndex: 10,
//                             boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                         }}
//                         title="패널 닫기"
//                     >
//                         <FaTimes style={{ fontSize: '16px', color: '#555' }} />
//                     </button>

//                     {/* 나의 현재 위치 정보 */}
//                     <MyLocationComponent onLocationUpdate={handleLocationUpdate} />
//                     {currentUserCoords && (
//                         <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
//                             <p style={{ margin: '3px 0' }}>위도: {currentUserCoords.latitude.toFixed(6)}</p>
//                             <p style={{ margin: '3px 0' }}>경도: {currentUserCoords.longitude.toFixed(6)}</p>
//                             <p style={{ margin: '3px 0' }}>정확도: &plusmn;{currentUserCoords.accuracy.toFixed(2)}m</p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* 우측 패널 보이기 버튼 (패널이 숨겨져 있을 때만) */}
//             {!showLocationPanel && (
//                 <button
//                     onClick={() => setShowLocationPanel(true)}
//                     style={{
//                         position: 'absolute',
//                         top: '13vh',
//                         right: RIGHT_OFFSET,
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         padding: '8px 15px',
//                         borderRadius: '5px',
//                         border: 'none',
//                         cursor: 'pointer',
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//                         fontSize: '14px',
//                         zIndex: 95,
//                     }}
//                     title="위치 정보 보기"
//                 >
//                     위치 정보 보기
//                 </button>
//             )}

//             {/*'내 위치로 이동' 버튼 (오른쪽 하단)*/}
//             <button
//                 onClick={handleGoToMyLocation}
//                 style={{
//                     position: 'absolute',
//                     top: '85vh',
//                     right: `3vw`,
//                     zIndex: 10,
//                     backgroundColor: '#fff',
//                     border: '1px solid #ddd',
//                     borderRadius: '50%',
//                     width: '100px',
//                     height: '100px',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//                     cursor: currentUserCoords ? 'pointer' : 'not-allowed',
//                     opacity: currentUserCoords ? 1 : 0.5,
//                     padding: 0,
//                     transition: 'opacity 0.3s ease-in-out',
//                 }}
//                 disabled={currentUserCoords === null}
//                 title={currentUserCoords ? "내 위치로 이동" : "위치 정보 로딩 중..."}
//             >
//                 <FaCompass style={{ fontSize: '50px', color: '#007bff' }} />
//             </button>
//         </div>
//     );
// };

// export default HomePage;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCompass, FaChevronLeft, FaTimes } from 'react-icons/fa';
import MyLocationComponent from '../components/CurrentLocation';
import { ReactComponent as ProfileIcon } from '../assets/Vector.svg';

const RESTAURANT_PANEL_WIDTH_DESKTOP = '320px';
const LOCATION_PANEL_WIDTH_DESKTOP = '280px';
const RIGHT_OFFSET_DESKTOP = '10px';
const MOBILE_BREAKPOINT = 768;

const HomePage = () => {
    const navigate = useNavigate();
    const [mapInstance, setMapInstance] = useState(null);
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    const [showRestaurantPanel, setShowRestaurantPanel] = useState(true);
    const [showLocationPanel, setShowLocationPanel] = useState(true);
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMapType, setCurrentMapType] = useState('road');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다.');
        navigate('/');
    }, [navigate]);

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

    const createAndDisplayMarker = useCallback((place, map, index = null) => {
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
        window.kakao.maps.event.addListener(marker, 'click', function () {
            const detailPageLink = `/restaurant-detail/${place.id}`;
            const content = `
                <div style="padding:10px;font-size:13px;line-height:1.5;">
                    <strong style="font-size:15px;color:#007bff;">${place.place_name}</strong><br>
                    ${place.road_address_name ? `도로명: ${place.road_address_name}<br>` : ''}
                    ${place.phone ? `전화: ${place.phone}<br>` : ''}
                    ${place.category_name ? `분류: ${place.category_name.split('>').pop().trim()}<br>` : ''}
                    <a href="${detailPageLink}" style="color:#28a745;text-decoration:none;">상세보기</a>
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
                        const marker = createAndDisplayMarker(place, mapInstance, index + 1);
                        newMarkers.push(marker);
                        bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
                        newRestaurantList.push(place);
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
    }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker, isMobile]);

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
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

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
            searchAndDisplayRestaurants(userLatLng, 'myLocation');
            setShowRestaurantPanel(true);
        }
    }, [mapInstance, currentUserCoords, searchAndDisplayRestaurants, startBlinkingUserMarker]);

    const handleListItemClick = useCallback((placeId) => {
        const targetPlace = restaurantList.find(p => p.id === placeId);
        if (!targetPlace) return;
        const targetMarker = restaurantMarkersRef.current.find(marker => marker.getTitle() === targetPlace.place_name);
        if (targetMarker && mapInstance) {
            mapInstance.setCenter(targetMarker.getPosition());
            window.kakao.maps.event.trigger(targetMarker, 'click');
        } else if (mapInstance) {
            const position = new window.kakao.maps.LatLng(targetPlace.y, targetPlace.x);
            mapInstance.setCenter(position);
            const detailPageLink = `/restaurant-detail/${targetPlace.id}`;
            const content = `
                <div style="padding:10px;font-size:13px;line-height:1.5;">
                    <strong style="font-size:15px;color:#007bff;">${targetPlace.place_name}</strong><br>
                    ${targetPlace.road_address_name ? `도로명: ${targetPlace.road_address_name}<br>` : ''}
                    ${targetPlace.phone ? `전화: ${targetPlace.phone}<br>` : ''}
                    ${targetPlace.category_name ? `분류: ${targetPlace.category_name.split('>').pop().trim()}<br>` : ''}
                    <a href="${detailPageLink}" style="color:#28a745;text-decoration:none;">상세보기</a>
                </div>
            `;
            if (infoWindowRef.current) {
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(mapInstance, new window.kakao.maps.Marker({ position: position }));
            }
        }
    }, [mapInstance, restaurantList]);

    const mapWidth = isMobile ? '100vw' : (showRestaurantPanel ? `calc(100vw - ${RESTAURANT_PANEL_WIDTH_DESKTOP})` : '100vw');
    const mapLeft = isMobile ? '0' : (showRestaurantPanel ? RESTAURANT_PANEL_WIDTH_DESKTOP : '0');

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <nav style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '98vw',
                padding: isMobile ? '10px' : '10px 20px',
                borderBottom: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: isMobile ? 'flex-start' : 'space-between',
                alignItems: isMobile ? 'center' : 'center',
                height: isMobile ? 'auto' : '40px',
                gap: isMobile ? '10px' : '0',
                zIndex: 100
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                    <FaMapMarkerAlt style={{ fontSize: '24px', color: '#E74C3C' }} />
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' }}>
                        CRS
                    </span>
                </Link>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: '25px',
                    padding: '5px 15px',
                    border: '1px solid #ddd',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    width: isMobile ? '90%' : 'auto',
                    maxWidth: '400px'
                }}>
                    <input
                        type="text"
                        placeholder="식당 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleKeywordSearch();
                            }
                        }}
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '15px',
                            padding: '5px 0',
                            width: '100%',
                            marginRight: '10px'
                        }}
                    />
                    <FaSearch
                        onClick={handleKeywordSearch}
                        style={{ color: '#007bff', cursor: 'pointer' }}
                    />
                </div>
                {isLoggedIn ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '8px 15px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            로그아웃
                        </button>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', cursor: 'default', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ProfileIcon style={{ width: '80%', height: '100%' }} />
                        </div>
                    </div>
                ) : (
                    <Link to="/login" style={{ textDecoration: 'none', backgroundColor: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
                        로그인
                    </Link>
                )}
            </nav>

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

            <div style={{
                position: 'absolute',
                top: isMobile ? '130px' : '70px',
                right: '10px',
                zIndex: 10,
                display: 'flex',
                gap: '5px',
            }}>
                <button
                    onClick={handleRoadmapClick}
                    style={{
                        backgroundColor: currentMapType === 'road' ? '#007bff' : 'rgba(255, 255, 255, 0.9)',
                        color: currentMapType === 'road' ? 'white' : '#333',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    title="일반 지도로 전환"
                >
                    일반지도
                </button>
                <button
                    onClick={handleSkyviewClick}
                    style={{
                        backgroundColor: currentMapType === 'sky' ? '#007bff' : 'rgba(255, 255, 255, 0.9)',
                        color: currentMapType === 'sky' ? 'white' : '#333',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    title="스카이뷰로 전환"
                >
                    스카이뷰
                </button>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '5vh',
                right: '0.5vw',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '5px',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
                <button
                    onClick={handleZoomIn}
                    style={{ width: '36px', height: '36px', border: 'none', borderBottom: '1px solid #ccc', backgroundColor: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#555', cursor: 'pointer', padding: 0 }}
                    title="확대"
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    style={{ width: '36px', height: '36px', border: 'none', backgroundColor: 'transparent', fontSize: '24px', fontWeight: 'bold', color: '#555', cursor: 'pointer', padding: 0 }}
                    title="축소"
                >
                    -
                </button>
            </div>

            {showRestaurantPanel && (
                <div
                    style={{
                        position: 'absolute',
                        top: isMobile ? '0' : '60px',
                        left: isMobile ? '0' : '0',
                        width: isMobile ? '100vw' : RESTAURANT_PANEL_WIDTH_DESKTOP,
                        height: isMobile ? '100vh' : 'calc(100vh - 60px)',
                        backgroundColor: '#f8f8f8',
                        zIndex: 90,
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: showRestaurantPanel ? 'translateX(0)' : `translateX(-100%)`,
                        transition: 'transform 0.3s ease-out',
                        paddingTop: isMobile ? '60px' : '0',
                    }}
                >
                    <button
                        onClick={() => setShowRestaurantPanel(false)}
                        style={{
                            position: 'absolute',
                            top: isMobile ? '20px' : '1vh',
                            right: isMobile ? '20px' : '1vw',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        title="패널 숨기기"
                    >
                        <FaChevronLeft style={{ fontSize: '16px', color: '#555' }} />
                    </button>

                    <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
                        <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
                            검색 결과 ({restaurantList.length}개)
                        </h3>
                        {restaurantList.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {restaurantList.map((place, index) => (
                                    <li
                                        key={place.id}
                                        onClick={() => handleListItemClick(place.id)}
                                        style={{
                                            padding: '12px 10px',
                                            borderBottom: '1px solid #eee',
                                            cursor: 'pointer',
                                            backgroundColor: (index % 2 === 0) ? '#fff' : '#fefefe',
                                            borderRadius: '5px',
                                            marginBottom: '8px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = (index % 2 === 0) ? '#fff' : '#fefefe'}
                                    >
                                        <strong style={{ color: '#007bff', fontSize: '16px' }}>{index + 1}. {place.place_name}</strong><br />
                                        <span style={{ fontSize: '13px', color: '#555' }}>
                                            {place.road_address_name || place.address_name}
                                        </span><br />
                                        {place.phone && <span style={{ fontSize: '12px', color: '#777' }}>📞 {place.phone}</span>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>
                                검색된 식당이 없습니다.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!showRestaurantPanel && (
                <button
                    onClick={() => setShowRestaurantPanel(true)}
                    style={{
                        position: 'absolute',
                        top: isMobile ? '130px' : 'calc(60px + 10px)',
                        left: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                        zIndex: 95,
                    }}
                    title="패널 보기"
                >
                    패널 보기
                </button>
            )}

            {showLocationPanel && (
                <div
                    style={{
                        position: 'absolute',
                        top: isMobile ? '0' : '60px',
                        right: isMobile ? '0' : '0vw',
                        width: isMobile ? '100vw' : LOCATION_PANEL_WIDTH_DESKTOP,
                        height: isMobile ? '100vh' : 'auto',
                        backgroundColor: '#f8f8f8',
                        zIndex: 90,
                        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '15px',
                        borderRadius: isMobile ? '0' : '8px',
                        transform: showLocationPanel ? 'translateX(0)' : `translateX(100%)`,
                        paddingTop: isMobile ? '60px' : '15px',
                    }}
                >
                    <button
                        onClick={() => setShowLocationPanel(false)}
                        style={{
                            position: 'absolute',
                            top: isMobile ? '20px' : '20px',
                            left: isMobile ? '20px' : '20px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        title="패널 닫기"
                    >
                        <FaTimes style={{ fontSize: '16px', color: '#555' }} />
                    </button>
                    <MyLocationComponent onLocationUpdate={handleLocationUpdate} />
                    {currentUserCoords && (
                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
                            <p style={{ margin: '3px 0' }}>위도: {currentUserCoords.latitude.toFixed(6)}</p>
                            <p style={{ margin: '3px 0' }}>경도: {currentUserCoords.longitude.toFixed(6)}</p>
                            <p style={{ margin: '3px 0' }}>정확도: &plusmn;{currentUserCoords.accuracy.toFixed(2)}m</p>
                        </div>
                    )}
                </div>
            )}

            {!showLocationPanel && (
                <button
                    onClick={() => setShowLocationPanel(true)}
                    style={{
                        position: 'absolute',
                        top: isMobile ? '170px' : '13vh',
                        right: RIGHT_OFFSET_DESKTOP,
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                        zIndex: 95,
                    }}
                    title="위치 정보 보기"
                >
                    위치 정보 보기
                </button>
            )}

            <button
                onClick={handleGoToMyLocation}
                style={{
                    position: 'absolute',
                    top:'85vh',
                    right: '3vw',
                    zIndex: 10,
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    cursor: currentUserCoords ? 'pointer' : 'not-allowed',
                    opacity: currentUserCoords ? 1 : 0.5,
                    padding: 0,
                    transition: 'opacity 0.3s ease-in-out',
                }}
                disabled={currentUserCoords === null}
                title={currentUserCoords ? "내 위치로 이동" : "위치 정보 로딩 중..."}
            >
                <FaCompass style={{ fontSize: '40px', color: '#007bff' }} />
            </button>
        </div>
    );
};

export default HomePage;



