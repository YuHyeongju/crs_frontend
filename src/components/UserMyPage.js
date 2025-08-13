import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaUser, FaGift, FaHeart, FaCommentDots, FaMapMarkerAlt } from 'react-icons/fa';
import MyInfoPanel from './MyInfoPanel';
import RewardPanel from './RewardPanel';
import BookmarksPanel from './BookmarksPanel';
import MyReviewsPanel from './MyReviewsPanel';

const UserMyPage = () => {
  const [activePanel, setActivePanel] = useState('info');

  const handleMenuClick = (panelName) => {
    setActivePanel(panelName);
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
          <div
            style={styles.menuItem(activePanel === 'info')}
            onClick={() => handleMenuClick('info')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaUser style={styles.menuIcon(activePanel === 'info')} />
              <span>내 정보</span>
            </div>
            <FaChevronRight style={{ color: activePanel === 'info' ? '#007bff' : '#ccc' }} />
          </div>
          <div
            style={styles.menuItem(activePanel === 'rewards')}
            onClick={() => handleMenuClick('rewards')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaGift style={styles.menuIcon(activePanel === 'rewards')} />
              <span>리워드</span>
            </div>
            <FaChevronRight style={{ color: activePanel === 'rewards' ? '#007bff' : '#ccc' }} />
          </div>
          <div
            style={styles.menuItem(activePanel === 'bookmarks')}
            onClick={() => handleMenuClick('bookmarks')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaHeart style={{...styles.menuIcon(activePanel === 'bookmarks'), color: activePanel === 'bookmarks' ? '#dc3545' : '#dc3545'}} />
              <span>즐겨찾기한 식당</span>
            </div>
            <FaChevronRight style={{ color: activePanel === 'bookmarks' ? '#007bff' : '#ccc' }} />
          </div>
          <div
            style={styles.menuItem(activePanel === 'reviews')}
            onClick={() => handleMenuClick('reviews')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaCommentDots style={styles.menuIcon(activePanel === 'reviews')} />
              <span>나의 리뷰</span>
            </div>
            <FaChevronRight style={{ color: activePanel === 'reviews' ? '#007bff' : '#ccc' }} />
          </div>
        </div>

        <div style={styles.panelContainer}>
          {activePanel === 'info' && <MyInfoPanel />}
          {activePanel === 'rewards' && <RewardPanel />}
          {activePanel === 'bookmarks' && <BookmarksPanel />}
          {activePanel === 'reviews' && <MyReviewsPanel />}
        </div>
      </div>
    </div>
  );
};

export default UserMyPage;