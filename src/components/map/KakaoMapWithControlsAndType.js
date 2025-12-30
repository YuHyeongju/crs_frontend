// src/components/KakaoMapWithControlsAndType.js
import React, { useState, useEffect } from 'react';

/**
 * KakaoMapWithControlsAndType 컴포넌트는 지도 컨트롤(타입 변경, 확대/축소)을 제공합니다.
 * 이 컴포넌트는 지도를 직접 생성하지 않고, 부모로부터 'map' 인스턴스를 props로 전달받습니다.
 *
 * @param {object} props - 컴포넌트 props.
 * @param {object} props.map - 카카오 지도 API의 map 인스턴스 (kakao.maps.Map).
 */
const KakaoMapWithControlsAndType = ({ map }) => {
  // 현재 선택된 지도 타입을 관리할 state (roadmap 또는 hybrid)
  const [currentMapType, setCurrentMapType] = useState('roadmap');

  // 'map' prop이 변경되거나 컴포넌트가 마운트될 때, 초기 지도 타입 설정
  useEffect(() => {
    if (map && window.kakao && window.kakao.maps) {
      // 전달받은 map 인스턴스에 초기 로드맵 타입 설정
      map.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
      setCurrentMapType('roadmap'); // 초기 선택 상태를 '지도'로 설정
    }
  }, [map]); // map prop이 변경될 때마다 이 이펙트 재실행

  // 지도 타입 변경 함수
  const setMapType = (type) => {
    if (map && window.kakao && window.kakao.maps) {
      if (type === 'roadmap') {
        map.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
      } else { // 'hybrid'
        map.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
      }
      setCurrentMapType(type); // 현재 선택된 지도 타입 상태 업데이트
    }
  };

  // 지도 확대 함수
  const zoomIn = () => {
    if (map) { // map 인스턴스가 유효한지 확인
      map.setLevel(map.getLevel() - 1);
    }
  };

  // 지도 축소 함수
  const zoomOut = () => {
    if (map) { // map 인스턴스가 유효한지 확인
      map.setLevel(map.getLevel() + 1);
    }
  };

  // map 객체가 없으면 컨트롤을 렌더링하지 않음 (지도가 로드되기 전)
  if (!map) {
    return null; 
  }

  return (
    <>
      {/* 지도 타입 컨트롤 */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1, backgroundColor: 'white', padding: '5px', borderRadius: '5px', boxShadow: '2px 2px 2px rgba(0,0,0,0.2)' }}>
        <button
          onClick={() => setMapType('roadmap')}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            border: '1px solid #ccc',
            backgroundColor: currentMapType === 'roadmap' ? '#f0f0f0' : 'white',
            cursor: 'pointer'
          }}
        >
          지도
        </button>
        <button
          onClick={() => setMapType('hybrid')}
          style={{
            padding: '5px 10px',
            border: '1px solid #ccc',
            backgroundColor: currentMapType === 'hybrid' ? '#f0f0f0' : 'white',
            cursor: 'pointer'
          }}
        >
          스카이뷰
        </button>
      </div>

      {/* 지도 확대/축소 컨트롤 */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 1, backgroundColor: 'white', padding: '5px', borderRadius: '5px', boxShadow: '2px 2px 2px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
        <button
          onClick={zoomIn}
          style={{
            width: '30px', height: '30px',
            border: '1px solid #ccc',
            marginBottom: '5px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          style={{
            width: '30px', height: '30px',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          -
        </button>
      </div>
    </>
  );
};

export default KakaoMapWithControlsAndType;