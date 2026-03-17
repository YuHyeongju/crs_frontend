import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ReviewsTab = ({ restIdx }) => {
    // 1. 상태 관리
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [reviews, setReviews] = useState([]);

    // 2. 리뷰 목록 조회 함수
    const fetchReviews = useCallback(async () => {
        
        if (!restIdx || restIdx === 'undefined') {
            console.warn("restIdx가 유효하지 않습니다:", restIdx);
            return;
        }

        try {
            console.log("restIdx 값:", restIdx);
            const res = await axios.get(`/api/reviews/${restIdx}`);
            
            const sortedReviews = res.data.sort((a, b) => b.idx - a.idx);
            setReviews(sortedReviews);
        } catch (error) {
            console.error("리뷰 조회 실패:", error);
        }
    }, [restIdx]);

    // 3. 페이지 로드 시 리뷰 목록 호출
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // 4. 리뷰 등록 함수
    const submitReview = async () => {
        
        if (rating === 0) return alert("별점을 선택해주세요!");
        if (!content.trim()) return alert("내용을 입력해주세요!");

        try {
            await axios.post('/api/reviews/register', { 
                restIdx: Number(restIdx), // 숫자로 확실히 변환
                content: content,
                rating: rating,
                userIdx: 1 // 실제 운영 시에는 로그인한 세션 유저의 idx 사용
            });
            
            alert("리뷰가 등록되었습니다.");
            
            // 입력창 초기화
            setContent("");
            setRating(0);
            
            // 리스트 갱신 (새 리뷰가 상단에 나타남)
            fetchReviews();
        } catch (error) {
            console.error("등록 에러:", error);
            alert("등록에 실패했습니다.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            
            {/* --- 수정된 별점 선택 영역 (가운데 정렬 적용) --- */}
            <div style={{ 
                borderBottom: '2px solid #f0f0f0', 
                paddingBottom: '20px', 
                marginBottom: '20px',
                textAlign: 'center' // 텍스트(제목) 가운데 정렬
            }}>
                <h4 style={{ marginBottom: '10px' }}>이 가게의 평점은?</h4>
                <div style={{ 
                    display: 'flex', 
                    gap: '5px',
                    justifyContent: 'center' // 별 아이콘들을 가로축 가운데로 정렬
                }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                            key={star} 
                            onClick={() => setRating(star)}
                            style={{ 
                                fontSize: '35px', 
                                cursor: 'pointer', 
                                color: rating >= star ? '#ffc107' : '#e4e5e9',
                                transition: 'color 0.2s'
                            }}
                        >★</span>
                    ))}
                </div>
            </div>
            {/* ------------------------------------------------ */}

            {/* 별점 선택 시 나타나는 입력창 */}
            {rating > 0 && (
                <div style={{ 
                    backgroundColor: '#f9f9f9', 
                    padding: '15px', 
                    borderRadius: '8px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="가게에 대한 솔직한 후기를 들려주세요."
                        style={{ 
                            width: '100%', 
                            height: '100px', 
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            resize: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                        <button 
                            onClick={submitReview}
                            style={{ 
                                padding: '10px 25px', 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            리뷰 등록
                        </button>
                    </div>
                </div>
            )}

            {/* 리뷰 목록 영역 */}
            <div>
                <h4 style={{ marginBottom: '15px' }}>리뷰 ({reviews.length})</h4>
                {reviews.length > 0 ? (
                    reviews.map((r) => (
                        <div key={r.idx} style={{ 
                            borderBottom: '1px solid #eee', 
                            padding: '15px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                        }}>
                            <div style={{ color: '#ffc107', fontSize: '18px' }}>
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                            </div>
                            <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>{r.content}</p>
                            {/* 날짜는 서버에서 받아온 포맷에 맞게 r.regDate 등으로 수정 필요 */}
                            <small style={{ color: '#999' }}>2026.03.11</small>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                        아직 작성된 리뷰가 없습니다. <br/>첫 번째 리뷰를 남겨보세요!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsTab;