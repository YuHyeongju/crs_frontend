import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 색상 반환 함수 (선택 전후 구분을 위해 수정)
const getCongestionColor = (congestion) => {
    switch (congestion) {
        case '매우 혼잡': return '#dc3545';
        case '혼잡': return '#ffc107';
        case '보통': return '#17a2b8';
        case '여유': return '#28a745';
        default: return '#6c757d'; // '혼잡도 이력 없음'이나 '상태 선택' 문구는 회색
    }
};

const CONGESTION_MAP = {
    '매우 혼잡': 'VERY_BUSY',
    '혼잡': 'BUSY',
    '보통': 'NORMAL',
    '여유': 'FREE',
    '혼잡도 이력 없음': 'NONE'
};

const SELECT_OPTIONS = ['매우 혼잡', '혼잡', '보통', '여유'];

const CongestionChangePanel = ({ onClose, onCongestionChange, restaurant }) => {
    // 초기값 설정
    const [newCongestion, setNewCongestion] = useState(restaurant?.congestion || '혼잡도 이력 없음');

    useEffect(() => {
        if (restaurant?.congestion) {
            setNewCongestion(restaurant.congestion);
        }
    }, [restaurant]);

    const handleConfirm = async () => {
        // 실제 상태를 선택하지 않았을 경우 차단
        if (!SELECT_OPTIONS.includes(newCongestion)) {
            alert("변경할 혼잡도 상태를 선택해 주세요.");
            return;
        }

        try {
            const userIdx = sessionStorage.getItem("userIdx");
            const sendStatus = CONGESTION_MAP[newCongestion];

            await axios.post('/api/congestion/updateStatus', {
                userIdx: userIdx,
                kakaoId: restaurant.id,
                congStatus: sendStatus,
                restName : restaurant.place_name,
                restAddress : restaurant.road_address_name || restaurant.address_name,
                restPhone: restaurant.phone || ''
            });

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
                
                {/* 상단 텍스트: 현재 상태가 '이력 없음'이면 회색, 아니면 해당 색상 */}
                <div style={{
                    fontSize: '16px', marginBottom: '15px', fontWeight: 'bold',
                    color: getCongestionColor(newCongestion)
                }}>
                    현재 상태: {newCongestion}
                </div>

                <select 
                    value={SELECT_OPTIONS.includes(newCongestion) ? newCongestion : "default"} 
                    onChange={(e) => setNewCongestion(e.target.value)}
                    style={{
                        width: '100%', padding: '10px', marginBottom: '20px',
                        borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px',
                        color: SELECT_OPTIONS.includes(newCongestion) ? 'black' : '#999' // 선택 전에는 글자색 흐리게
                    }}
                >
                    {/* 초기 안내 문구: 리스트에는 있지만 선택은 안 됨 */}
                    {!SELECT_OPTIONS.includes(newCongestion) && (
                        <option value="default" disabled>상태를 선택하세요</option>
                    )}

                    {SELECT_OPTIONS.map(option => (
                        <option key={option} value={option} style={{ color: 'black' }}>
                            {option}
                        </option>
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