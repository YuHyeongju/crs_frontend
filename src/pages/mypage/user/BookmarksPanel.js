import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const BookmarksPanel = () => {
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([
    {
      id: 1,
      name: '맛있는 스테이크집',
      address: '부산광역시 남구 대연동 123-45',
      congestion: '보통',
      status: '운영중',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: '바다뷰 카페',
      address: '부산광역시 해운대구 우동 678-90',
      congestion: '혼잡',
      status: '운영종료',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      name: '전통 한정식집',
      address: '부산광역시 중구 남포동 111-22',
      congestion: '보통',
      status: '운영중',
      imageUrl: 'https://via.placeholder.com/100',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(bookmarkedRestaurants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookmarkedRestaurants.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteItem = (id) => {
    setBookmarkedRestaurants(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteAll = () => {
    setBookmarkedRestaurants([]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteAllButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 15px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    noBookmarksBox: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      border: '1px dashed #ccc',
      borderRadius: '10px',
      color: '#777',
      fontSize: '16px',
    },
    noBookmarksText: {
      marginTop: '15px',
      fontSize: '16px',
    },
    restaurantList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    restaurantItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    restaurantImage: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover',
      marginRight: '20px',
    },
    restaurantDetails: {
      flexGrow: 1,
    },
    restaurantName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    restaurantAddress: {
      fontSize: '14px',
      color: '#777',
      marginBottom: '5px',
    },
    restaurantInfo: {
      fontSize: '14px',
      marginBottom: '3px',
    },
    statusText: (status) => ({
      color: status === '운영중' ? '#28a745' : '#dc3545',
      fontWeight: 'bold',
    }),
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginLeft: '15px',
    },
    actionButton: (isDetail) => ({
      width: '100px',
      padding: '8px 10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 'bold',
      backgroundColor: isDetail ? '#007bff' : '#6c757d',
      color: 'white',
      textAlign: 'center',
      textDecoration: 'none',
    }),
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
      gap: '10px',
    },
    pageButton: (isActive) => ({
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: '1px solid #ddd',
      backgroundColor: isActive ? '#007bff' : 'white',
      color: isActive ? 'white' : '#555',
      fontWeight: 'bold',
      cursor: 'pointer',
      outline: 'none',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <h2>즐겨찾기한 식당</h2>
        <button
          style={styles.deleteAllButton}
          onClick={handleDeleteAll}
          disabled={bookmarkedRestaurants.length === 0}
        >
          전체삭제
        </button>
      </div>

      {bookmarkedRestaurants.length > 0 ? (
        <>
          <div style={styles.restaurantList}>
            {currentItems.map(restaurant => (
              <div key={restaurant.id} style={styles.restaurantItem}>
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  style={styles.restaurantImage}
                />
                <div style={styles.restaurantDetails}>
                  <div style={styles.restaurantName}>{restaurant.name}</div>
                  <div style={styles.restaurantAddress}>{restaurant.address}</div>
                  <div style={styles.restaurantInfo}>혼잡도: {restaurant.congestion}</div>
                  <div style={styles.restaurantInfo}>
                    운영 여부: <span style={styles.statusText(restaurant.status)}>{restaurant.status}</span>
                  </div>
                </div>
                <div style={styles.buttonContainer}>
                  <button style={styles.actionButton(true)}>상세보기</button>
                  <button style={styles.actionButton(false)} onClick={() => handleDeleteItem(restaurant.id)}>즐겨찾기 취소</button>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.pagination}>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                style={styles.pageButton(currentPage === index + 1)}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.noBookmarksBox}>
          <FaHeart style={{ fontSize: '40px', color: '#ccc' }} />
          <div style={styles.noBookmarksText}>아직 즐겨찾기한 식당이 없어요.</div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPanel;