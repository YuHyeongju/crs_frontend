import React from 'react';

const MapControls = ({ currentMapType, handleRoadmapClick, handleSkyviewClick, handleZoomIn, handleZoomOut, isMobile }) => {
    return (
        <>
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
        </>
    );
};

export default MapControls;