import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

function FindIdPage() {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [code, setCode]     = useState('');
  const [step, setStep]     = useState(1); // 1: 정보입력, 2: 인증번호입력, 3: 결과
  const [maskedId, setMaskedId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('이름과 이메일을 모두 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('/api/users/find-id/send-code', { name, email });
      alert('인증번호가 이메일로 발송되었습니다.');
      setStep(2);
    } catch (error) {
      alert(error.response?.data || '일치하는 회원 정보가 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('/api/users/find-id/verify', { name, email, code });
      setMaskedId(response.data);
      setStep(3);
    } catch (error) {
      alert(error.response?.data || '인증번호가 올바르지 않거나 만료되었습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.logoLink}>
          <FaMapMarkerAlt style={styles.logoIcon} />
          <span style={styles.appName}>CRS</span>
        </Link>
      </div>

      <div style={styles.box}>
        <h2 style={styles.title}>아이디 찾기</h2>

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <input type="text" placeholder="이름" style={styles.inputField}
              value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="가입 시 등록한 이메일" style={styles.inputField}
              value={email} onChange={e => setEmail(e.target.value)} />
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? '발송 중...' : '인증번호 전송'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <p style={styles.infoText}>가입 시 등록한 이메일로 인증번호를 발송했습니다.</p>
            <input type="text" placeholder="인증번호 6자리" style={styles.inputField}
              value={code} onChange={e => setCode(e.target.value)} maxLength={6} />
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? '확인 중...' : '확인'}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={() => setStep(1)}>
              다시 시도
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <p style={styles.infoText}>회원님의 아이디를 찾았습니다.</p>
            <div style={styles.resultBox}>
              <span style={styles.resultId}>{maskedId}</span>
            </div>
            <button style={styles.button} onClick={() => window.location.href = '/login'}>
              로그인하기
            </button>
          </div>
        )}

        <div style={styles.linksContainer}>
          <Link to="/login" style={styles.bottomLink}>로그인</Link>
          <span style={styles.linkSeparator}>|</span>
          <Link to="/reset-password" style={styles.bottomLink}>비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' },
  header: { marginBottom: '20px' },
  logoLink: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' },
  logoIcon: { fontSize: '60px', color: '#E74C3C' },
  appName: { fontSize: '40px', fontWeight: 'bold', color: '#2C3E50' },
  box: { backgroundColor: 'white', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', boxSizing: 'border-box', textAlign: 'center' },
  title: { fontSize: '28px', marginBottom: '30px', color: '#333' },
  inputField: { width: '100%', padding: '12px 10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' },
  button: { display: 'block', width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', marginBottom: '10px', textDecoration: 'none', textAlign: 'center' },
  secondaryButton: { display: 'block', width: '100%', padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  infoText: { color: '#555', fontSize: '15px', marginBottom: '16px' },
  resultBox: { backgroundColor: '#f0f4ff', border: '1px solid #c0d0ff', borderRadius: '8px', padding: '20px', margin: '16px 0 24px' },
  resultId: { fontSize: '26px', fontWeight: 'bold', color: '#007bff' },
  linksContainer: { marginTop: '30px', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  bottomLink: { color: '#007bff', textDecoration: 'none', padding: '0 5px' },
  linkSeparator: { color: '#ccc', margin: '0 5px' },
};

export default FindIdPage;
