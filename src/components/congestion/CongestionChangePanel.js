import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 혼잡도에 따라 색상을 반환하는 헬퍼 함수 (제공해주신 코드 유지)
const getCongestionColor = (congestion) => {
    switch (congestion) {
        case '매우 혼잡': return '#dc3545';
        case '혼잡': return '#ffc107';
        case '보통': return '#17a2b8';
        case '여유': return '#28a745';
        default: return '#6c757d';
    }
};

// 2. 서버 DB의 ID와 매핑하는 객체 (1: 여유, 2: 보통, 3: 혼잡, 4: 매우 혼잡)
const CONGESTION_MAP = {
    '매우 혼잡': 'VERY_BUSY',
    '혼잡': 'BUSY',
    '보통': 'NORMAL',
    '여유': 'FREE'
};

const CongestionChangePanel = ({ onClose, onCongestionChange, restaurant }) => {
    // 현재 식당의 상태를 초기값으로 설정
    const [newCongestion, setNewCongestion] = useState(restaurant?.congestion || '보통');

    useEffect(() => {
        if (restaurant?.congestion) {
            setNewCongestion(restaurant.congestion);
        }
    }, [restaurant]);

    // CongestionChangePanel.js 내 handleConfirm 함수

    const handleConfirm = async () => {
        try {
            // 주소를 /updateStatus로 변경
            const userIdx = sessionStorage.getItem("userIdx");
            console.log("넘겨줄 사용자 Idx:",userIdx);
            await axios.post('/api/congestion/updateStatus', {
                userIdx: userIdx,
                kakaoId: restaurant.id,
                congStatus: CONGESTION_MAP[newCongestion],
                restName : restaurant.road_address_name,
                restAddress : restaurant.road_address_name || restaurant.address_name,
                restPhone: restaurant.phone || ''

                
            });

            console.log("식당 번호",restaurant.id)
            console.log("혼잡도 상태", CONGESTION_MAP[newCongestion])

            // 부모에게 변경 알림 (ID와 상태 문자열)
            if (onCongestionChange) {
                onCongestionChange(restaurant.id, newCongestion);
            }

            alert("성공적으로 변경되었습니다.");
            onClose();
        } catch (error) {
            console.error("업데이트 실패:", error);
            alert("서버 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center', minWidth: '280px'
            }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>혼잡도 변경</h3>
                
                {/* 현재/선택 중인 상태를 제공해주신 색상 함수로 표시 */}
                <div style={{
                    fontSize: '16px', marginBottom: '15px', fontWeight: 'bold',
                    color: getCongestionColor(newCongestion)
                }}>
                    선택된 상태: {newCongestion}
                </div>

                <select 
                    value={newCongestion} 
                    onChange={(e) => setNewCongestion(e.target.value)}
                    style={{
                        width: '100%', padding: '10px', marginBottom: '20px',
                        borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px'
                    }}
                >
                    {Object.keys(CONGESTION_MAP).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={handleConfirm} style={{
                        padding: '10px 20px', border: 'none', borderRadius: '5px',
                        backgroundColor: '#007bff', color: 'white', cursor: 'pointer'
                    }}>확인</button>
                    <button onClick={onClose} style={{
                        padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px',
                        backgroundColor: '#f8f9fa', color: '#333', cursor: 'pointer'
                    }}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default CongestionChangePanel;