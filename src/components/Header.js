import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { ReactComponent as ProfileIcon } from '../assets/Vector.svg';

const Header = ({ searchTerm, setSearchTerm, handleKeywordSearch, isLoggedIn, handleLogout, isMobile }) => {
    return (
        <nav style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '98vw',
            padding: isMobile ? '10px' : '10px 20px',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            alignItems: isMobile ? 'center' : 'center',
            height: isMobile ? 'auto' : '40px',
            gap: isMobile ? '10px' : '0',
            zIndex: 100
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                <FaMapMarkerAlt style={{ fontSize: '24px', color: '#E74C3C' }} />
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' }}>
                    CRS
                </span>
            </Link>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '25px',
                padding: '5px 15px',
                border: '1px solid #ddd',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: isMobile ? '90%' : 'auto',
                maxWidth: '400px'
            }}>
                <input
                    type="text"
                    placeholder="식당 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleKeywordSearch();
                        }
                    }}
                    style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        padding: '5px 0',
                        width: '100%',
                        marginRight: '10px'
                    }}
                />
                <FaSearch
                    onClick={handleKeywordSearch}
                    style={{ color: '#007bff', cursor: 'pointer' }}
                />
            </div>
            {isLoggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        로그아웃
                    </button>
                    <Link to="/mypage" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ProfileIcon style={{ width: '80%', height: '100%' }} />
                    </Link>
                </div>
            ) : (
                <Link to="/login" style={{ textDecoration: 'none', backgroundColor: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
                    로그인
                </Link>
            )}
        </nav>
    );
};

export default Header;