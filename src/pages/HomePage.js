// src/pages/HomePage.js
import React, { useEffect, useRef, useState } from 'react'; // useState 훅은 필수입니다.
import KakaoMapWithControlsAndType from '../components/KakaoMapWithControlsAndType'; // 컨트롤 버튼 컴포넌트 임포트

const HomePage = () => {
  // 지도를 표시할 div 요소를 참조하기 위한 ref
  const mapContainer = useRef(null); 

  // 지도 인스턴스를 저장할 상태
  const [mapInstance, setMapInstance] = useState(null); 

  useEffect(() => {
    // Kakao Maps SDK가 로드되었는지, 지도 컨테이너가 준비되었는지,
    // 그리고 아직 지도 인스턴스가 생성되지 않았을 때만 지도를 초기화합니다.
    if (window.kakao && window.kakao.maps && mapContainer.current && !mapInstance) {
      // 지도 생성 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(35.1585, 129.0601), // 예시: 부산 중심 좌표
        level: 3 // 지도의 확대 레벨
      };

      // 지도 생성 (mapContainer.current에 지도를 그립니다)
      const map = new window.kakao.maps.Map(mapContainer.current, options);
      
      // 생성된 지도 인스턴스를 상태에 저장합니다.
      setMapInstance(map); 

      // (선택 사항) 마커 추가 예시: (필요하다면 주석을 풀고 사용하세요)
      // const markerPosition  = new window.kakao.maps.LatLng(35.1585, 129.0601); 
      // const marker = new window.kakao.maps.Marker({
      //     position: markerPosition
      // });
      // marker.setMap(map);

    } else if (mapInstance) {
      // 지도가 이미 초기화되었다면 콘솔에 메시지
      console.log("지도는 이미 초기화되었습니다.");
    } else {
      // SDK 로딩 문제 또는 컨테이너 미준비 에러 메시지
      console.error("카카오 지도 SDK가 로드되지 않았거나 지도 컨테이너가 준비되지 않았습니다.");
    }

    // 컴포넌트 언마운트 시 클린업 함수
    return () => {}; 
  }, [mapInstance]); // mapInstance 상태가 변경될 때만 이 useEffect가 재실행되도록 설정

  return (
    // 이 div는 지도 컨테이너와 컨트롤 컴포넌트를 포함합니다.
    // 'position: relative'를 주어, 그 안의 컨트롤 버튼들이 'absolute'로 올바르게 위치하도록 합니다.
    // 'width'와 'height'를 페이지에 원하는 지도 크기로 조절하세요.
    <div 
      style={{ 
        position: 'relative', // 이 div 안에서 버튼들이 절대 위치를 가질 수 있도록 합니다.
        width: '100%',        // 지도가 차지할 너비를 설정하세요 (예: '100%', '800px')
        height: '91vh',      // 지도가 차지할 높이를 설정하세요 (예: '500px', '70vh')
        backgroundColor: 'lightgray', // 지도가 로드되기 전 배경색
        // border: '1px solid #ccc',     // 지도를 명확히 구분하기 위한 테두리 (선택 사항)
        // margin: '0 auto',             // 중앙 정렬 (선택 사항)
        // overflow: 'hidden'            // 지도가 이 div 밖으로 넘치지 않도록 할 때 사용 (필요시)
      }}
    >
      {/* 지도가 실제로 그려질 내부 div입니다. 이 div에 'ref'를 연결합니다. */}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%', // 부모 div의 100% 높이와 너비를 채웁니다.
        }} 
      >
        {/* 지도가 로드되지 않았을 때 표시될 메시지 (선택 사항) */}
        {(!window.kakao || !window.kakao.maps) && <p style={{ textAlign: 'center', paddingTop: '50px' }}>지도 데이터를 불러오는 중...</p>}
      </div>

      {/* 중요: 'mapInstance'가 null이 아닐 때만 KakaoMapWithControlsAndType 컴포넌트를 렌더링하고, 
          생성된 'mapInstance'를 'map' prop으로 전달합니다. */}
      {mapInstance && <KakaoMapWithControlsAndType map={mapInstance} />}
    </div>
  );
};

export default HomePage;