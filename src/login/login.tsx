import React from "react";
import "./Login.css";
import logo from "../assets/logo.png";

const Login: React.FC = () => {
  return (
    <main className="km-login">
      {/* Logo Section */}
      <header className="km-login__header">
        <img src={logo} alt="K-Merge Logo" className="km-login__logo" />
      </header>

      {/* Card Section */}
      <section className="km-login__card">
        <h2 className="km-login__title">เข้าสู่ระบบ / สร้างบัญชี</h2>

        <form className="km-login__form">
          {/* Username */}
          <div className="km-login__field">
            <label htmlFor="username">อีเมลหรือชื่อผู้ใช้</label>
            <input
              type="text"
              id="username"
              placeholder="ระบุอีเมลหรือชื่อผู้ใช้"
              className="km-login__input"
            />
          </div>

          {/* Password */}
          <div className="km-login__field">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              placeholder="รหัสผ่าน"
              className="km-login__input"
            />
          </div>

          {/* Links */}
          <div className="km-login__links">
            <a href="#">สร้างบัญชี</a>
            <a href="#">ลืมรหัสผ่าน</a>
          </div>

          {/* Login Button */}
          <button type="submit" className="km-login__btn">
            เข้าสู่ระบบ
          </button>

          {/* Divider */}
          <div className="km-login__divider">
            <span>หรือ</span>
          </div>

          {/* Google Login */}
          <button type="button" className="km-login__google">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
            />
            เข้าสู่ระบบด้วยบัญชี Google
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;