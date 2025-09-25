// import React from 'react';
// import MyLocationComponent from './CurrentLocation';
// import { FaTimes } from 'react-icons/fa';

// const LOCATION_PANEL_WIDTH_DESKTOP = '280px';
// const RIGHT_OFFSET_DESKTOP = '10px';
// const MOBILE_BREAKPOINT = 768;
// const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

// const LocationPanel = ({ currentUserCoords, showLocationPanel, setShowLocationPanel, handleLocationUpdate }) => {
//     return (
//         <>
//             {showLocationPanel && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         top: isMobile ? '0' : '60px',
//                         right: isMobile ? '0' : '0vw',
//                         width: isMobile ? '100vw' : LOCATION_PANEL_WIDTH_DESKTOP,
//                         height: isMobile ? '100vh' : 'auto',
//                         backgroundColor: '#f8f8f8',
//                         zIndex: 90,
//                         boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         padding: '15px',
//                         borderRadius: isMobile ? '0' : '8px',
//                         transform: showLocationPanel ? 'translateX(0)' : `translateX(100%)`,
//                         paddingTop: isMobile ? '60px' : '15px',
//                     }}
//                 >
//                     <button
//                         onClick={() => setShowLocationPanel(false)}
//                         style={{
//                             position: 'absolute',
//                             top: isMobile ? '20px' : '20px',
//                             left: isMobile ? '20px' : '20px',
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
//             {!showLocationPanel && (
//                 <button
//                     onClick={() => setShowLocationPanel(true)}
//                     style={{
//                         position: 'fixed',
//                         top: isMobile ? '170px' : '16.5vh',
//                         right: RIGHT_OFFSET_DESKTOP,
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
//         </>
//     );
// };

// export default LocationPanel;


import React from 'react';

// LocationPanel.js
const LocationPanel = ({ currentUserCoords, showLocationPanel, setShowLocationPanel }) => {
    // showLocationPanel 값이 false일 경우 null을 반환하여 렌더링하지 않음 (패널 숨김)
    if (!showLocationPanel) {
        return null;
    }

    // showLocationPanel 값이 true일 경우 패널을 렌더링 (패널 표시)
    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '10px',
            width: '300px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 100, // 다른 요소 위에 표시되도록 높은 z-index 설정
            padding: '15px',
        }}>
            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #eee' }}>현재 내 위치 정보</h4>
            {currentUserCoords ? (
                <>
                    <p>위도 (Latitude): <strong>{currentUserCoords.latitude.toFixed(6)}</strong></p>
                    <p>경도 (Longitude): <strong>{currentUserCoords.longitude.toFixed(6)}</strong></p>
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        *위치 정보는 주기적으로 업데이트될 수 있습니다.
                    </p>
                </>
            ) : (
                <p>위치 정보를 가져오는 중입니다. 잠시만 기다려주세요.</p>
            )}
            <button
                onClick={() => setShowLocationPanel(false)} // 닫기 버튼 클릭 시 패널 닫기
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    lineHeight: '1',
                    cursor: 'pointer',
                    color: '#aaa',
                    padding: '0',
                }}
            >
                &times;
            </button>
        </div>
    );
};

export default LocationPanel;