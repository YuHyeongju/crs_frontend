// src/pages/HomePage.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCompass } from 'react-icons/fa'; // FaCompass 아이콘 임포트

import MyLocationComponent from '../components/CurrentLocation';

const HomePage = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [currentUserCoords, setCurrentUserCoords] = useState(null);

  const clickedMarkerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const userLocationMarkerRef = useRef(null);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  const handleLocationUpdate = useCallback((coords) => {
    setCurrentUserCoords(coords);
  }, []);

  // 1. 지도 초기화 및 클릭 이벤트 리스너 등록
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

        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
        console.log("HomePage: 지도 타입 컨트롤 추가 완료.");

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.BOTTOMLEFT);
        console.log("HomePage: 줌 컨트롤 추가 완료.");

        // 지도 클릭 이벤트 리스너 등록
        const clickHandler = function(mouseEvent) {
            const latlng = mouseEvent.latLng;
            console.log(`지도 클릭: 위도 ${latlng.getLat()}, 경도 ${latlng.getLng()}`);

            // 1. 기존에 클릭으로 생성된 마커가 있다면 지도에서 제거합니다.
            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
            }

            // 2. 사용자 현재 위치 마커가 있다면 지도에서 제거합니다.
            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setMap(null);
                userLocationMarkerRef.current = null; // 참조도 초기화
                console.log("HomePage: 클릭으로 인해 사용자 위치 마커 제거됨.");
            }

            // 3. 새 마커를 생성합니다
            const newMarker = new window.kakao.maps.Marker({
                position: latlng,
                map: map
            });

            // 4. 생성된 새 마커를 useRef에 저장합니다.
            clickedMarkerRef.current = newMarker;
        };

        window.kakao.maps.event.addListener(map, 'click', clickHandler);

        // 클린업 함수: 컴포넌트 언마운트 또는 이펙트 재실행 시 이벤트 리스너 제거
        return () => {
            console.log("HomePage: 지도 클릭 이벤트 리스너 제거 및 마커 클린업.");
            window.kakao.maps.event.removeListener(map, 'click', clickHandler);
            if (clickedMarkerRef.current) {
                clickedMarkerRef.current.setMap(null);
                clickedMarkerRef.current = null;
            }
            if (userLocationMarkerRef.current) {
                userLocationMarkerRef.current.setMap(null);
                userLocationMarkerRef.current = null;
            }
        };
      });
    } else {
      console.log("HomePage: 지도 컨테이너 또는 카카오 객체 미준비.", { mapContainerRef: mapContainerRef.current, kakao: window.kakao });
    }
  }, []); // 의존성 배열을 빈 배열로 두어 컴포넌트 마운트 시 한 번만 실행되도록 함


  // 2. 사용자 위치 마커 표시 및 지도 중심 이동 (첫 로드 시 한 번만 이동)
  useEffect(() => {
    console.log("HomePage: 사용자 위치 useEffect 실행.");
    if (mapInstance && currentUserCoords) {
      const { latitude, longitude } = currentUserCoords;
      const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

      // 클릭 마커가 현재 존재하지 않을 때만 사용자 위치 마커를 관리합니다.
      if (!clickedMarkerRef.current) {
        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.setPosition(userLatLng);
          console.log("HomePage: 기존 사용자 마커 위치 업데이트됨.");
        } else {
          const marker = new window.kakao.maps.Marker({
            map: mapInstance,
            position: userLatLng,
          });
          userLocationMarkerRef.current = marker;
          console.log("HomePage: 새 사용자 마커 생성 성공:", marker);
        }

        // initialLocationSet이 false일 때만 지도 중심을 이동합니다.
        if (!initialLocationSet) {
          mapInstance.setCenter(userLatLng);
          console.log("HomePage: 지도에 사용자 위치 마커 표시 및 중심 이동 완료.");
          setInitialLocationSet(true);
        } else {
          console.log("HomePage: 초기 위치 설정 완료, 지도 중심은 변경하지 않음.");
        }
      } else {
          console.log("HomePage: 클릭 마커가 존재하여 사용자 위치 마커는 표시하지 않음.");
          if (userLocationMarkerRef.current) {
              userLocationMarkerRef.current.setMap(null);
              userLocationMarkerRef.current = null;
          }
      }
    } else {
      console.log("HomePage: 사용자 마커 표시 조건 불충족: mapInstance 또는 currentUserCoords 미준비.");
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null);
        userLocationMarkerRef.current = null;
        console.log("HomePage: 위치 정보 미준비로 기존 사용자 마커 제거됨.");
      }
    }
  }, [mapInstance, currentUserCoords, initialLocationSet]);

  // '내 위치로 이동' 버튼 클릭 핸들러 (새로 추가)
  const handleGoToMyLocation = useCallback(() => {
    console.log("내 위치로 이동 버튼 클릭됨.");
    if (mapInstance && currentUserCoords) {
      const { latitude, longitude } = currentUserCoords;
      const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

      // 1. 클릭 마커가 있다면 제거
      if (clickedMarkerRef.current) {
        clickedMarkerRef.current.setMap(null);
        clickedMarkerRef.current = null;
        console.log("HomePage: '내 위치로 이동' 버튼 클릭으로 클릭 마커 제거됨.");
      }

      // 2. 지도 중심을 사용자 위치로 이동
      mapInstance.setCenter(userLatLng);
      console.log("HomePage: 지도 중심을 사용자 위치로 이동.");

      // 3. 사용자 위치 마커 다시 표시
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setPosition(userLatLng);
        userLocationMarkerRef.current.setMap(mapInstance); // 혹시 제거되었다면 다시 지도에 추가
        console.log("HomePage: 기존 사용자 마커 위치 업데이트 및 다시 표시됨.");
      } else {
        const marker = new window.kakao.maps.Marker({
          map: mapInstance,
          position: userLatLng,
        });
        userLocationMarkerRef.current = marker;
        console.log("HomePage: 새 사용자 마커 생성 및 표시됨.");
      }
    } else {
      console.log("HomePage: 지도 인스턴스 또는 사용자 위치 정보가 없어 이동할 수 없습니다.");
      alert("현재 위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
    }
  }, [mapInstance, currentUserCoords]);


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

      {/* 나의 위치 정보 창 (왼쪽 상단) */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(60px + 1vh)',
          left: '1vw',
          zIndex: 10,
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        <MyLocationComponent onLocationUpdate={handleLocationUpdate} />
      </div>

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
          borderRadius: '50%', // 원형 버튼
          width: '100px',
          height: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          padding: 0 // 패딩 제거하여 아이콘이 중앙에 오도록
        }}
        title="내 위치로 이동"
      >
        <FaCompass style={{ fontSize: '50px', color: '#007bff' }} />
      </button>

    </div>
  );
};

export default HomePage;