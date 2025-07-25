import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



import HomePage from './pages/HomePage';    // 메인 페이지
import LoginPage from './pages/LoginPage'; // 로그인 페이지
import UserTypeSelectionPage from './pages/UserTypeSelectionPage'; // 사용자 유형 선택 페이지
import GeneralTermsPage from './pages/GeneralTermsPage';   // 일반 사용자 약관 페이지
import MerchantTermsPage from './pages/MerchantTermsPage'; // 상인 약관 페이지
import AdminTermsPage from './pages/AdminTermsPage';       // 관리자 약관 페이지

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 페이지 내용 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/usertypeselection" element={<UserTypeSelectionPage />} />
          <Route path="/terms/general" element={<GeneralTermsPage />} />
          <Route path="/terms/merchant" element={<MerchantTermsPage />} />
          <Route path="/terms/admin" element={<AdminTermsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;