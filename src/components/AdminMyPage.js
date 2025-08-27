import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaStore, FaUserCog, FaExclamationCircle, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';

// 관리자용 서브 컴포넌트들을 import합니다.
import AdminMyInfoPanel from '../components/AdminMyInfoPanel';
import AdminStorePanel from '../components/AdminStorePanel';
import AdminUserPanel from '../components/AdminUserPanel';
import AdminReportPanel from '../components/AdminReportPanel';

const AdminMyPage = () => {
  const [activePanel, setActivePanel] = useState('info');

  const handleMenuClick = (panelName) => {
    setActivePanel(panelName);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'info':
        return <AdminMyInfoPanel />;
      case 'store':
        return <AdminStorePanel />;
      case 'user':
        return <AdminUserPanel />;
      case 'report':
        return <AdminReportPanel />;
      default:
        return <AdminMyInfoPanel />;
    }
  };

  const styles = {
    mainWrapper: { display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', alignItems: 'center' },
    logoContainer: { width: '100%', maxWidth: '1120px', marginBottom: '20px', textAlign: 'left' },
    logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center' },
    logoIcon: { fontSize: '24px', color: '#dc3545', marginRight: '8px' },
    appName: { fontSize: '24px', fontWeight: 'bold', color: '#2C3E50' },
    contentContainer: { display: 'flex', width: '100%', maxWidth: '1120px' },
    menuContainer: { width: '300px', marginRight: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', height: 'fit-content', padding: '10px 0' },
    menuItem: (isActive) => ({
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', cursor: 'pointer', fontSize: '16px',
      color: isActive ? '#007bff' : '#444', backgroundColor: isActive ? '#e6f5ff' : 'white',
      borderLeft: isActive ? '4px solid #007bff' : '4px solid transparent', transition: 'all 0.2s ease', fontWeight: isActive ? 'bold' : 'normal',
    }),
    menuIcon: (isActive) => ({ marginRight: '15px', fontSize: '20px', color: isActive ? '#007bff' : '#555' }),
    panelContainer: { flexGrow: 1, maxWidth: '800px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '30px' },
  };

  return (
    <div style={styles.mainWrapper}>
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logoLink}>
          <FaMapMarkerAlt style={styles.logoIcon} />
          <span style={styles.appName}>CRS</span>
        </Link>
      </div>
      <div style={styles.contentContainer}>
        <div style={styles.menuContainer}>
          <div style={styles.menuItem(activePanel === 'info')} onClick={() => handleMenuClick('info')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaUserShield style={styles.menuIcon(activePanel === 'info')} /><span>내 정보</span></div>
            <FaChevronRight style={{ color: activePanel === 'info' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'store')} onClick={() => handleMenuClick('store')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaStore style={styles.menuIcon(activePanel === 'store')} /><span>식당 관리</span></div>
            <FaChevronRight style={{ color: activePanel === 'store' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'user')} onClick={() => handleMenuClick('user')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaUserCog style={styles.menuIcon(activePanel === 'user')} /><span>사용자 관리</span></div>
            <FaChevronRight style={{ color: activePanel === 'user' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'report')} onClick={() => handleMenuClick('report')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaExclamationCircle style={styles.menuIcon(activePanel === 'report')} /><span>리뷰 신고 처리</span></div>
            <FaChevronRight style={{ color: activePanel === 'report' ? '#007bff' : '#ccc' }} />
          </div>
        </div>
        <div style={styles.panelContainer}>
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default AdminMyPage;