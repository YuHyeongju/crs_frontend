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
// FaLocationArrow import를 삭제하여 경고를 해결합니다.
// import { FaLocationArrow } from 'react-icons/fa'; // 이 줄을 제거했습니다.

const LocationPanel = ({ currentUserCoords, showLocationPanel, setShowLocationPanel, handleLocationUpdate }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '70px',
            left: '10px',
            zIndex: 10,
            display: showLocationPanel ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 15px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
            <h4 style={{ margin: '0', color: '#333' }}>현재 위치</h4>
            {currentUserCoords ? (
                <>
                    <div style={{ fontSize: '14px', color: '#555' }}>
                        <p style={{ margin: '0' }}>위도: {currentUserCoords.latitude.toFixed(6)}</p>
                        <p style={{ margin: '0' }}>경도: {currentUserCoords.longitude.toFixed(6)}</p>
                    </div>
                    <button
                        onClick={() => setShowLocationPanel(false)}
                        style={{
                            border: 'none',
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        닫기
                    </button>
                </>
            ) : (
                <div style={{ fontSize: '14px', color: '#555' }}>
                    위치 정보를 가져오는 중입니다...
                </div>
            )}
        </div>
    );
};

export default LocationPanel;