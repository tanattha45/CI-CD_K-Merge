// src/pages/Register.tsx
import { useState, useMemo, type FormEvent } from "react"; // Import useMemo
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./register.css";

// --- Password Validation Helpers ---
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("Must be at least 8 characters long.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Must contain at least one lowercase letter.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain at least one uppercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Must contain at least one number.");
  }
  // Matches any character that is NOT a letter, number, or whitespace
  if (!/[^A-Za-z0-9\s]/.test(password)) { 
    errors.push("Must contain at least one special character.");
  }
  return errors;
};
// --- End Password Validation Helpers ---


export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null); // General API error
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]); // Specific password errors
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null); // Confirm password error
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Client-side validation ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
    // Also re-validate confirm password if it has a value
    if (confirmPassword) {
      setConfirmPasswordError(newPassword !== confirmPassword ? "Passwords do not match." : null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(password !== newConfirmPassword ? "Passwords do not match." : null);
  };
  // --- End Client-side validation ---

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // --- Trigger final validation checks before submit ---
    const currentPasswordErrors = validatePassword(password);
    setPasswordErrors(currentPasswordErrors);
    const currentConfirmError = password !== confirmPassword ? "Passwords do not match." : null;
    setConfirmPasswordError(currentConfirmError);
    
    if (currentPasswordErrors.length > 0 || currentConfirmError) {
       setError("Please fix the errors in the form."); // General form error hint
      return; 
    }
    // --- End final validation checks ---
    
    setLoading(true);
    try {
      const response = await fetch(`/auth/register`, { // Using proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend validation errors (e.g., email already exists)
        // class-validator typically returns an array in `message` under `error`
        let backendError = 'Registration failed.';
        if (data.message && Array.isArray(data.message) && data.message.length > 0) {
            backendError = data.message.join(' '); 
        } else if (typeof data.message === 'string') {
            backendError = data.message;
        }
        throw new Error(backendError);
      }

      setMessage(data.message || 'Registration successful! Check your email to verify. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3s

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Disable submit if loading or if there are client-side errors
  const canSubmit = useMemo(() => {
    return !loading && passwordErrors.length === 0 && !confirmPasswordError && password !== '';
  }, [loading, passwordErrors, confirmPasswordError, password]);

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-shell">
          <div className="register-container">
            <h2>สร้างบัญชี</h2>
            <form onSubmit={onSubmit} noValidate autoComplete="off"> {/* Changed autoComplete */}
              {/* --- Name and Email Fields (Unchanged) --- */}
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
              {/* --- End Name and Email Fields --- */}


              {/* --- Password Field --- */}
              <div className="reg-field">
                <label htmlFor="password">รหัสผ่าน</label>
                <div className="password-wrapper">
                  <input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" // Updated placeholder
                    value={password}
                    // Use the handler for validation
                    onChange={handlePasswordChange}  
                    required 
                    // Update minLength attribute for browser hints (optional but good practice)
                    minLength={8} 
                    autoComplete="new-password" 
                    // Indicate invalid state for accessibility and styling
                    aria-invalid={passwordErrors.length > 0} 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Display password errors */}
                {passwordErrors.length > 0 && (
                  <ul style={{ color: 'red', fontSize: '0.8em', listStyle: 'disc', paddingLeft: '20px', margin: '5px 0 0' }}>
                    {passwordErrors.map((err, index) => <li key={index}>{err}</li>)}
                  </ul>
                )}
              </div>
              {/* --- End Password Field --- */}


              {/* --- Confirm Password Field --- */}
              <div className="reg-field">
                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                <div className="password-wrapper">
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password" // Updated placeholder
                    value={confirmPassword}
                    // Use the handler for validation
                    onChange={handleConfirmPasswordChange} 
                    required 
                    // Update minLength attribute
                    minLength={8} 
                    autoComplete="new-password" 
                    // Indicate invalid state
                    aria-invalid={!!confirmPasswordError}
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    aria-label={showConfirmPassword ? "ซ่อนยืนยันรหัสผ่าน" : "แสดงยืนยันรหัสผ่าน"}
                    onClick={() => setShowConfirmPassword((s) => !s)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                 {/* Display confirm password error */}
                {confirmPasswordError && <p style={{ color: 'red', fontSize: '0.8em', margin: '5px 0 0' }}>{confirmPasswordError}</p>}
              </div>
              {/* --- End Confirm Password Field --- */}

              {/* Display general API/form errors */}
              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
              {/* Display success message */}
              {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

              <button className="reg-submit" type="submit" disabled={!canSubmit}>
                {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Footer component should be placed outside register-page if you want it full width */}
      {/* <Footer /> */} 
    </>
  );
}