import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';                                    // 메인 페이지
import LoginPage from './pages/LoginPage';                                  // 로그인 페이지
import UserTypeSelectionPage from './pages/UserTypeSelectionPage';          // 사용자 유형 선택 페이지
import GeneralTermsPage from './pages/GeneralTermsPage';                    // 일반 사용자 약관 페이지
import MerchantTermsPage from './pages/MerchantTermsPage';                  // 상인 약관 페이지
import AdminTermsPage from './pages/AdminTermsPage';                        // 관리자 약관 페이지
import GeneralSignUpPage from './pages/GeneralSignUpPage';                  // 일반 사용자 회원가입 페이지
import MerchantSignUpPage from './pages/MerchantSignUpPage';                // 상인 회원가입 페이지
import AdminSignUpPage from './pages/AdminSignUpPage';                      // 관리자 회원가입 페이지
import MyPage from './pages/MyPage';                                        // 마이페이지
import { AuthProvider } from './context/AuthContext';                       // 인증 상태 관리 
import MerchantSelectPanel from './components/MerchantSelectPanel';         // 식당 선택 컴포넌트 추가
import MerchantEditDeletePanel from './components/MerchantEditDeletePanel'; // 식당 수정/삭제 컴포넌트 추가
import MerchantRegisterPanel from './components/MerchantRegisterPanel';     // 식당 등록 컴포넌트 추가
import RestaurantDetailPage from './pages/RestaurantDetailPage';            // 식당 상세보기 페이지

function App() {
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const handleSelectStore = (id) => {
    setSelectedStoreId(id);
  };
  
  const clearSelectedStore = () => {
    setSelectedStoreId(null);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/usertypeselection" element={<UserTypeSelectionPage />} />
            <Route path="/terms/general" element={<GeneralTermsPage />} />
            <Route path="/terms/merchant" element={<MerchantTermsPage />} />
            <Route path="/terms/admin" element={<AdminTermsPage />} />
            <Route path="/signup/general" element={<GeneralSignUpPage />} />
            <Route path="/signup/merchant" element={<MerchantSignUpPage />} />
            <Route path="/signup/admin" element={<AdminSignUpPage />} />
            <Route path="/mypage" element={<MyPage />} />
            {/* 상인 전용 라우트 */}
            <Route path="/merchant/register" element={<MerchantRegisterPanel />} />
            <Route path="/merchant/manage" element={
              selectedStoreId ? (
                <MerchantEditDeletePanel storeId={selectedStoreId} clearSelectedStore={clearSelectedStore} />
              ) : (
                <MerchantSelectPanel onSelectStore={handleSelectStore} />
              )
            } />
            <Route path="/restaurant-detail/:id" element={<RestaurantDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

