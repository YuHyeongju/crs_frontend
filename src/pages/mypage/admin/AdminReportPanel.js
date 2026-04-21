
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReportPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admins/reports');
      setReports(response.data);
    } catch (err) {
      setError('리뷰 신고 목록을 불러오는 데 실패했습니다.');
      console.error('Failed to fetch review reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const processReport = async (reportIdx, approve) => {
    if (window.confirm(`정말로 이 신고를 ${approve ? '승인' : '거절'}하시겠습니까?`)) {
      try {
        await axios.post(`/api/admins/reports/${reportIdx}/process`, null, { params: { approve } });
        alert(`신고가 성공적으로 ${approve ? '승인' : '거절'}되었습니다.`);
        fetchReports(); // Refresh the list
      } catch (err) {
        setError(`신고 처리 중 오류가 발생했습니다: ${err.response?.data || err.message}`);
        console.error('Failed to process report:', err);
      }
    }
  };

  const styles = {
    panel: { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    tableHeader: { backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6' },
    tableCell: { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontSize: '14px', color: '#555' },
    contentCell: { width: '25%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    actionCell: { width: '150px', textAlign: 'center' },
    button: { padding: '8px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '0 5px' },
    approveButton: { backgroundColor: '#28a745', color: 'white' },
    rejectButton: { backgroundColor: '#dc3545', color: 'white' },
    disabledButton: { backgroundColor: '#cccccc', color: '#666666', cursor: 'not-allowed' },
    statusPending: { color: '#ffc107', fontWeight: 'bold' },
    statusApproved: { color: '#28a745', fontWeight: 'bold' },
    statusRejected: { color: '#dc3545', fontWeight: 'bold' },
  };

  if (loading) {
    return <div style={styles.panel}>로딩 중...</div>;
  }

  if (error) {
    return <div style={styles.panel}><div style={{ color: 'red' }}>오류: {error}</div></div>;
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>리뷰 신고 처리</div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>신고 ID</th>
            <th style={styles.tableCell}>리뷰 ID</th>
            <th style={styles.tableCell}>신고자 ID</th>
            <th style={styles.tableCell}>신고 사유</th>
            <th style={styles.tableCell}>리뷰 내용</th>
            <th style={styles.tableCell}>상태</th>
            <th style={{ ...styles.tableCell, ...styles.actionCell }}>처리</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.reportIdx}>
                <td style={styles.tableCell}>{report.reportIdx}</td>
                <td style={styles.tableCell}>{report.reviewId}</td>
                <td style={styles.tableCell}>{report.reporterId}</td>
                <td style={styles.tableCell}>{report.reason}</td>
                <td style={{ ...styles.tableCell, ...styles.contentCell }}>{report.content}</td>
                <td style={styles.tableCell}>
                  <span style={
                    report.status === 'PENDING' ? styles.statusPending :
                    report.status === 'APPROVED' ? styles.statusApproved :
                    report.status === 'REJECTED' ? styles.statusRejected : {}
                  }>
                    {report.status === 'PENDING' ? '대기 중' :
                     report.status === 'APPROVED' ? '승인됨' :
                     report.status === 'REJECTED' ? '거절됨' : report.status}
                  </span>
                </td>
                <td style={{ ...styles.tableCell, ...styles.actionCell }}>
                  <button
                    onClick={() => processReport(report.reportIdx, true)}
                    style={{ ...styles.button, ...styles.approveButton, ...(report.status !== 'PENDING' && styles.disabledButton) }}
                    disabled={report.status !== 'PENDING'}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => processReport(report.reportIdx, false)}
                    style={{ ...styles.button, ...styles.rejectButton, ...(report.status !== 'PENDING' && styles.disabledButton) }}
                    disabled={report.status !== 'PENDING'}
                  >
                    거절
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>처리할 리뷰 신고가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReportPanel;
