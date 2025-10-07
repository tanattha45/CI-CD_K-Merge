import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./register.css";
import logo from "../assets/logo.png";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // state สำหรับสลับการแสดงรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit", form);
  };

  return (
    <div className="register-page">
      <div className="register-shell">
        {/* โลโก้ K-Merge */}
        <img src={logo} alt="K-Merge" className="register-logo" />

        <div className="register-container">
          <h2>สร้างบัญชี</h2>

          <form onSubmit={onSubmit}>
            <div className="reg-field">
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                placeholder="ระบุชื่อผู้ใช้"
                value={form.username}
                onChange={onChange("username")}
              />
            </div>

            <div className="reg-field">
              <label>อีเมลที่ติดต่อได้</label>
              <input
                type="email"
                placeholder="ระบุอีเมล"
                value={form.email}
                onChange={onChange("email")}
              />
            </div>

            {/* ช่องรหัสผ่าน */}
            <div className="reg-field password-field">
              <label>รหัสผ่าน</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="ระบุรหัสผ่าน"
                  value={form.password}
                  onChange={onChange("password")}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            {/* ช่องยืนยันรหัสผ่าน */}
            <div className="reg-field password-field">
              <label>ยืนยันรหัสผ่าน</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="ระบุยืนยันรหัสผ่าน"
                  value={form.confirmPassword}
                  onChange={onChange("confirmPassword")}
                />
                <span
                  className="toggle-password"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <div className="reg-field">
              <label>เบอร์โทรศัพท์ (ถ้ามี)</label>
              <input
                type="tel"
                placeholder="ระบุเบอร์โทร"
                value={form.phone}
                onChange={onChange("phone")}
              />
            </div>

            <button className="reg-submit" type="submit">
              สร้างบัญชี
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
