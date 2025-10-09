import React, { useRef, useState } from "react";
import "./EditProfile.css";
import logo from "../assets/logo.png"; // ✅ เพิ่ม import โลโก้

export default function EditProfile() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickImage = () => fileInputRef.current?.click();
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="edit-bg">
      <div className="edit-container">
        {/* ✅ โลโก้ตรงกลาง */}
        <div className="edit-logo">
          <img src={logo} alt="K-Merge logo" className="logo-img" />
        </div>

        {/* กล่องฟอร์ม */}
        <div className="edit-card">
          <div className="edit-avatar">
            <img
              src={avatar ?? "https://ui-avatars.com/api/?name=KM&background=F59E0B&color=fff"}
              alt="avatar"
            />
            <button type="button" className="edit-btn" onClick={handlePickImage}>
              edit picture
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </div>

          <form className="edit-form">
            <label>ชื่อผู้ใช้</label>
            <input type="text" placeholder="ชื่อผู้ใช้" />

            <label>อีเมลที่ติดต่อได้</label>
            <input type="email" placeholder="xxxx@gmail.com" />

            <label>รหัสผ่าน</label>
            <input type="password" placeholder="รหัสผ่าน" />

            <label>ยืนยันรหัสผ่าน</label>
            <input type="password" placeholder="ยืนยันรหัสผ่าน" />

            <div className="edit-actions">
              <button type="button" className="cancel-btn">ยกเลิก</button>
              <button type="submit" className="save-btn">บันทึกการแก้ไข</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
