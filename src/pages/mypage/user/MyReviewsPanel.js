import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { FaCommentDots, FaStar } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';

const PAGE_SIZE = 2;

const MyReviewsPanel = () => {
  const { userIdx } = useContext(AuthContext);
  const [myReviews, setMyReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);

  const fetchMyReviews = useCallback(async (targetPage = page) => {
    if (!userIdx) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/reviews/my/${userIdx}`, {
        params: { page: targetPage, size: PAGE_SIZE },
      });
      setMyReviews(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
      setPage(res.data.number || 0);
    } catch (err) {
      console.error('내 리뷰 조회 실패:', err);
      alert('리뷰를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userIdx, page]);

  useEffect(() => {
    fetchMyReviews(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdx]);

  const goToPage = (target) => {
    if (target < 0 || (totalPages > 0 && target >= totalPages)) return;
    fetchMyReviews(target);
  };

  const startEdit = (review) => {
    setEditingId(review.reviewIdx);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditRating(5);
  };

  const submitEdit = async (reviewIdx) => {
    if (!editContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/reviews/${reviewIdx}`, {
        userIdx: Number(userIdx),
        content: editContent.trim(),
        rating: editRating,
      });
      cancelEdit();
      await fetchMyReviews();
    } catch (err) {
      console.error('리뷰 수정 실패:', err);
      alert(err.response?.data || '수정에 실패했습니다.');
    }
  };

  const handleDelete = async (reviewIdx) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewIdx}`, {
        params: { userIdx: Number(userIdx) },
      });
      const remainingOnPage = myReviews.length - 1;
      const targetPage = (remainingOnPage === 0 && page > 0) ? page - 1 : page;
      await fetchMyReviews(targetPage);
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      alert(err.response?.data || '삭제에 실패했습니다.');
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const renderStars = (rating, onClick) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          onClick={onClick ? () => onClick(i + 1) : undefined}
          style={{
            color: i < rating ? '#f39c12' : '#e0e0e0',
            marginRight: '3px',
            cursor: onClick ? 'pointer' : 'default',
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>나의 리뷰</h2>

      {loading ? (
        <div style={styles.noReviewsBox}>불러오는 중...</div>
      ) : myReviews.length > 0 ? (
        <div style={styles.reviewList}>
          {myReviews.map(review => {
            const isEditing = editingId === review.reviewIdx;
            return (
              <div key={review.reviewIdx} style={styles.reviewItem}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewInfo}>
                    <span style={styles.restaurantName}>{review.restName}</span>
                    <span style={styles.reviewDate}>
                      작성일: {formatDate(review.reviewAt)}
                      {review.reviewUpdateAt ? ` (수정: ${formatDate(review.reviewUpdateAt)})` : ''}
                    </span>
                    <span style={{ marginTop: '5px' }}>
                      평점: {renderStars(isEditing ? editRating : review.rating, isEditing ? setEditRating : null)}
                    </span>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={styles.editTextarea}
                    maxLength={2000}
                  />
                ) : (
                  <p style={styles.reviewContent}>{review.content}</p>
                )}

                <div style={styles.buttonContainer}>
                  {isEditing ? (
                    <>
                      <button style={styles.actionButton(true)} onClick={() => submitEdit(review.reviewIdx)}>저장</button>
                      <button style={styles.actionButton(false)} onClick={cancelEdit}>취소</button>
                    </>
                  ) : (
                    <>
                      <button style={styles.actionButton(true)} onClick={() => startEdit(review)}>수정</button>
                      <button style={styles.actionButton(false)} onClick={() => handleDelete(review.reviewIdx)}>삭제</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div style={styles.pagination}>
            <button
              style={styles.navButton(page === 0)}
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              aria-label="이전 페이지"
            >
              {'<'}
            </button>
            {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => (
              <button
                key={i}
                style={styles.pageButton(page === i)}
                onClick={() => goToPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              style={styles.navButton(page >= totalPages - 1)}
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label="다음 페이지"
            >
              {'>'}
            </button>
          </div>
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
    marginBottom: '10px',
    textAlign: 'left',
  },
  reviewInfo: {
    display: 'block',
    textAlign: 'left',
  },
  restaurantName: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'left',
  },
  reviewDate: {
    display: 'block',
    fontSize: '14px',
    color: '#888',
    marginTop: '5px',
    textAlign: 'left',
  },
  reviewContent: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.5',
    marginBottom: '20px',
    whiteSpace: 'pre-wrap',
  },
  editTextarea: {
    width: '100%',
    minHeight: '90px',
    fontSize: '15px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  actionButton: (isPrimary) => ({
    width: '80px',
    padding: '8px 10px',
    borderRadius: '5px',
    border: `1px solid ${isPrimary ? '#007bff' : '#dc3545'}`,
    backgroundColor: 'white',
    color: isPrimary ? '#007bff' : '#dc3545',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
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
    cursor: 'pointer',
    backgroundColor: isActive ? '#007bff' : 'white',
    color: isActive ? 'white' : '#555',
    border: '1px solid #ddd',
  }),
  navButton: (disabled) => ({
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: 'white',
    color: disabled ? '#ccc' : '#555',
    border: '1px solid #ddd',
    fontWeight: 'bold',
  }),
};

export default MyReviewsPanel;
