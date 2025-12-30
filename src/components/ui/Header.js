
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { ReactComponent as ProfileIcon } from '../../assets/Vector.svg';
import { AuthContext } from '../../context/AuthContext'; // AuthContext 임포트
import axios from 'axios';

const Header = ({ searchTerm, setSearchTerm, onSearch, isMobile }) => {
    const navigate = useNavigate();
    // AuthContext에서 로그인 상태와 logout 함수를 가져옵니다.
    const { isLoggedIn, logout } = useContext(AuthContext);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    // 로그아웃 버튼 클릭 시 실행될 함수
    const handleLogoutClick = async () => {
        try {
            // 1. 백엔드 서버에 로그아웃 요청 전송 (세션 무효화)
            await axios.post('http://localhost:8080/api/auth/logout', {}, {
                withCredentials: true // 세션 쿠키를 함께 전송
            });
            console.log("백엔드 로그아웃 통신 성공");
        } catch (error) {
            console.error("백엔드 로그아웃 요청 실패:", error);
        } finally {
            // 2. 서버 응답 여부와 상관없이 리액트 앱 내의 상태를 로그아웃 처리
            logout(); 
            alert("로그아웃 되었습니다.");
            navigate('/'); // 메인 페이지로 이동
        }
    };

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
            alignItems: 'center',
            height: isMobile ? 'auto' : '40px',
            gap: isMobile ? '10px' : '0',
            zIndex: 100
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                <FaMapMarkerAlt style={{ fontSize: '24px', color: '#E74C3C' }} />
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' }}>CRS</span>
            </Link>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="음식점 검색"
                    style={{
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #ddd',
                        width: isMobile ? '180px' : '250px',
                        paddingRight: '40px',
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    onClick={onSearch}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#007bff',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FaSearch />
                </button>
            </div>

            <nav>
                {isLoggedIn ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button
                            onClick={handleLogoutClick} // 수정된 로그아웃 핸들러 연결
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
        </nav>
    );
};

export default Header;