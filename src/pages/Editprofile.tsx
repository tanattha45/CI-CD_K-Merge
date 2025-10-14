import React, { useMemo, useRef, useState } from "react";
import "./EditProfile.css";
import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type TabKey = "account" | "contact";

export default function EditProfile() {
  const [tab, setTab] = useState<TabKey>("account");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ----- form states -----
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [email, setEmail] = useState("");
  const [phoneTH, setPhoneTH] = useState("");

  // basic validations (front-end only)
  const emailValid = useMemo(() => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  // Thai phone (mobile): 0[6|8|9]XXXXXXXX OR +66[6|8|9]XXXXXXXX
  const phoneValid = useMemo(() => {
    if (!phoneTH) return true;
    return /^(0[689]\d{8}|\+66[689]\d{8})$/.test(phoneTH.replace(/\s|-/g, ""));
  }, [phoneTH]);

  const pickImage = () => fileRef.current?.click();
  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };
  const clearImage = () => setAvatar(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect API
    const payload = { username, fullName, aboutMe, email, phoneTH, avatar };
    console.log("submit:", payload);
    alert("บันทึกสำเร็จ (demo)");
  };

  return (
    <div className="ep-bg">
      <Navbar />

      <main className="ep-shell">
        {/* Sidebar */}
        <aside className="ep-sidebar">
          <nav className="ep-nav">
            <button
              className={`ep-nav__item ${tab === "account" ? "is-active" : ""}`}
              onClick={() => setTab("account")}
              aria-current={tab === "account" ? "page" : undefined}
            >
              ข้อมูลบัญชี
            </button>
            <button
              className={`ep-nav__item ${tab === "contact" ? "is-active" : ""}`}
              onClick={() => setTab("contact")}
              aria-current={tab === "contact" ? "page" : undefined}
            >
              ข้อมูลติดต่อ
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="ep-content">
          <form className="ep-card" onSubmit={onSubmit}>
            {/* Avatar block (always visible) */}
            <div className="ep-block">
              <div className="ep-block__title">รูปโปรไฟล์</div>
              <div className="ep-avatar">
                <img
                  src={
                    avatar ??
                    "https://ui-avatars.com/api/?name=KM&background=F59E0B&color=ffffff"
                  }
                  alt="avatar"
                />
                <div className="ep-avatar__actions">
                  <button type="button" className="btn btn-primary" onClick={pickImage}>
                    เปลี่ยนรูป
                  </button>
                  {avatar && (
                    <button type="button" className="btn btn-ghost" onClick={clearImage}>
                      ลบรูป
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onImage}
                    hidden
                  />
                </div>
                <p className="ep-help">รองรับ JPG/PNG • แนะนำขนาด 400×400px ขึ้นไป</p>
              </div>
            </div>

            {/* Tabs */}
            {tab === "account" && (
              <div className="ep-block">
                <div className="ep-block__title">ข้อมูลบัญชี</div>

                <div className="ep-grid">
                  <div className="ep-field">
                    <label htmlFor="username">Username</label>
                    <input
                      id="username"
                      type="text"
                      placeholder="ชื่อผู้ใช้ (username)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <p className="ep-hint">ใช้ตัวอักษร a-z, 0-9, เครื่องหมาย “_”</p>
                  </div>

                  <div className="ep-field">
                    <label htmlFor="fullname">Full Name</label>
                    <input
                      id="fullname"
                      type="text"
                      placeholder="ชื่อ-นามสกุล"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="ep-field ep-field--full">
                    <label htmlFor="about">About Me</label>
                    <textarea
                      id="about"
                      rows={5}
                      placeholder="เล่าเกี่ยวกับตัวคุณ ความถนัด งานที่สนใจ ฯลฯ"
                      value={aboutMe}
                      onChange={(e) => setAboutMe(e.target.value)}
                    />
                    <div className="ep-hint-row">
                      <span className="ep-hint">แนะนำ 160–500 ตัวอักษร</span>
                      <span className="ep-count">{aboutMe.length}/500</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "contact" && (
              <div className="ep-block">
                <div className="ep-block__title">ข้อมูลติดต่อ</div>

                <div className="ep-grid">
                  <div className="ep-field">
                    <label htmlFor="email">อีเมลที่ติดต่อได้</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!emailValid}
                    />
                    {!emailValid && (
                      <p className="ep-error">รูปแบบอีเมลไม่ถูกต้อง</p>
                    )}
                  </div>

                  <div className="ep-field">
                    <label htmlFor="phone">เบอร์โทรศัพท์ (ประเทศไทย)</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="เช่น 0891234567 หรือ +66912345678"
                      value={phoneTH}
                      onChange={(e) => setPhoneTH(e.target.value)}
                      aria-invalid={!phoneValid}
                    />
                    {!phoneValid && (
                      <p className="ep-error">
                        รูปแบบเบอร์ไม่ถูกต้อง (เช่น 06/08/09 + 8 หลัก หรือ +66 ตามด้วย 6/8/9 + 8 หลัก)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="ep-actions">
              <button type="button" className="btn btn-ghost" onClick={() => window.history.back()}>
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!emailValid || !phoneValid}
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
