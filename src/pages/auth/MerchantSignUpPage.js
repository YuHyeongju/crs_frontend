
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function MerchantSignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '', pw: '', confirmPw: '', name: '', email: '', phone: '', gender: '', businessNum: ''
    });
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [pwError, setPwError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [bizError, setBizError] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setPasswordMatch(formData.pw === '' || formData.confirmPw === '' ? true : formData.pw === formData.confirmPw);
    }, [formData.pw, formData.confirmPw]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormError('');

        if (name === 'businessNum') {
            const num = value.replace(/[^0-9]/g, '');
            let formatNum = num.length <= 3 ? num : num.length <= 5 ? `${num.slice(0, 3)}-${num.slice(3)}` : `${num.slice(0, 3)}-${num.slice(3, 5)}-${num.slice(5, 10)}`;
            setFormData({ ...formData, [name]: formatNum });
            setBizError(num.length > 0 && num.length < 10 ? '사업자 번호 10자리를 입력해주세요.' : '');

        } else if (name === 'pw') {
           
            const isValid = PW_REGEX.test(value); 
            setPwError(value !== '' && !isValid ? '8자 이상, 대소문자, 숫자, 특수문자 포함 필수' : '');
            setFormData({ ...formData, [name]: value });

        } else if (name === 'phone') {
            const num = value.replace(/[^0-9]/g, '');
            let res = num.length <= 3 ? num : num.length <= 7 ? `${num.slice(0, 3)}-${num.slice(3)}` : `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
            setFormData({ ...formData, [name]: res });
            
            setPhoneError(res !== '' && res.length < 13 ? '전화번호 형식이 올바르지 않습니다.' : '');

        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pwError || bizError || phoneError || !passwordMatch || !formData.gender) {
            setFormError('입력 내용을 다시 확인해주세요.');
            return;
        }
        try {
            const res = await axios.post("/api/auth/register/merchant", formData);
            if (res.status === 201 || res.status === 200) {
                alert('상인 회원가입이 완료되었습니다!');
                navigate("/login");
            }
        } catch (err) {
            setFormError(err.response?.data || '서버 오류가 발생했습니다.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.appHeader}><Link to="/" style={styles.logoLink}><FaMapMarkerAlt style={styles.logoIcon} /><span style={styles.appName}>CRS</span></Link></div>
            <div style={styles.signUpBox}>
                <h2 style={styles.title}>상인 회원가입</h2>
                {formError && <p style={styles.errorBanner}>{formError}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}><label style={styles.label}>사업자 번호</label><input type="text" name="businessNum" value={formData.businessNum} placeholder="숫자 10자리" onChange={handleChange} required style={styles.input} />{bizError && <p style={styles.errorMessage}>{bizError}</p>}</div>
                    <div style={styles.inputGroup}><label style={styles.label}>아이디</label><input type="text" name="id" value={formData.id} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>비밀번호</label><input type="password" name="pw" value={formData.pw} onChange={handleChange} required style={styles.input} />{pwError && <p style={styles.errorMessage}>{pwError}</p>}</div>
                    <div style={styles.inputGroup}><label style={styles.label}>비밀번호 확인</label><input type="password" name="confirmPw" value={formData.confirmPw} onChange={handleChange} required style={styles.input} />{!passwordMatch && <p style={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>}</div>
                    <div style={styles.inputGroup}><label style={styles.label}>이름</label><input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>성별</label><div style={styles.genderContainer}>
                        <label style={{ ...styles.genderLabel, ...(formData.gender === 'male' && styles.genderLabelChecked) }}><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} style={styles.radio} /> 남자</label>
                        <label style={{ ...styles.genderLabel, ...(formData.gender === 'female' && styles.genderLabelChecked) }}><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} style={styles.radio} /> 여자</label>
                    </div></div>
                    <div style={styles.inputGroup}><label style={styles.label}>이메일</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>전화번호</label><input type="tel" name="phone" value={formData.phone} placeholder="010-0000-0000" onChange={handleChange} required style={styles.input} />{phoneError && <p style={styles.errorMessage}>{phoneError}</p>}</div>
                    <button type="submit" style={styles.submitButton}>상인 등록 완료</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingTop: '80px', boxSizing: 'border-box' },
    appHeader: { position: 'absolute', top: 0, left: 0, width: '100%', padding: '10px 20px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '60px', zIndex: 100, boxSizing: 'border-box' },
    logoLink: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' },
    logoIcon: { fontSize: '24px', color: '#E74C3C' },
    appName: { fontSize: '20px', fontWeight: 'bold', color: '#2C3E50' },
    signUpBox: { backgroundColor: 'white', padding: '40px 30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', boxSizing: 'border-box', textAlign: 'center' },
    title: { fontSize: '28px', marginBottom: '30px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
    input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' },
    genderContainer: { display: 'flex', gap: '10px', marginTop: '5px' },
    genderLabel: { flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#f9f9f9', transition: 'background-color 0.2s, border-color 0.2s', fontSize: '16px' },
    genderLabelChecked: { backgroundColor: '#e0f7fa', borderColor: '#007bff' },
    radio: { marginRight: '8px', cursor: 'pointer' },
    submitButton: { padding: '15px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '20px', cursor: 'pointer', transition: 'background-color 0.3s ease', marginTop: '20px' },
    errorMessage: { color: 'red', fontSize: '13px', marginTop: '5px' },
    errorBanner: { color: '#e74c3c', backgroundColor: '#fdeded', border: '1px solid #e74c3c', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'left' }
};

export default MerchantSignUpPage;