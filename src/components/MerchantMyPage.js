import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaUser, FaStore, FaChartLine, FaGift, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import MerchantMyInfoPanel from '../components/MerchantMyInfoPanel';
import MerchantRegisterPanel from '../components/MerchantRegisterPanel';
import MerchantEditDeletePanel from '../components/MerchantEditDeletePanel';
import MerchantCongestionPanel from '../components/MerchantCongestionPanel';
import MerchantSelectPanel from '../components/MerchantSelectPanel'; // 식당 선택 패널
import RewardPanel from '../components/RewardPanel';

const MerchantMyPage = () => {
  const [activePanel, setActivePanel] = useState('info');
  const [selectedStoreId, setSelectedStoreId] = useState(null); // 식당 ID를 저장할 상태 추가

  const handleMenuClick = (panelName) => {
    // 다른 메뉴로 이동할 때 selectedStoreId 초기화
    if (panelName !== 'manage') {
      setSelectedStoreId(null);
    }
    setActivePanel(panelName);
  };
  
  // 식당 수정/삭제 패널에서 목록으로 돌아갈 때 호출
  const handleBackToSelect = () => {
      setSelectedStoreId(null);
  };

  const styles = {
    mainWrapper: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      alignItems: 'center',
    },
    logoContainer: {
      width: '100%',
      maxWidth: '1120px',
      marginBottom: '20px',
      textAlign: 'left',
    },
    logoLink: {
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
    },
    logoIcon: {
      fontSize: '24px',
      color: '#dc3545',
      marginRight: '8px',
    },
    appName: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2C3E50',
    },
    contentContainer: {
      display: 'flex',
      width: '100%',
      maxWidth: '1120px',
    },
    menuContainer: {
      width: '300px',
      marginRight: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      height: 'fit-content',
      padding: '10px 0',
    },
    menuItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 20px',
      cursor: 'pointer',
      fontSize: '16px',
      color: isActive ? '#007bff' : '#444',
      backgroundColor: isActive ? '#e6f5ff' : 'white',
      borderLeft: isActive ? '4px solid #007bff' : '4px solid transparent',
      transition: 'all 0.2s ease',
      fontWeight: isActive ? 'bold' : 'normal',
    }),
    menuIcon: (isActive) => ({
      marginRight: '15px',
      fontSize: '20px',
      color: isActive ? '#007bff' : '#555',
    }),
    panelContainer: {
      flexGrow: 1,
      maxWidth: '800px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      padding: '30px',
    },
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'info':
        return <MerchantMyInfoPanel />;
      case 'congestion':
        return <MerchantCongestionPanel />;
      case 'reward':
        return <RewardPanel />;
      case 'register':
        return <MerchantRegisterPanel />;
      case 'manage':
        // 식당 ID가 있으면 수정/삭제 패널을, 없으면 선택 패널을 보여줍니다.
        return selectedStoreId ? (
          <MerchantEditDeletePanel storeId={selectedStoreId} clearSelectedStore={handleBackToSelect} />
        ) : (
          <MerchantSelectPanel onSelectStore={setSelectedStoreId} />
        );
      default:
        return <MerchantMyInfoPanel />;
    }
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
            <div style={{ display: 'flex', alignItems: 'center' }}><FaUser style={styles.menuIcon(activePanel === 'info')} /><span>내 정보</span></div>
            <FaChevronRight style={{ color: activePanel === 'info' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'congestion')} onClick={() => handleMenuClick('congestion')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaChartLine style={styles.menuIcon(activePanel === 'congestion')} /><span>혼잡도 입력 내역</span></div>
            <FaChevronRight style={{ color: activePanel === 'congestion' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'reward')} onClick={() => handleMenuClick('reward')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaGift style={styles.menuIcon(activePanel === 'reward')} /><span>리워드</span></div>
            <FaChevronRight style={{ color: activePanel === 'reward' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'register')} onClick={() => handleMenuClick('register')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaPlus style={styles.menuIcon(activePanel === 'register')} /><span>식당 등록</span></div>
            <FaChevronRight style={{ color: activePanel === 'register' ? '#007bff' : '#ccc' }} />
          </div>
          <div style={styles.menuItem(activePanel === 'manage')} onClick={() => handleMenuClick('manage')}>
            <div style={{ display: 'flex', alignItems: 'center' }}><FaStore style={styles.menuIcon(activePanel === 'manage')} /><span>식당 수정 / 삭제</span></div>
            <FaChevronRight style={{ color: activePanel === 'manage' ? '#007bff' : '#ccc' }} />
          </div>
        </div>

        <div style={styles.panelContainer}>
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default MerchantMyPage;