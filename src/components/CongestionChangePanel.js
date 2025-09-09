import React, { useState } from 'react';

const CongestionChangePanel = ({ onClose, onCongestionChange, initialCongestion }) => {
    // 혼잡도 정보가 없는 경우를 대비하여 기본값 설정
    const initialSelection = initialCongestion || '보통';
    const [newCongestion, setNewCongestion] = useState(initialSelection);

    const handleConfirm = () => {
        onCongestionChange(newCongestion);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                minWidth: '280px'
            }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>혼잡도 변경</h3>
                
                {/* 현재 혼잡도 정보를 조건부로 표시 */}
                <div style={{
                    fontSize: '15px',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    color: initialCongestion ? '#007bff' : '#dc3545'
                }}>
                    현재 혼잡도: {initialCongestion ? initialCongestion : '정보 없음'}
                </div>

                <p style={{ color: '#555' }}>변경할 혼잡도를 선택해주세요.</p>
                
                <select 
                    value={newCongestion} 
                    onChange={(e) => setNewCongestion(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '16px'
                    }}
                >
                    <option value="매우 혼잡">매우 혼잡</option>
                    <option value="혼잡">혼잡</option>
                    <option value="보통">보통</option>
                    <option value="여유">여유</option>
                </select>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button 
                        onClick={handleConfirm}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        확인
                    </button>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            backgroundColor: '#f8f9fa',
                            color: '#333',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CongestionChangePanel;