// src/pages/Register.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/auth/register`, { // Using proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setMessage(data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3s

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-shell">
          <div className="register-container">
            <h2>สร้างบัญชี</h2>
            <form onSubmit={onSubmit} noValidate autoComplete="on">
              {/* --- ✅ START: Input Fields --- */}
              <div className="reg-field">
                <label htmlFor="username">ชื่อผู้ใช้</label>
                <input 
                  id="username" 
                  name="username" 
                  type="text"
                  placeholder="ระบุชื่อผู้ใช้" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  minLength={3}
                  autoComplete="name" 
                />
              </div>

              <div className="reg-field">
                <label htmlFor="email">อีเมลที่ติดต่อได้</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email"
                  placeholder="ระบุอีเมล" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  autoComplete="email" 
                />
              </div>

              <div className="reg-field">
                <label htmlFor="password">รหัสผ่าน</label>
                <div className="password-wrapper">
                  <input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="ระบุรหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    autoComplete="new-password" 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="reg-field">
                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                <div className="password-wrapper">
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="ระบุรหัสผ่านอีกครั้ง" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    minLength={6}
                    autoComplete="new-password" 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    aria-label={showConfirmPassword ? "ซ่อนยืนยันรหัสผ่าน" : "แสดงยืนยันรหัสผ่าน"}
                    onClick={() => setShowConfirmPassword((s) => !s)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {/* --- ✅ END: Input Fields --- */}

              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
              {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

              <button className="reg-submit" type="submit" disabled={loading}>
                {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}