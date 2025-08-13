import React, { useState } from 'react';
import { FaCommentDots, FaStar } from 'react-icons/fa';

const MyReviewsPanel = () => {
  const [myReviews, setMyReviews] = useState([
    {
      id: 1,
      restaurantName: '맛있는 스테이크집',
      date: '2025.08.13',
      rating: 4,
      content: '분위기가 좋고 스테이크가 정말 맛있었습니다! 재방문 의사 100%',
    },
    {
      id: 2,
      restaurantName: '바다뷰 카페',
      date: '2025.08.10',
      rating: 5,
      content: '커피 맛도 좋고, 창밖으로 보이는 바다 풍경이 정말 최고였어요.',
    },
    {
      id: 3,
      restaurantName: '전통 한정식집',
      date: '2025.08.05',
      rating: 3,
      content: '가족 외식으로 갔는데, 반찬이 다양해서 좋았어요.',
    },
  ]);

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = myReviews.filter(review => review.id !== reviewId);
    setMyReviews(updatedReviews);
  };

  const handleEditReview = (reviewId) => {
    // 여기에 수정 로직을 구현합니다.
    alert(`${reviewId}번 리뷰를 수정합니다.`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{ color: i < rating ? '#f39c12' : '#e0e0e0', marginRight: '3px' }}
        />
      );
    }
    return stars;
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
    },
    noReviewsBox: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      border: '1px dashed #ccc',
      borderRadius: '10px',
      color: '#777',
      fontSize: '16px',
    },
    noReviewsText: {
      marginTop: '15px',
      fontSize: '16px',
    },
    reviewList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    reviewItem: {
      padding: '20px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '10px',
    },
    reviewInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    restaurantName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#007bff',
    },
    reviewDate: {
      fontSize: '14px',
      color: '#888',
      marginTop: '5px',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      color: '#f39c12',
    },
    reviewContent: {
      fontSize: '16px',
      color: '#555',
      lineHeight: '1.5',
      marginBottom: '20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
    },
    actionButton: (isEdit) => ({
      width: '80px',
      padding: '8px 10px',
      borderRadius: '5px',
      border: `1px solid ${isEdit ? '#007bff' : '#dc3545'}`,
      backgroundColor: 'white',
      color: isEdit ? '#007bff' : '#dc3545',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    }),
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>나의 리뷰</h2>

      {myReviews.length > 0 ? (
        <div style={styles.reviewList}>
          {myReviews.map(review => (
            <div key={review.id} style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewInfo}>
                  <span style={styles.restaurantName}>{review.restaurantName}</span>
                  <span style={styles.reviewDate}>작성일: {review.date}</span>
                  <span style={{marginTop: '5px'}}>평점: {renderStars(review.rating)}</span>
                </div>
              </div>
              <p style={styles.reviewContent}>{review.content}</p>
              <div style={styles.buttonContainer}>
                <button
                  style={styles.actionButton(true)}
                  onClick={() => handleEditReview(review.id)}
                >
                  수정
                </button>
                <button
                  style={styles.actionButton(false)}
                  onClick={() => handleDeleteReview(review.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noReviewsBox}>
          <FaCommentDots style={{ fontSize: '40px', color: '#ccc' }} />
          <div style={styles.noReviewsText}>아직 작성한 리뷰가 없어요.</div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPanel;