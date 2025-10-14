import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

type TabKey = "account" | "contact";

export default function EditProfile() {
  const [tab, setTab] = useState<TabKey>("account");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();

  // ----- form states -----
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [aboutMe, setAboutMe] = useState(user?.user_metadata?.about || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneTH, setPhoneTH] = useState(user?.user_metadata?.phone || "");
  const [loading, setLoading] = useState(false);

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
  const compressImage = async (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const compressed = await compressImage(file);
      setAvatar(compressed);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('รูปภาพมีปัญหา กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };
  const clearImage = () => setAvatar(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      // Handle avatar (already compressed and in data URL format)
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const payload = {
        full_name: fullName,
        username: username,
        about: aboutMe,
        phone: phoneTH.replace(/\s|-/g, ""),
        avatar: formData.get('avatar')?.toString()
      };

      const res = await fetch('/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      await refetchUser();
      alert("บันทึกสำเร็จ");
      navigate('/profile');

    } catch (error) {
      console.error('Error updating profile:', error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
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
            <button
              className={`ep-nav__item ${tab === "account" ? "is-active" : ""}`}
              onClick={() => setTab("account")}
              aria-current={tab === "account" ? "page" : undefined}
            >
              ข้อมูลบัญชี
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
                disabled={!emailValid || !phoneValid || loading}
              >
                {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
