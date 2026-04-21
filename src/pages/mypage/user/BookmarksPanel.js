import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const BookmarksPanel = () => {
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  // 1. 서버에서 즐겨찾기 상세 정보 가져오기
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('/api/bookmarks/details', { withCredentials: true });
        setBookmarkedRestaurants(response.data || []);
      } catch (error) {
        console.error("즐겨찾기 목록 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  // 2. 즐겨찾기 취소 로직
  const handleDeleteItem = async (kakaoId) => {
    if (!window.confirm("이 식당을 즐겨찾기에서 제외할까요?")) return;
    try {
      await axios.post('/api/bookmarks/toggle', { kakaoId }, { withCredentials: true });
      setBookmarkedRestaurants(prev => prev.filter(item => item.kakaoId !== kakaoId));
    } catch (error) {
      alert("취소 중 오류가 발생했습니다.");
    }
  };

  const totalPages = Math.ceil(bookmarkedRestaurants.length / itemsPerPage);
  const currentItems = bookmarkedRestaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    restaurantList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    restaurantItem: { display: 'flex', alignItems: 'center', padding: '15px 25px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    restaurantDetails: { flexGrow: 1 }, 
    restaurantName: { fontSize: '18px', fontWeight: 'bold', color: '#007bff' },
    infoText: { fontSize: '14px', color: '#666', marginTop: '5px' },
    buttonContainer: { display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '15px' },
    actionButton: (isDetail) => ({
      width: '100px', padding: '8px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer',
      backgroundColor: isDetail ? '#007bff' : '#6c757d', color: 'white', fontWeight: 'bold'
    }),
    pagination: { display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' },
    pageButton: (isActive) => ({
      width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer',
      backgroundColor: isActive ? '#007bff' : 'white', color: isActive ? 'white' : '#555', border: '1px solid #ddd'
    }),
    noBookmarksBox: { textAlign: 'center', padding: '60px 20px', color: '#ccc' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>로딩 중...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.title}><h2>즐겨찾기한 식당</h2></div>

      {bookmarkedRestaurants.length > 0 ? (
        <>
          <div style={styles.restaurantList}>
            {currentItems.map(restaurant => (
              <div key={restaurant.kakaoId} style={styles.restaurantItem}>
                <div style={styles.restaurantDetails}>
                  <div style={styles.restaurantName}>{restaurant.restName}</div>
                  <div style={styles.infoText}><FaMapMarkerAlt /> {restaurant.restAddress}</div>
                  <div style={styles.infoText}><FaPhone /> {restaurant.restTel || '정보 없음'}</div>
                </div>
                <div style={styles.buttonContainer}>
                  <button 
                    style={styles.actionButton(true)} 
                    onClick={() => navigate(`/restaurant-detail/${restaurant.kakaoId}`, {
                      state: { restaurantName: restaurant.restName }
                    })}
                  >상세보기</button>
                  <button style={styles.actionButton(false)} onClick={() => handleDeleteItem(restaurant.kakaoId)}>취소</button>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.pagination}>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} style={styles.pageButton(currentPage === i + 1)} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.noBookmarksBox}>
          <FaHeart style={{ fontSize: '50px', marginBottom: '15px' }} />
          <div>아직 즐겨찾기한 식당이 없어요.</div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPanel;