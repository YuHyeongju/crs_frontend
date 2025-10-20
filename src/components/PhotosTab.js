import React from 'react';

const PhotosTab = ({ restaurant }) => {
    // 사장님이 등록한 사진이 있는 경우
    if (restaurant.isRegistered && restaurant.photos?.length > 0) {
        return (
            <div>
                <h3 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>사진</h3>
                
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    padding: '15px',
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    {restaurant.photos.map((photo) => (
                        <div 
                            key={photo.id}
                            style={{
                                width: '100%',
                                paddingBottom: '100%',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(photo.url, '_blank')}
                        >
                            <img 
                                src={photo.url} 
                                alt={photo.alt}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    ))}
                </div>
                
                <p style={{ 
                    color: '#28a745', 
                    fontSize: '13px', 
                    textAlign: 'center',
                    marginTop: '15px',
                    fontWeight: '500'
                }}>
                    ✓ 가게에서 직접 등록한 사진입니다
                </p>
            </div>
        );
    }
    
    // 등록된 사진이 없는 경우 → 카카오맵으로 연결
    const openKakaoMap = () => {
        if (restaurant.place_url) {
            window.open(restaurant.place_url, '_blank');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>사진</h3>
            
            <div style={{ 
                border: '2px solid #007bff',
                borderRadius: '8px',
                padding: '40px',
                backgroundColor: '#fff'
            }}>
                <div style={{ marginBottom: '25px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📷</div>
                    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                        가게 사진은 카카오맵에서<br />확인하실 수 있습니다.
                    </p>
                </div>
                
                <button 
                    onClick={openKakaoMap}
                    style={{
                        backgroundColor: '#FEE500',
                        color: '#000',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    📸 카카오맵에서 사진 보기
                </button>
            </div>
        </div>
    );
};

export default PhotosTab;