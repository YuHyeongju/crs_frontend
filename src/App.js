// src/App.js

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

// React Icons의 지도 핀 아이콘 임포트 (로고용)
import { FaMapMarkerAlt } from 'react-icons/fa'; // 이 부분이 없으면 추가해주세요.

import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 상단 헤더: 로고 (왼쪽)와 로그인 버튼 (오른쪽) */}
        <nav style={{
          padding: '10px 20px',
          borderBottom: '1px solid #ccc',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px'
        }}>
          {/* 로고 영역 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 아이콘 크기는 텍스트 크기에 맞춰 24px 정도로 조정했습니다. */}
            <FaMapMarkerAlt style={{ fontSize: '24px', color: '#E74C3C' }} />
            {/* CRS 텍스트의 글자 크기를 20px로 설정합니다. */}
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' }}>CRS</span>
          </div>

          {/* 검색창 영역 (nav 안에 직접 추가) */}
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '25px', padding: '5px 15px', border: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <input
                    type="text"
                    placeholder="식당 검색..."
                    style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        padding: '5px 0',
                        width: '200px', // 검색창 너비 조정
                        marginRight: '10px'
                    }}
                />
                <FaSearch style={{ color: '#007bff', cursor: 'pointer' }} /> {/* 검색 아이콘 */}
            </div>
          

          {/* 로그인 버튼 */}
          <Link to="/login" style={{
            textDecoration: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            로그인
          </Link>
        </nav>

        {/* 페이지 내용 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;