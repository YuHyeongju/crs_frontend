import React from 'react';
import { FaChevronLeft, FaTimes } from 'react-icons/fa';

const RESTAURANT_PANEL_WIDTH_DESKTOP = '280px';
const MOBILE_BREAKPOINT = 768;
const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

const RestaurantListPanel = ({
    restaurantList,
    handleListItemClick,
    onCongestionChangeClick,
    showRestaurantPanel,
    setShowRestaurantPanel,
    onRestaurantClick,
    isSearchMode,
    onClearSearch,
    isLoggedIn,
    myBookmarkIds = [],    // 본부(HomePage)에서 내려준 찜한 ID 리스트
    onBookmarkToggle       // 별 클릭 시 실행될 함수
}) => {
    return (
        <>
            {/* 식당 목록 패널 */}
            {showRestaurantPanel && (
                <div
                    style={{
                        position: 'fixed',
                        top: isMobile ? '0' : '60px',
                        left: isMobile ? '0' : '0',
                        width: isMobile ? '100vw' : RESTAURANT_PANEL_WIDTH_DESKTOP,
                        height: isMobile ? '100vh' : 'calc(100vh - 60px)',
                        backgroundColor: '#f8f8f8',
                        zIndex: 90,
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: showRestaurantPanel ? 'translateX(0)' : `translateX(-100%)`,
                        transition: 'transform 0.3s ease-out',
                        paddingTop: isMobile ? '60px' : '0',
                    }}
                >
                    {/* 패널 닫기 버튼 */}
                    <button
                        onClick={() => setShowRestaurantPanel(false)}
                        style={{
                            position: 'fixed',
                            top: isMobile ? '20px' : '17px',
                            right: isMobile ? '20px' : '65px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        title="패널 숨기기"
                    >
                        <FaChevronLeft style={{ fontSize: '16px', color: '#555' }} />
                    </button>

                    {/* 식당 목록 헤더 */}
                    <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
                                {isSearchMode ? '검색 결과' : '주변 식당'} ({restaurantList.length}개)
                            </h3>

                            {isSearchMode && (
                                <button
                                    onClick={onClearSearch}
                                    style={{
                                        display: 'flex',
                                        position: 'fixed',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fff',
                                        border: '1px solid #ddd',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        color: '#666',
                                        zIndex: 10,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        top: '17px',
                                        right: '28px'
                                    }}
                                    title="검색 초기화"
                                >
                                    <FaTimes style={{ fontSize: '12px' }} />
                                </button>
                            )}
                        </div>

                        {restaurantList.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {restaurantList.map((place, index) => {
                                    // 해당 식당이 찜 목록에 있는지 확인
                                    const isBookmarked = myBookmarkIds.includes(String(place.id));

                                    return (
                                        <li
                                            key={place.id}
                                            id={`restaurant-item-${place.id}`}
                                            onClick={() => handleListItemClick(place.id)}
                                            style={{
                                                position: 'relative', // 별 배치를 위한 기준점
                                                padding: '12px 10px',
                                                borderBottom: '1px solid #eee',
                                                cursor: 'pointer',
                                                backgroundColor: (index % 2 === 0) ? '#fff' : '#fefefe',
                                                borderRadius: '5px',
                                                marginBottom: '8px',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                                transition: 'background-color 0.2s',
                                                textAlign: 'left'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = (index % 2 === 0) ? '#fff' : '#fefefe'}
                                        >
                                            {/* 🌟 우측 상단 별표 버튼 */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 카드 클릭(이동) 방지
                                                    onBookmarkToggle(place);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '22px',
                                                    zIndex: 5,
                                                    padding: '0',
                                                    lineHeight: '1'
                                                }}
                                            >
                                                {isBookmarked ? '⭐' : '☆'}
                                            </button>

                                            <strong style={{ color: '#007bff', fontSize: '16px', paddingRight: '25px', display: 'block' }}>
                                                {place && place.place_name ? `${index + 1}. ${place.place_name}` : "로딩 중..."}
                                            </strong>
                                            <span style={{ fontSize: '13px', color: '#555' }}>
                                                {place.road_address_name || place.address_name}
                                            </span><br />
                                            {place.phone && (
                                                <span style={{ fontSize: '12px', color: '#777' }}>
                                                    📞 {place.phone}
                                                </span>
                                            )}<br />
                                            <span style={{ fontSize: '13px', color: '#555' }}>
                                                평점: **{place.rating}**점 | 리뷰: **{place.reviewCount}**개
                                            </span><br />
                                            <span style={{
                                                fontSize: '13px',
                                                fontWeight: 'bold',
                                                color: place.congestion === '매우 혼잡' ? '#dc3545' :
                                                    place.congestion === '혼잡' ? '#ffc107' :
                                                        place.congestion === '보통' ? '#17a2b8' :
                                                            place.congestion === '여유' ? '#28a745' : '#666'
                                            }}>
                                                혼잡도: {(place.congestion && place.congestion !== 'null') ? place.congestion : '혼잡도 이력 없음'}
                                            </span>

                                            {/* 버튼 그룹 */}
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCongestionChangeClick(place);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px 0',
                                                        backgroundColor: isLoggedIn ? '#007bff' : '#ccc',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        fontSize: '13px',
                                                        fontWeight: 'bold',
                                                        cursor: isLoggedIn ? 'pointer' : 'not-allowed'
                                                    }}
                                                >
                                                    혼잡도 변경
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRestaurantClick(place);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px 0',
                                                        backgroundColor: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        fontSize: '13px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    상세보기
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p style={{ color: '#777', textAlign: 'center', marginTop: '50px' }}>
                                검색된 식당이 없습니다.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* 패널 열기 버튼 */}
            {!showRestaurantPanel && (
                <button
                    onClick={() => setShowRestaurantPanel(true)}
                    style={{
                        position: 'absolute',
                        top: isMobile ? '130px' : 'calc(60px + 10px)',
                        left: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                        zIndex: 95,
                    }}
                >
                    패널 보기
                </button>
            )}
        </>
    );
};

export default RestaurantListPanel;