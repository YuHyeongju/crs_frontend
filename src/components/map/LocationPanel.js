

const LocationPanel = ({ currentUserCoords, showLocationPanel, setShowLocationPanel }) => {
    // showLocationPanel 값이 false일 경우 null을 반환하여 렌더링하지 않음 (패널 숨김)
    if (!showLocationPanel) {
        return null;
    }

    // showLocationPanel 값이 true일 경우 패널을 렌더링 (패널 표시)
    return (
        <div style={{
            position: 'fixed',
            top: '60px',
            right: '0px',
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