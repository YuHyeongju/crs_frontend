import React from 'react';
import { FaCompass } from 'react-icons/fa';

const GoToMyLocationButton = ({ currentUserCoords, handleGoToMyLocation }) => {
    return (
        <button
            onClick={handleGoToMyLocation}
            style={{
                position: 'absolute',
                top: '85vh',
                right: '3vw',
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
                cursor: currentUserCoords ? 'pointer' : 'not-allowed',
                opacity: currentUserCoords ? 1 : 0.5,
                padding: 0,
                transition: 'opacity 0.3s ease-in-out',
            }}
            disabled={currentUserCoords === null}
            title={currentUserCoords ? "내 위치로 이동" : "위치 정보 로딩 중..."}
        >
            <FaCompass style={{ fontSize: '60px', color: '#007bff' }} />
        </button>
    );
};

export default GoToMyLocationButton;