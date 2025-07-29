// src/pages/HomePage.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';

import MyLocationComponent from '../components/CurrentLocation';

const RESTAURANT_CATEGORY_CODE = 'FD6'; // 음식점 카테고리 코드

const HomePage = () => {
    // 지도 인스턴스 state
    const [mapInstance, setMapInstance] = useState(null);
    // 사용자 현재 위치 상태
    const [currentUserCoords, setCurrentUserCoords] = useState(null);
    // ⭐ 위치 정보 창 표시 여부 상태
    const [showLocationInfo, setShowLocationInfo] = useState(true);

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

                data.forEach(place => {
                    if (place.category_group_code === RESTAURANT_CATEGORY_CODE) {
                        const position = new window.kakao.maps.LatLng(place.y, place.x);
                        const marker = new window.kakao.maps.Marker({
                            map: mapInstance,
                            position: position,
                            title: place.place_name,
                        });

                        window.kakao.maps.event.addListener(marker, 'click', function() {
                            console.log(`마커 클릭: ${place.place_name}`);
                            // 내부 페이지로 이동할 링크를 포함합니다.
                            // 예시: /restaurant-detail/12345 (여기서 12345는 place.id)
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
                                infoWindowRef.current.open(mapInstance, marker);
                            } else {
                                infoWindowRef.current = new window.kakao.maps.InfoWindow({
                                    content: content,
                                    removable: true
                                });
                                infoWindowRef.current.open(mapInstance, marker);
                            }
                        });
                        newMarkers.push(marker);
                        bounds.extend(position);
                    }
                });

                restaurantMarkersRef.current = newMarkers;

                console.log(`HomePage: ${searchType} 필터링 후 그려질 식당 마커 수:`, newMarkers.length);

                if (newMarkers.length > 0) {
                    mapInstance.setBounds(bounds);
                } else {
                    alert(`주변에 검색된 음식점이 없습니다.`);
                }

                if (searchType === 'initial') {
                    setInitialRestaurantsLoaded(true);
                }

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert(`주변에 검색된 음식점이 없습니다.`);
                if (searchType === 'initial') {
                    setInitialRestaurantsLoaded(true);
                }
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert(`${searchType} 식당 로딩 중 오류가 발생했습니다.`);
                if (searchType === 'initial') {
                    setInitialRestaurantsLoaded(true);
                }
            }
        }, {
            location: centerLatLng,
            radius: 20000 // 반경 20km가 최대
        });
    }, [mapInstance, removeRestaurantMarkers]);

    // 1. 지도 초기화 및 기본 컨트롤 추가 (userMarkerImage 정의 위치 변경)
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

                if (!map.__mapTypeControlAdded) {
                    const mapTypeControl = new window.kakao.maps.MapTypeControl();
                    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
                    map.__mapTypeControlAdded = true;
                    console.log("HomePage: 지도 타입 컨트롤 추가 완료.");
                }

                if (!map.__zoomControlAdded) {
                    const zoomControl = new window.kakao.maps.ZoomControl();
                    map.addControl(zoomControl, window.kakao.maps.ControlPosition.BOTTOMLEFT);
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
    }, [mapInstance, currentUserCoords, initialLocationSet, initialRestaurantsLoaded, searchAndDisplayRestaurants, removeRestaurantMarkers, startBlinkingUserMarker, stopBlinkingUserMarker]);

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
        if (mapInstance && currentUserCoords && userMarkerImageRef.current) {
            const { latitude, longitude } = currentUserCoords;
            const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
                console.log("HomePage: '내 위치로 이동' 버튼 클릭으로 클릭 마커 제거됨.");
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
            console.log("HomePage: 지도 인스턴스 또는 사용자 위치 정보가 없어 이동할 수 없습니다.");
            alert("현재 위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        }
    }, [mapInstance, currentUserCoords, searchAndDisplayRestaurants, startBlinkingUserMarker]);


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

                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '25px', padding: '5px 15px', border: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <input
                        type="text"
                        placeholder="식당 검색..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '15px',
                            padding: '5px 0',
                            width: '200px',
                            marginRight: '10px'
                        }}
                    />
                    <FaSearch style={{ color: '#007bff', cursor: 'pointer' }} />
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

            {/* ⭐ 변경: 위치 정보 창 (왼쪽 상단) - 이제 showLocationInfo가 true일 때만 flex로 표시 */}
            {showLocationInfo && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(60px + 1vh)',
                        left: '1vw',
                        zIndex: 10,
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        display: 'flex', // flex로 변경
                        flexDirection: 'column', // 세로 정렬
                        justifyContent: 'space-between', // 내용과 버튼을 분리
                        width: '250px', // 너비 고정
                        height: 'auto', // 높이는 내용에 따라 조절
                    }}
                >
                    <div> {/* MyLocationComponent와 좌표 정보를 감싸는 div */}
                        <MyLocationComponent onLocationUpdate={handleLocationUpdate} />
                        {currentUserCoords && (
                            <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
                                <p style={{ margin: '3px 0' }}>위도: {currentUserCoords.latitude.toFixed(6)}</p>
                                <p style={{ margin: '3px 0' }}>경도: {currentUserCoords.longitude.toFixed(6)}</p>
                                <p style={{ margin: '3px 0' }}>정확도: &plusmn;{currentUserCoords.accuracy.toFixed(2)}m</p>
                            </div>
                        )}
                    </div>

                    {/* 위치 정보 창 토글 버튼을 창 내부에 배치 (창이 보일 때만 렌더링) */}
                    <button
                        onClick={() => setShowLocationInfo(false)} // 숨기기 기능만
                        style={{
                            marginTop: '15px', // 위쪽 콘텐츠와의 간격
                            alignSelf: 'center', // 하단 가운데 정렬
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            fontSize: '14px',
                        }}
                    >
                        위치 정보 숨기기
                    </button>
                </div>
            )}

            {/* 위치 정보 창이 숨겨져 있을 때만 보이는 '위치 정보 보기' 버튼 */}
            {!showLocationInfo && (
                <button
                    onClick={() => setShowLocationInfo(true)} // 보이기 기능만
                    style={{
                        position: 'absolute',
                        top: 'calc(60px + 1vh)', // 창이 있던 자리
                        left: '1vw', // 창이 있던 자리
                        zIndex: 10,
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                    }}
                >
                    위치 정보 보기
                </button>
            )}


            {/*'내 위치로 이동' 버튼*/}
            <button
                onClick={handleGoToMyLocation}
                style={{
                    position: 'absolute',
                    top: 'calc(60px + 80vh)',
                    right: '1.5vw',
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
                    cursor: 'pointer',
                    padding: 0
                }}
                title="내 위치로 이동"
            >
                <FaCompass style={{ fontSize: '50px', color: '#007bff' }} />
            </button>

            {/* --- 지도 --- */}
            <div
                id="map"
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: 'calc(100vh - 60px)',
                    backgroundColor: 'lightgray',
                    marginTop: '60px'
                }}
            >
                지도 로딩 중...
            </div>

        </div>
    );
};

export default HomePage;
