
import React, { useState } from 'react';

// 와이어프레임에 맞춰 더미 신고 데이터 생성
const dummyReports = [
  { id: 1, reviewId: 'review101', reporterId: 'user123', targetId: 'user456', reason: '욕설 및 비방', content: '음식이 너무 별로네요. 사장님은...' },
  { id: 2, reviewId: 'review102', reporterId: 'user789', targetId: 'user123', reason: '허위 사실 유포', content: '이 식당은 위생이 최악입니다. 바퀴벌레도 봤어요.' },
  { id: 3, reviewId: 'review103', reporterId: 'user456', targetId: 'user789', reason: '불법 광고', content: '맛있으면 제 블로그로 오세요! (블로그 URL)' },
];

const AdminReportPanel = () => {
  const [reports, setReports] = useState(dummyReports);

  const handleDelete = (reportId) => {
    if (window.confirm(`리뷰 신고 ID ${reportId}를 삭제하시겠습니까?`)) {
      alert(`리뷰 ID ${reportId}가 삭제되었습니다.`);
      // 실제로는 서버 API를 호출하여 리뷰를 삭제하는 로직을 구현합니다.
      setReports(reports.filter(report => report.id !== reportId));
    }
  };

  const styles = {
    panel: { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    tableHeader: { backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6' },
    tableCell: { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontSize: '14px', color: '#555' },
    contentCell: { width: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    actionCell: { width: '80px', textAlign: 'center' },
    deleteButton: { padding: '8px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#dc3545', color: 'white' },
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>리뷰 신고 처리</div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>리뷰 ID</th>
            <th style={styles.tableCell}>신고자 ID</th>
            <th style={styles.tableCell}>신고 대상자 ID</th>
            <th style={styles.tableCell}>신고 사유</th>
            <th style={styles.tableCell}>리뷰 내용</th>
            <th style={{ ...styles.tableCell, ...styles.actionCell }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id}>
                <td style={styles.tableCell}>{report.reviewId}</td>
                <td style={styles.tableCell}>{report.reporterId}</td>
                <td style={styles.tableCell}>{report.targetId}</td>
                <td style={styles.tableCell}>{report.reason}</td>
                <td style={{ ...styles.tableCell, ...styles.contentCell }}>{report.content}</td>
                <td style={{ ...styles.tableCell, ...styles.actionCell }}>
                  <button onClick={() => handleDelete(report.id)} style={styles.deleteButton}>삭제</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>처리할 리뷰 신고가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReportPanel;