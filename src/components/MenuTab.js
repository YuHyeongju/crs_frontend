import React from 'react';

const MenuTab = ({ restaurant }) => {
    // 등록된 메뉴가 있는 경우
    if (restaurant.isRegistered && restaurant.hasMenu && restaurant.menus?.length > 0) {
        return (
            <div>
                <h3 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>메뉴</h3>
                
                <div style={{ 
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fff'
                }}>
                    {restaurant.menus.map((menu, index) => (
                        <div key={menu.id}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 10px',
                            }}>
                                {/* 메뉴 이미지 (있는 경우) */}
                                {menu.image && (
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        backgroundColor: '#f0f0f0',
                                        marginRight: '15px',
                                        backgroundImage: `url(${menu.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }} />
                                )}
                                
                                {/* 메뉴명 */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        color: '#333',
                                        fontWeight: '500',
                                        marginBottom: '4px'
                                    }}>
                                        {menu.name}
                                    </div>
                                    {menu.description && (
                                        <div style={{ 
                                            fontSize: '13px', 
                                            color: '#999'
                                        }}>
                                            {menu.description}
                                        </div>
                                    )}
                                </div>
                                
                                {/* 가격 */}
                                <div style={{ 
                                    fontSize: '16px', 
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    marginLeft: '15px'
                                }}>
                                    {menu.price.toLocaleString()}원
                                </div>
                            </div>
                            
                            {index < restaurant.menus.length - 1 && (
                                <div style={{ 
                                    borderBottom: '1px solid #e0e0e0',
                                    margin: '0 10px'
                                }} />
                            )}
                        </div>
                    ))}
                </div>
                
                {/* 사장님이 직접 등록한 메뉴임을 표시 */}
                <p style={{ 
                    color: '#28a745', 
                    fontSize: '13px', 
                    textAlign: 'center',
                    marginTop: '15px',
                    fontWeight: '500'
                }}>
                    ✓ 가게에서 직접 등록한 메뉴입니다
                </p>
            </div>
        );
    }
    
    // 등록된 메뉴가 없는 경우 → 카카오맵 링크
    const openKakaoMap = () => {
        if (restaurant.place_url) {
            window.open(restaurant.place_url, '_blank');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>메뉴</h3>
            
            <div style={{ 
                border: '2px solid #007bff',
                borderRadius: '8px',
                padding: '40px',
                backgroundColor: '#fff'
            }}>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
                    메뉴 정보는 카카오맵에서<br />확인하실 수 있습니다.
                </p>
                
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
                    🗺️ 카카오맵에서 메뉴 보기
                </button>
                
                {restaurant.phone && (
                    <p style={{ 
                        fontSize: '14px', 
                        color: '#999', 
                        marginTop: '25px',
                        paddingTop: '20px',
                        borderTop: '1px solid #e0e0e0'
                    }}>
                        전화 문의: <span style={{ color: '#007bff', fontWeight: '500' }}>{restaurant.phone}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default MenuTab;