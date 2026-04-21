import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ReviewsTab = ({ restIdx }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [reviews, setReviews] = useState([]);

    const userInfo = JSON.parse(sessionStorage.getItem('user') || 'null'); 

    const fetchReviews = useCallback(async () => {
        if (!restIdx || restIdx === 'undefined') return;
        try {
            const res = await axios.get(`/api/reviews/${restIdx}`);
            const sortedReviews = res.data.sort((a, b) => b.reviewIdx - a.reviewIdx);
            setReviews(sortedReviews);
        } catch (error) {
            console.error("리뷰 조회 실패:", error);
        }
    }, [restIdx]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleStarClick = (star) => {
        if (!userInfo) {
            alert("로그인이 필요한 서비스입니다.");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        setRating(star);
    };

    const submitReview = async () => {
        if (!userInfo) return alert("로그인 후 이용 가능합니다.");
        if (rating === 0) return alert("별점을 선택해주세요!");
        if (!content.trim()) return alert("내용을 입력해주세요!");

        try {
            await axios.post('/api/reviews/register', { 
                restIdx: Number(restIdx),
                content: content,
                rating: rating,
                userIdx: userInfo.userIdx 
            });
            
            alert("리뷰가 등록되었습니다.");
            setContent("");
            setRating(0);
            fetchReviews(); 
        } catch (error) {
            console.error("등록 에러:", error);
            alert("등록에 실패했습니다.");
        }
    };

    return (
        <div style={{ padding: '0 15px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff' }}>
            {/* 별점 선택 영역 (상단) */}
            <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' }}>이 가게의 평점은?</h4>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={() => handleStarClick(star)}
                            style={{ 
                                fontSize: '40px', 
                                cursor: 'pointer', 
                                color: rating >= star ? '#FFD700' : '#E5E5E5',
                                transition: 'color 0.2s' 
                            }}>★</span>
                    ))}
                </div>
            </div>

            {/* 리뷰 작성 영역 */}
            {rating > 0 && userInfo && (
                <div style={{ padding: '15px', borderRadius: '12px', border: '1px solid #EAEAEA', marginBottom: '30px', backgroundColor: '#FBFBFB' }}>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)}
                        placeholder="음식의 맛, 서비스, 분위기 등에 대한 솔직한 후기를 남겨주세요."
                        style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #DDD', resize: 'none', boxSizing: 'border-box', fontSize: '14px' }}
                    />
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                        <button onClick={submitReview}
                            style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>리뷰 등록</button>
                    </div>
                </div>
            )}

            {/* ⭐ 리뷰 목록 영역 (시안 반영) */}
            <div style={{ borderTop: '8px solid #F4F4F4', margin: '0 -15px', padding: '20px 15px' }}>
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>리뷰</span>
                    <span style={{ color: '#FF4D4D', fontWeight: 'bold' }}>{reviews.length}</span>
                </div>

                {reviews.length > 0 ? (
                    reviews.map((r) => (
                        <div key={r.reviewIdx} style={{ 
                            padding: '20px 0',
                            borderBottom: '1px solid #F0F0F0'
                        }}>
                            {/* 헤더: 별점 + 이름 + 날짜 (가로 배치) */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ color: '#FFD700', fontSize: '14px', letterSpacing: '-2px', marginRight: '8px' }}>
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                                <span style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '8px', color: '#333' }}>
                                    {r.userName || '익명'}
                                </span>
                                <span style={{ color: '#BBB', fontSize: '12px' }}>
                                    {r.reviewAt ? new Date(r.reviewAt).toLocaleDateString().replace(/\.$/, '') : '2026.03.18'}
                                </span>
                            </div>

                            {/* 본문: 리뷰 내용 */}
                            <div style={{ 
                                fontSize: '15px', 
                                color: '#444', 
                                lineHeight: '1.6', 
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all'
                            }}>
                                {r.content}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#AAA', fontSize: '14px' }}>
                        아직 작성된 리뷰가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsTab;