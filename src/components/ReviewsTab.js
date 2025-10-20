import React from 'react';

const ReviewsTab = ({ restaurant }) => {
    // 샘플 리뷰 데이터 (실제로는 API에서 가져와야 함)
    const sampleReviews = [
        { id: 1, author: '사용자', rating: 5, date: '2주 전', content: '너무 맛있어요!' },
        { id: 2, author: '사용자', rating: 4, date: '1개월 전', content: '분위기가 좋아요' },
        { id: 3, author: '사용자', rating: 5, date: '2개월 전', content: '재방문 의사 있어요' },
    ];

    return (
        <div>
            <h3 style={{ color: '#333', marginBottom: '10px', textAlign: 'center' }}>리뷰</h3>
            
            {/* 별점 평균 표시 */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                    {'★'.repeat(5)}
                </div>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    메뉴를 리뷰해 주세요.
                </p>
            </div>

            {/* 리뷰 리스트 */}
            <div style={{ 
                border: '2px solid #007bff',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff'
            }}>
                {sampleReviews.map((review, index) => (
                    <div key={review.id}>
                        <div style={{ padding: '15px 0' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                marginBottom: '8px' 
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#007bff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    marginRight: '12px'
                                }}>
                                    {review.author.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontSize: '15px', 
                                        fontWeight: '500',
                                        color: '#333',
                                        marginBottom: '4px'
                                    }}>
                                        {review.author}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#999' }}>
                                        {review.date}
                                    </div>
                                </div>
                            </div>
                            <div style={{ 
                                color: '#ffc107',
                                fontSize: '14px',
                                marginBottom: '8px',
                                marginLeft: '52px'
                            }}>
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#555',
                                lineHeight: '1.6',
                                marginLeft: '52px'
                            }}>
                                {review.content}
                            </p>
                        </div>
                        {index < sampleReviews.length - 1 && (
                            <div style={{ 
                                borderBottom: '1px solid #e0e0e0'
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsTab;


