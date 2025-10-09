import { useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./profile.css";
import Navbar from "../components/Navbar";

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const onPickImage = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          {/* ===== Left card ===== */}
          <aside className="profile-left">
            {/* ปุ่ม Edit แบบตัวอักษร */}
            <button type="button" className="edit-btn">
              Edit
            </button>

            {/* กรอบรูป */}
            <div
              className="avatar-wrap"
              onClick={onPickImage}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onPickImage()}
            >
              {avatarUrl ? (
                <img className="avatar" src={avatarUrl} alt="avatar" />
              ) : (
                <div className="avatar-placeholder">Add photo</div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden-file"
                onChange={onFileChange}
              />
            </div>

            {/* รหัสสองแถวในพื้นส้ม (ให้คลาสตรงกับ CSS) */}
            <div className="two-codes">
              <span className="code">XXXXXX</span>
              <span className="code">XXXXXX</span>
            </div>

            {/* พื้นขาวด้านล่าง */}
            <div className="profile-left-bottom">
              <div className="socials">
                <a href="#" className="social" aria-label="facebook">
                  <FaFacebookF />
                </a>
                <a href="#" className="social" aria-label="instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social" aria-label="linkedin">
                  <FaLinkedinIn />
                </a>
              </div>
              <div className="copy">Copyright ©2025 All rights reserved</div>
            </div>
          </aside>

          {/* ===== Right content ===== */}
          <section className="profile-right">
            <h1 className="title">My name is Brian</h1>
            <h2 className="subtitle">I'm 24 years old, I'm from Korea</h2>
            <p className="bio">
              and right&apos;s top from wine And the love is cool Unknow for most
              kind and time, Hello phone and the night, Just came off for more
              inside Was caters true? In the form of a star vacation This camera I
              love you
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
