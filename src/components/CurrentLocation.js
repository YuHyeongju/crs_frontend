
import React, { useState, useEffect } from 'react';

const MyLocationComponent = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("MyLocationComponent: 최초 위치 요청 시작됨.");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(newLocation);
          setError(null);
          console.log("위치 업데이트 (1회):", newLocation.latitude, newLocation.longitude);
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
        },
        (err) => {
          let errorMessage = '';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = '사용자가 위치 정보 접근을 거부했습니다. 브라우저 설정을 확인해주세요.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다. 장치 설정을 확인해주세요.';
              break;
            case err.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.';
              break;
            default:
              errorMessage = `알 수 없는 위치 오류: ${err.message}`;
              break;
          }
          setError(errorMessage);
          setLocation(null);
          console.error("위치 가져오기 오류:", err.code, errorMessage);
          if (onLocationUpdate) {
            onLocationUpdate(null);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation을 지원하지 않는 브라우저입니다.');
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      if (onLocationUpdate) {
        onLocationUpdate(null);
      }
    }
    // 이 경우 cleanup 함수는 필요 없습니다.
  }, [onLocationUpdate]); // onLocationUpdate는 변경되지 않는 함수이므로 의존성 배열에 넣어도 무방

  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px' }}>
      <h3>나의 현재 위치</h3>
      {error && <p style={{ color: 'red' }}>오류: {error}</p>}
      {location ? (
        <div>
          <p>위도: {location.latitude.toFixed(6)}</p>
          <p>경도: {location.longitude.toFixed(6)}</p>
          <p>정확도: ±{location.accuracy.toFixed(2)} 미터</p>
        </div>
      ) : (
        <p>위치 정보를 가져오는 중이거나, 권한을 기다리고 있습니다...</p>
      )}
    </div>
  );
};

export default MyLocationComponent;