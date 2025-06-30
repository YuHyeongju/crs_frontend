import React, { useEffect, useRef } from 'react';
// import Header from '../components/Header'; // 헤더 컴포넌트를 사용한다면 임포트
// import SearchBar from '../components/SearchBar'; // 검색 바 컴포넌트를 사용한다면 임포트
// import LoginButton from '../components/LoginButton'; // 로그인 버튼 컴포넌트를 사용한다면 임포트

const HomePage = () => {
  // 지도를 담을 div 요소를 참조하기 위한 ref 생성
  const mapRef = useRef(null); // 'map' id를 가진 div가 아닌, 이 ref에 연결된 div를 사용할 것임

  useEffect(() => {
    // window.kakao 객체가 로드되었는지 확인 (SDK 로드 여부)
    if (window.kakao && window.kakao.maps) {
      // 지도 컨테이너 (ref로 연결된 div)
      const container = mapRef.current; 
      
      // 지도 생성 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(35.1585, 129.0601), // 예시: 부산 (현재 위치)
        level: 3// 지도의 확대 레벨
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(container, options);

      // (선택 사항) 마커 추가 예시:
      // const markerPosition  = new window.kakao.maps.LatLng(35.1585, 129.0601); 
      // const marker = new window.kakao.maps.Marker({
      //     position: markerPosition
      // });
      // marker.setMap(map);

    } else {
      // SDK가 로드되지 않았을 경우 콘솔에 에러 메시지 출력
      console.error("Kakao Maps SDK not loaded or window.kakao is undefined.");
      // 실제 앱에서는 사용자에게 로딩 메시지 등을 보여줄 수 있습니다.
    }

    // 컴포넌트 언마운트 시 클린업 함수 (필요에 따라)
    return () => {
      // 예를 들어, 지도 이벤트 리스너 제거 등
    };
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행됨을 의미

  return (
    <div>
      {/* 기존 헤더, 검색 바, 로그인 버튼 등이 있다면 여기에 배치 */}
      
      {/* <Header /> */}
      {/* <SearchBar /> */}
      {/* <LoginButton /> */}

      
      {/* 지도가 표시될 div 요소. id 대신 ref를 사용하여 연결하는 것이 React 방식.
          width와 height는 반드시 지정해야 지도가 보입니다. */}
      <div 
        ref={mapRef} // useRef로 생성한 mapRef와 연결
        style={{ width: '1920px', height: '1080px', backgroundColor: 'lightgray' }} 
        // style={{ width: '100%', height: 'calc(100vh - 100px)', backgroundColor: 'lightgray' }} // 화면 전체를 사용하려면 이렇게
      >
        {/* 지도가 로드되지 않았을 때 표시될 메시지 (선택 사항) */}
        {(!window.kakao || !window.kakao.maps) && <p>지도 데이터를 불러오는 중...</p>}
      </div>

      {/* 다른 페이지 내용 */}
    </div>
  );
};

export default HomePage;