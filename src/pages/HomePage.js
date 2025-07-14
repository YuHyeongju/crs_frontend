// src/pages/HomePage.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MyLocationComponent from '../components/CurrentLocation'; // 또는 '../components/CurrentLocation'; 파일명에 맞춰주세요.

const HomePage = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [currentUserCoords, setCurrentUserCoords] = useState(null);
  const mapContainerRef = useRef(null);
  const userLocationMarkerRef = useRef(null);

  const handleLocationUpdate = useCallback((coords) => {
    setCurrentUserCoords(coords);
  }, []);

  // 지도 초기화 (최초 1회만 실행)
  useEffect(() => {
    console.log("HomePage: 지도 초기화 useEffect 실행.");
    if (mapContainerRef.current && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        console.log("HomePage: 카카오 맵 SDK 로드 완료.");
        
        // --- 제공해주신 카카오맵 기본 초기화 코드를 const로 변환하여 통합 ---
        const mapContainer = mapContainerRef.current; // 지도를 표시할 div
        const mapOption = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표 (제주 카카오 본사)
            level: 3 // 지도의 확대 레벨
        };
        
        const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        setMapInstance(map); // 지도 인스턴스를 상태에 저장
        console.log("HomePage: 지도 인스턴스 초기화 완료!", map);

        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
        // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
        console.log("HomePage: 지도 타입 컨트롤 추가 완료.");

        // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.CENTERRIGHT);
        console.log("HomePage: 줌 컨트롤 추가 완료.");
        // --- const 변환 및 컨트롤 추가 끝 ---
      });
    } else {
      console.log("HomePage: 지도 컨테이너 또는 카카오 객체 미준비.", { mapContainerRef: mapContainerRef.current, kakao: window.kakao });
    }
  }, []);

  // 사용자 위치 마커 표시 및 지도 중심 이동
  useEffect(() => {
    console.log("HomePage: 사용자 위치 useEffect 실행.");
    if (mapInstance && currentUserCoords) {
      const { latitude, longitude } = currentUserCoords;
      const userLatLng = new window.kakao.maps.LatLng(latitude, longitude);

      // 기존 사용자 마커 업데이트 또는 생성
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
      
      // 지도의 중심을 사용자 위치로 이동
      mapInstance.setCenter(userLatLng);
      console.log("HomePage: 지도에 사용자 위치 마커 표시 및 중심 이동 완료.");

    } else {
      console.log("HomePage: 사용자 마커 표시 조건 불충족: mapInstance 또는 currentUserCoords 미준비.");
      // 위치 정보가 null이 될 경우 기존 사용자 마커를 제거합니다.
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null);
        userLocationMarkerRef.current = null;
        console.log("HomePage: 위치 정보 미준비로 기존 사용자 마커 제거됨.");
      }
    }
  }, [mapInstance, currentUserCoords]);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100vw',
        height: '93vh',
        overflow: 'hidden'
      }}
    >
      <div 
        id="map" 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'lightgray' 
        }}
      >
        지도 로딩 중...
      </div>

      <div
        style={{ 
          position: 'absolute', 
          top: '10px',
          left: '10px',
          zIndex: 10,
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        // 나의 현재 위치 관련 css 
      >
        <MyLocationComponent onLocationUpdate={handleLocationUpdate} />
      </div>
    </div>
  );
};

export default HomePage;