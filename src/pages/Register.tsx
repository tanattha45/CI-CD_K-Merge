import Navbar from "../components/Navbar";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./register.css";


type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: "", email: "", password: "", confirmPassword: "", phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange =
    (field: keyof RegisterForm) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit", form);
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-shell">
          <div className="register-container">
            <h2>สร้างบัญชี</h2>
            <form onSubmit={onSubmit} noValidate autoComplete="on">
              <div className="reg-field">
                <label htmlFor="username">ชื่อผู้ใช้</label>
                <input id="username" name="username" type="text"
                  placeholder="ระบุชื่อผู้ใช้" value={form.username}
                  onChange={onChange("username")} required minLength={3}
                  autoComplete="username" />
              </div>

              <div className="reg-field">
                <label htmlFor="email">อีเมลที่ติดต่อได้</label>
                <input id="email" name="email" type="email"
                  placeholder="ระบุอีเมล" value={form.email}
                  onChange={onChange("email")} required autoComplete="email" />
              </div>

              <div className="reg-field password-field">
                <label htmlFor="password">รหัสผ่าน</label>
                <div className="password-wrapper">
                  <input id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="ระบุรหัสผ่าน" value={form.password}
                    onChange={onChange("password")} required minLength={6}
                    autoComplete="new-password" />
                  <button type="button" className="toggle-password"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="reg-field password-field">
                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                <div className="password-wrapper">
                  <input id="confirmPassword" name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="ระบุยืนยันรหัสผ่าน" value={form.confirmPassword}
                    onChange={onChange("confirmPassword")} required minLength={6}
                    autoComplete="new-password" />
                  <button type="button" className="toggle-password"
                    aria-label={showConfirmPassword ? "ซ่อนยืนยันรหัสผ่าน" : "แสดงยืนยันรหัสผ่าน"}
                    onClick={() => setShowConfirmPassword((s) => !s)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="reg-field">
                <label htmlFor="phone">เบอร์โทรศัพท์ (ถ้ามี)</label>
                <input id="phone" name="phone" type="tel"
                  placeholder="ระบุเบอร์โทร" value={form.phone}
                  onChange={onChange("phone")} autoComplete="tel" inputMode="tel" />
              </div>

              <button className="reg-submit" type="submit">สร้างบัญชี</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
