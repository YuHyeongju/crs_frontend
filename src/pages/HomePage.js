// src/pages/HomePage.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCompass, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

import MyLocationComponent from '../components/CurrentLocation';

const RESTAURANT_CATEGORY_CODE = 'FD6'; // 음식점 카테고리 코드
const RESTAURANT_PANEL_WIDTH = '320px'; // 좌측 식당 패널 너비
const LOCATION_PANEL_WIDTH = '280px'; // 우측 위치 정보 패널 너비
const RIGHT_OFFSET = '10px'; // 우측 요소들의 기본 오른쪽 여백

const HomePage = () => {
    // 지도 인스턴스 state
    const [mapInstance, setMapInstance] = useState(null);
    // 사용자 현재 위치 상태
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    // 좌측 식당 목록 패널 표시 여부 상태
    const [showRestaurantPanel, setShowRestaurantPanel] = useState(false); // 초기값을 false로 설정
    // 우측 현재 위치 정보 패널 표시 여부 상태
    const [showLocationPanel, setShowLocationPanel] = useState(false); // 초기값을 false로 설정
    // 검색된 식당 목록 상태
    const [restaurantList, setRestaurantList] = useState([]);
    // 검색어 상태
    const [searchTerm, setSearchTerm] = useState('');


    // 지도 컨테이너 ref
    const mapContainerRef = useRef(null);
    // 클릭된 마커를 추적하기 위한 ref (지도 클릭 시 생성되는 마커)
    const clickedMarkerRef = useRef(null);
    // 사용자 현재 위치 마커를 추적하기 위한 ref
    const userLocationMarkerRef = useRef(null);
    // 지도에 그려진 식당 마커들을 관리하기 위한 ref (마커 객체 배열)
    const restaurantMarkersRef = useRef([]); // 식당 마커들을 관리하기 위한 useRef
    // 인포윈도우를 추적하기 위한 ref
    const infoWindowRef = useRef(null);

    // userMarkerImage 객체를 저장할 useRef
    const userMarkerImageRef = useRef(null);
    // 사용자 위치 마커 깜빡임 간격 ID를 저장할 useRef
    const userLocationBlinkIntervalRef = useRef(null);

    // 초기 로딩 시 사용자 위치로 지도를 한 번만 이동시키기 위한 플래그
    const [initialLocationSet, setInitialLocationSet] = useState(false);
    // 초기 식당 정보를 한 번만 로딩하기 위한 플래그
    const [initialRestaurantsLoaded, setInitialRestaurantsLoaded] = useState(false);

    // MyLocationComponent에서 위치 정보를 업데이트 받을 콜백
    const handleLocationUpdate = useCallback((coords) => {
        setCurrentUserCoords(coords);
    }, []);

    // 모든 식당 마커를 지도에서 제거하는 함수
    const removeRestaurantMarkers = useCallback(() => {
        console.log("HomePage: removeRestaurantMarkers 실행.");
        for (let i = 0; i < restaurantMarkersRef.current.length; i++) {
            restaurantMarkersRef.current[i].setMap(null);
        }
        restaurantMarkersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    }, []);

    // 사용자 마커 깜빡임 관련 함수
    const startBlinkingUserMarker = useCallback(() => {
        if (userLocationMarkerRef.current && mapInstance) {
            stopBlinkingUserMarker(); // 이미 깜빡이는 중이라면 기존 인터벌을 제거합니다.

            let isVisible = true;
            userLocationBlinkIntervalRef.current = setInterval(() => {
                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setMap(isVisible ? mapInstance : null);
                    isVisible = !isVisible;
                } else {
                    stopBlinkingUserMarker(); // 마커가 없으면 인터벌을 멈춥니다.
                }
            }, 500); // 500ms(0.5초) 간격으로 깜빡입니다. 조절 가능.
            console.log("HomePage: 사용자 마커 깜빡임 시작.");
        }
    }, [mapInstance]);

    const stopBlinkingUserMarker = useCallback(() => {
        if (userLocationBlinkIntervalRef.current) {
            clearInterval(userLocationBlinkIntervalRef.current);
            userLocationBlinkIntervalRef.current = null;
            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setMap(mapInstance); // 멈출 때 항상 보이게 설정
            }
            console.log("HomePage: 사용자 마커 깜빡임 중지.");
        }
    }, [mapInstance]);

    // 공통 마커 생성 및 인포윈도우 설정 로직
    const createAndDisplayMarker = useCallback((place, map, index = null) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);

        let markerImage = null;
        if (index !== null) {
            // 번호가 있는 식당 마커 이미지 생성 (핀 모양 SVG)
            const markerSvg = `
                <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Pin body (teardrop shape) -->
                    <path d="M15 0C6.71573 0 0 6.71573 0 15C0 25 15 40 15 40C15 40 30 25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#007bff"/>
                    <!-- Circle for number -->
                    <circle cx="15" cy="15" r="10" fill="white"/>
                    <!-- Text for number -->
                    <text x="15" y="15" font-family="Arial" font-size="12" font-weight="bold" fill="#007bff" text-anchor="middle" alignment-baseline="middle">${index}</text>
                </svg>
            `;
            const markerDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`;
            markerImage = new window.kakao.maps.MarkerImage(
                markerDataUrl,
                new window.kakao.maps.Size(30, 40), // SVG 크기에 맞춰 조정
                { offset: new window.kakao.maps.Point(15, 40) } // 핀의 아래쪽 중앙이 좌표에 오도록 조정
            );
        }

        const marker = new window.kakao.maps.Marker({
            map: map,
            position: position,
            title: place.place_name,
            image: markerImage // 커스텀 마커 이미지 적용
        });

        window.kakao.maps.event.addListener(marker, 'click', function() {
            console.log(`마커 클릭: ${place.place_name}`);
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
    }, [mapInstance]);

    // 식당 검색 및 마커 표시 함수 (초기 로딩, 클릭, 내 위치 이동 모두 사용)
    const searchAndDisplayRestaurants = useCallback((centerLatLng, searchType = 'initial') => {
        console.log(`HomePage: ${searchType} 식당 검색 실행. 중심:`, centerLatLng);

        if (!mapInstance || !window.kakao || !window.kakao.maps.services) {
            console.log("HomePage: 지도 인스턴스 또는 카카오 서비스 미준비. 식당 로드 불가.");
            return;
        }

        removeRestaurantMarkers(); // 기존 식당 마커 제거

        const ps = new window.kakao.maps.services.Places();

        ps.categorySearch(RESTAURANT_CATEGORY_CODE, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                console.log(`HomePage: ${searchType} 카테고리 검색 결과 수신 성공.`, data);

                const bounds = new window.kakao.maps.LatLngBounds();
                const newMarkers = [];
                const newRestaurantList = []; // 목록에 표시할 데이터

                data.forEach((place, index) => {
                    if (place.category_group_code === RESTAURANT_CATEGORY_CODE) {
                        const marker = createAndDisplayMarker(place, mapInstance, index + 1);
                        newMarkers.push(marker);
                        bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
                        newRestaurantList.push(place); // 식당 데이터 목록에 추가
                    }
                });

                restaurantMarkersRef.current = newMarkers;
                setRestaurantList(newRestaurantList); // 식당 목록 상태 업데이트

                console.log(`HomePage: ${searchType} 필터링 후 그려질 식당 마커 수:`, newMarkers.length);

                if (newMarkers.length > 0) {
                    mapInstance.setBounds(bounds);
                    // ⭐ 변경: 검색 성공 시 식당 패널 자동 열림 로직 제거
                    // if (!showRestaurantPanel) {
                    //     setShowRestaurantPanel(true);
                    //     console.log("HomePage: 식당 패널 자동 열림.");
                    // }
                } else {
                    alert(`주변에 검색된 음식점이 없습니다.`);
                }

                if (searchType === 'initial') {
                    setInitialRestaurantsLoaded(true);
                }

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert(`주변에 검색된 음식점이 없습니다.`);
                setRestaurantList([]); // 결과 없으면 목록 비움
                if (searchType === 'initial') {
                    setInitialRestaurantsLoaded(true);
                }
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert(`${searchType} 식당 로딩 중 오류가 발생했습니다.`);
                setRestaurantList([]); // 오류 발생 시 목록 비움
                if (searchType === 'initial') {
                    setInitialRestaurantsLoaded(true);
                }
            }
        }, {
            location: centerLatLng,
            radius: 20000 // 반경 20km가 최대
        });
    }, [mapInstance, removeRestaurantMarkers, createAndDisplayMarker]); // showRestaurantPanel 의존성 제거

    // 키워드 검색 함수
    const handleKeywordSearch = useCallback(() => {
        console.log(`HomePage: 키워드 검색 실행. 검색어: "${searchTerm}"`);

        if (!mapInstance || !window.kakao || !window.kakao.maps.services) {
            console.log("HomePage: 지도 인스턴스 또는 카카오 서비스 미준비. 검색 불가.");
            return;
        }
        if (searchTerm.trim() === '') {
            alert("검색어를 입력해주세요.");
            return;
        }

        removeRestaurantMarkers(); // 기존 식당 마커 제거
        setRestaurantList([]); // 새 검색 시작 시 목록 비움

        // 사용자 위치 마커가 있다면 숨기고 깜빡임 중지
        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
            stopBlinkingUserMarker();
        }
        // 클릭 마커가 있다면 제거
        if (clickedMarkerRef.current) {
            clickedMarkerRef.current.setMap(null);
            clickedMarkerRef.current = null;
        }

        const ps = new window.kakao.maps.services.Places();
        const mapCenter = mapInstance.getCenter(); // 현재 지도의 중심을 기준으로 검색

        ps.keywordSearch(searchTerm, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                console.log("HomePage: 키워드 검색 결과 수신 성공.", data);

                const bounds = new window.kakao.maps.LatLngBounds();
                const newMarkers = [];
                const newRestaurantList = []; // 목록에 표시할 데이터

                data.forEach((place, index) => {
                    // 키워드 검색은 모든 카테고리를 반환할 수 있으므로, 식당만 필터링
                    if (place.category_group_code === RESTAURANT_CATEGORY_CODE) {
                        const marker = createAndDisplayMarker(place, mapInstance, index + 1);
                        newMarkers.push(marker);
                        bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
                        newRestaurantList.push(place); // 식당 데이터 목록에 추가
                    }
                });

                restaurantMarkersRef.current = newMarkers;
                setRestaurantList(newRestaurantList); // 식당 목록 상태 업데이트

                console.log(`HomePage: 키워드 검색 후 그려질 식당 마커 수:`, newMarkers.length);

                if (newMarkers.length > 0) {
                    mapInstance.setBounds(bounds);
                    // ⭐ 변경: 검색 성공 시 식당 패널 자동 열림 로직 제거
                    // if (!showRestaurantPanel) {
                    //     setShowRestaurantPanel(true);
                    //     console.log("HomePage: 식당 패널 자동 열림.");
                    // }
                } else {
                    alert(`"${searchTerm}"(으)로 검색된 음식점이 없습니다.`);
                }

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert(`"${searchTerm}"(으)로 검색된 음식점이 없습니다.`);
                setRestaurantList([]); // 결과 없으면 목록 비움
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert(`키워드 검색 중 오류가 발생했습니다.`);
                setRestaurantList([]); // 오류 발생 시 목록 비움
            }
        }, {
            location: mapCenter, // 현재 지도의 중심을 기준으로 검색
            radius: 20000 // 최대 반경 20km
        });
    }, [mapInstance, searchTerm, removeRestaurantMarkers, userLocationMarkerRef, stopBlinkingUserMarker, createAndDisplayMarker]); // showRestaurantPanel 의존성 제거


    // 1. 지도 초기화 및 기본 컨트롤 추가
    useEffect(() => {
        console.log("HomePage: 지도 초기화 useEffect 실행.");
        if (mapContainerRef.current && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                console.log("HomePage: 카카오 맵 SDK 로드 완료.");

                const mapContainer = mapContainerRef.current;
                const mapOption = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3
                };

                const map = new window.kakao.maps.Map(mapContainer, mapOption);
                setMapInstance(map);
                console.log("HomePage: 지도 인스턴스 초기화 완료!", map);

                // 기본 지도 타입 컨트롤 다시 추가 (우측 상단)
                if (!map.__mapTypeControlAdded) {
                    const mapTypeControl = new window.kakao.maps.MapTypeControl();
                    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
                    map.__mapTypeControlAdded = true;
                    console.log("HomePage: 지도 타입 컨트롤 추가 완료.");
                }
                // 기본 줌 컨트롤 다시 추가 (우측 하단)
                if (!map.__zoomControlAdded) {
                    const zoomControl = new window.kakao.maps.ZoomControl();
                    map.addControl(zoomControl, window.kakao.maps.ControlPosition.BOTTOMRIGHT);
                    map.__zoomControlAdded = true;
                    console.log("HomePage: 줌 컨트롤 추가 완료.");
                }

                if (!infoWindowRef.current) {
                    infoWindowRef.current = new window.kakao.maps.InfoWindow({ removable: true });
                    console.log("HomePage: 인포윈도우 인스턴스 초기화 완료.");
                }

                // userMarkerImage를 여기서 정의
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
                console.log("HomePage: 사용자 마커 이미지 정의 완료.");

            });
        } else {
            console.log("HomePage: 지도 컨테이너 또는 카카오 객체 미준비.", { mapContainerRef: mapContainerRef.current, kakao: window.kakao });
        }
    }, []);

    // 2. 사용자 위치 마커 표시 및 지도 중심 이동, 초기 식당 로드
    useEffect(() => {
        console.log("HomePage: 사용자 위치 및 초기 로드 useEffect 실행.");
        if (mapInstance && currentUserCoords && userMarkerImageRef.current && !initialLocationSet) {
            const { latitude, longitude } = currentUserCoords;
            const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
            }
            removeRestaurantMarkers();

            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setPosition(userLatLng);
                userLocationMarkerRef.current.setImage(userMarkerImageRef.current);
            } else {
                const marker = new window.kakao.maps.Marker({
                    map: mapInstance,
                    position: userLatLng,
                    image: userMarkerImageRef.current,
                });
                userLocationMarkerRef.current = marker;
                console.log("HomePage: 새 사용자 마커 생성 성공:", marker);
            }

            mapInstance.setCenter(userLatLng);
            console.log("HomePage: 지도에 사용자 위치 마커 표시 및 중심 이동 완료.");
            setInitialLocationSet(true);

            startBlinkingUserMarker(); // 사용자 마커 깜빡임 시작

            if (!initialRestaurantsLoaded) {
                searchAndDisplayRestaurants(userLatLng, 'initial');
            }
            // ⭐ 변경: 초기 위치 정보 로드 시 위치 정보 패널 자동 열림 로직 제거
            // setShowLocationPanel(true);

        } else if (mapInstance && currentUserCoords && userMarkerImageRef.current && initialLocationSet) {
            const { latitude, longitude } = currentUserCoords;
            const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

            if (!clickedMarkerRef.current) {
                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setPosition(userLatLng);
                    userLocationMarkerRef.current.setMap(mapInstance);
                    userLocationMarkerRef.current.setImage(userMarkerImageRef.current);
                    startBlinkingUserMarker(); // 사용자 마커가 이미 있다면 깜빡임 유지
                } else {
                    const marker = new window.kakao.maps.Marker({
                        map: mapInstance,
                        position: userLatLng,
                        image: userMarkerImageRef.current,
                    });
                    userLocationMarkerRef.current = marker;
                    startBlinkingUserMarker(); // 새로 생성된 경우 깜빡임 시작
                }
            } else {
                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setMap(null);
                    stopBlinkingUserMarker(); // 클릭 마커가 있다면 사용자 마커는 숨기고 깜빡임 중지
                }
            }
        } else if (mapInstance && !currentUserCoords && userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
            userLocationMarkerRef.current = null;
            stopBlinkingUserMarker(); // 사용자 마커가 사라지면 깜빡임 중지
            console.log("HomePage: 위치 정보 미준비로 기존 사용자 마커 제거됨.");
        }
        return () => {
            stopBlinkingUserMarker();
        };
    }, [mapInstance, currentUserCoords, initialLocationSet, initialRestaurantsLoaded, searchAndDisplayRestaurants, removeRestaurantMarkers, startBlinkingUserMarker, stopBlinkingUserMarker]); // setShowLocationPanel 의존성 제거

    // 3. 지도 클릭 이벤트 리스너 추가
    useEffect(() => {
        let clickHandler;
        if (mapInstance) {
            clickHandler = function(mouseEvent) {
                const latlng = mouseEvent.latLng;
                console.log(`지도 클릭: 위도 ${latlng.getLat()}, 경도 ${latlng.getLng()}`);

                if (clickedMarkerRef.current) {
                    clickedMarkerRef.current.setMap(null);
                }

                if (userLocationMarkerRef.current) {
                    userLocationMarkerRef.current.setMap(null);
                    stopBlinkingUserMarker(); // 지도 클릭 시 사용자 마커 숨기고 깜빡임 중지
                }

                const newClickedMarker = new window.kakao.maps.Marker({
                    position: latlng,
                    map: mapInstance
                });
                clickedMarkerRef.current = newClickedMarker;

                searchAndDisplayRestaurants(latlng, 'click');
            };

            window.kakao.maps.event.addListener(mapInstance, 'click', clickHandler);
        }

        return () => {
            if (mapInstance && clickHandler) {
                window.kakao.maps.event.removeListener(mapInstance, 'click', clickHandler);
                console.log("HomePage: 지도 클릭 이벤트 리스너 제거.");
            }
        };
    }, [mapInstance, searchAndDisplayRestaurants, stopBlinkingUserMarker]);

    // '내 위치로 이동' 버튼 클릭 핸들러
    const handleGoToMyLocation = useCallback(() => {
        console.log("내 위치로 이동 버튼 클릭됨.");
        // currentUserCoords가 없으면 경고 메시지 표시
        if (!currentUserCoords) {
            alert("위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
            console.log("HomePage: 사용자 위치 정보가 없어 이동할 수 없습니다.");
            return;
        }

        if (mapInstance && userMarkerImageRef.current) { // currentUserCoords는 위에서 이미 체크됨
            const { latitude, longitude } = currentUserCoords;
            const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
            }

            mapInstance.setCenter(userLatLng);
            console.log("HomePage: 지도 중심을 사용자 위치로 이동.");

            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setPosition(userLatLng);
                userLocationMarkerRef.current.setMap(mapInstance);
                userLocationMarkerRef.current.setImage(userMarkerImageRef.current);
                console.log("HomePage: 기존 사용자 마커 위치 업데이트 및 다시 표시됨.");
            } else {
                const marker = new window.kakao.maps.Marker({
                    map: mapInstance,
                    position: userLatLng,
                    image: userMarkerImageRef.current,
                });
                userLocationMarkerRef.current = marker;
                console.log("HomePage: 새 사용자 마커 생성 및 표시됨.");
            }

            startBlinkingUserMarker(); // '내 위치로 이동' 시에도 깜빡임 시작

            searchAndDisplayRestaurants(userLatLng, 'myLocation');

        } else {
            // 이 else 블록은 mapInstance 또는 userMarkerImageRef.current가 null일 때만 실행됩니다.
            // 이 경우도 사용자에게는 "위치 정보를 가져오는 중입니다" 메시지가 더 적절합니다.
            alert("지도 초기화 중입니다. 잠시 후 다시 시도해주세요.");
            console.log("HomePage: 지도 인스턴스 또는 사용자 마커 이미지가 없어 이동할 수 없습니다.");
        }
    }, [mapInstance, currentUserCoords, searchAndDisplayRestaurants, startBlinkingUserMarker]);

    // 사이드 패널 목록 항목 클릭 핸들러
    const handleListItemClick = useCallback((placeId) => {
        const targetPlace = restaurantList.find(p => p.id === placeId);
        if (!targetPlace) return;

        // 마커를 찾아서 클릭 이벤트 트리거
        const targetMarker = restaurantMarkersRef.current.find(marker => marker.getTitle() === targetPlace.place_name);
        if (targetMarker && mapInstance) {
            mapInstance.setCenter(targetMarker.getPosition());
            window.kakao.maps.event.trigger(targetMarker, 'click');
        } else {
            // 마커가 아직 생성되지 않았거나 찾을 수 없는 경우, 직접 인포윈도우 열기
            const position = new window.kakao.maps.LatLng(targetPlace.y, targetPlace.x);
            mapInstance.setCenter(position); // 지도를 해당 위치로 이동

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
                infoWindowRef.current.open(mapInstance, new window.kakao.maps.Marker({ position: position })); // 임시 마커로 인포윈도우 열기
            } else {
                infoWindowRef.current = new window.kakao.maps.InfoWindow({
                    content: content,
                    removable: true
                });
                infoWindowRef.current.open(mapInstance, new window.kakao.maps.Marker({ position: position }));
            }
        }
    }, [mapInstance, restaurantList]);


    // 지도 width 및 left/right 계산 (이제 패널이 오버레이이므로 지도 크기는 항상 100%)
    const mapWidth = '100%';
    const mapLeft = '0px';


    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden'
            }}
        >
            {/* --- 상단 헤더: 로고, 검색창, 로그인 버튼 --- */}
            <nav style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '98.5vw',
                padding: '10px 20px',
                borderBottom: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '40px',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt style={{ fontSize: '24px', color: '#E74C3C' }} />
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' }}>CRS</span>
                </div>

                {/* 검색 input과 버튼 */}
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '25px', padding: '5px 15px', border: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <input
                        type="text"
                        placeholder="식당 검색..."
                        value={searchTerm} // 검색어 상태와 연결
                        onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
                        onKeyPress={(e) => { // Enter 키 입력 시 검색
                            if (e.key === 'Enter') {
                                handleKeywordSearch();
                            }
                        }}
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '15px',
                            padding: '5px 0',
                            width: '200px',
                            marginRight: '10px'
                        }}
                    />
                    <FaSearch
                        style={{ color: '#007bff', cursor: 'pointer' }}
                        onClick={handleKeywordSearch} // 검색 버튼 클릭 시 검색
                    />
                </div>

                <Link to="/login" style={{
                    textDecoration: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}>
                    로그인
                </Link>
            </nav>

            {/* --- 지도 --- */}
            <div
                id="map"
                ref={mapContainerRef}
                style={{
                    width: mapWidth, // 항상 100%
                    height: 'calc(100vh - 60px)',
                    backgroundColor: 'lightgray',
                    marginTop: '60px',
                    left: mapLeft, // 항상 0px
                    position: 'absolute',
                    transition: 'none',
                }}
            >
                지도 로딩 중...
            </div>

            {/* 좌측 식당 목록 패널 (오버레이) */}
            {showRestaurantPanel && (
                <div
                    style={{
                        position: 'absolute',
                        top: '60px', // 헤더 아래
                        left: 0,
                        width: RESTAURANT_PANEL_WIDTH,
                        height: 'calc(100vh - 60px)', // 헤더 높이만큼 제외
                        backgroundColor: '#f8f8f8',
                        zIndex: 90,
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: showRestaurantPanel ? 'translateX(0)' : `translateX(-${RESTAURANT_PANEL_WIDTH})`,
                        transition: 'transform 0.3s ease-out',
                    }}
                >
                    {/* 패널 숨기기 버튼 (패널 내부에 있을 때) */}
                    <button
                        onClick={() => setShowRestaurantPanel(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px', // 우측 상단으로 이동
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

                    {/* 식당 목록 */}
                    <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
                        <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
                            검색 결과 ({restaurantList.length}개)
                        </h3>
                        {restaurantList.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {restaurantList.map((place, index) => (
                                    <li
                                        key={place.id}
                                        onClick={() => handleListItemClick(place.id)} // 목록 항목 클릭 시 지도 이동/인포윈도우 열기
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

            {/* 좌측 패널 보이기 버튼 (패널이 숨겨져 있을 때만) */}
            {!showRestaurantPanel && (
                <button
                    onClick={() => setShowRestaurantPanel(true)}
                    style={{
                        position: 'absolute',
                        top: 'calc(60px + 10px)', // 헤더 아래, 패널이 있던 자리 근처
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
                    title="패널 보이기"
                >
                    <FaChevronRight style={{ fontSize: '16px', marginRight: '5px' }} /> 패널 보기
                </button>
            )}

            {/* 우측 현재 위치 정보 패널 (오버레이) */}
            {showLocationPanel && (
                <div
                    style={{
                        position: 'absolute',
                        top: '60px', // 헤더 아래
                        right: RIGHT_OFFSET, // 우측에 고정
                        width: LOCATION_PANEL_WIDTH,
                        height: 'auto', // 내용에 따라 높이 조절
                        backgroundColor: '#f8f8f8',
                        zIndex: 90,
                        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '15px',
                        borderRadius: '8px',
                        transform: showLocationPanel ? 'translateX(0)' : `translateX(${LOCATION_PANEL_WIDTH})`,
                        transition: 'transform 0.3s ease-out',
                    }}
                >
                    {/* 패널 닫기 버튼 아이콘을 FaTimes (X)로 변경 */}
                    <button
                        onClick={() => setShowLocationPanel(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px', // 좌측 상단으로 이동
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

                    {/* 나의 현재 위치 정보 */}
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

            {/* 우측 패널 보이기 버튼 (패널이 숨겨져 있을 때만) - 화살표 제거 */}
            {!showLocationPanel && (
                <button
                    onClick={() => setShowLocationPanel(true)}
                    style={{
                        position: 'absolute',
                        top: 'calc(60px + 10px + 30px + 10px)', // 헤더 + 기본 지도 타입 컨트롤 + 간격 아래
                        right: RIGHT_OFFSET,
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


            {/*'내 위치로 이동' 버튼 (오른쪽 하단)*/}
            <button
                onClick={handleGoToMyLocation}
                style={{
                    position: 'absolute',
                    top: 'calc(60px + 80vh)', // 기존 위치 유지
                    right: `calc(${RIGHT_OFFSET} + 1.5vw + 40px)`, // 오른쪽으로 더 이동 (기존 줌 컨트롤 너비 + 여백)
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
                    cursor: currentUserCoords ? 'pointer' : 'not-allowed', // ⭐ 변경: 위치 정보 로드 여부에 따라 커서 변경
                    opacity: currentUserCoords ? 1 : 0.5, // ⭐ 변경: 위치 정보 로드 여부에 따라 투명도 변경
                    padding: 0,
                    transition: 'opacity 0.3s ease-in-out', // ⭐ 변경: 투명도 전환 효과 추가
                }}
                disabled={currentUserCoords === null} // ⭐ 변경: 위치 정보 로드 전까지 버튼 비활성화
                title={currentUserCoords ? "내 위치로 이동" : "위치 정보 로딩 중..."} // ⭐ 변경: 툴팁 메시지 변경
            >
                <FaCompass style={{ fontSize: '50px', color: '#007bff' }} />
            </button>

        </div>
    );
};

export default HomePage;
