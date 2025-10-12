// src/pages/Profile.tsx
import { useRef, useState } from "react"; // ✅ แก้ไขบรรทัดนี้
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./profile.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const onPickImage = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // TODO: Add logic to upload the file to Supabase Storage
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div>Loading Profile...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
        <>
         <Navbar />
         <div className="profile-page">
            <p>Please <Link to="/login">log in</Link> to see your profile.</p>
         </div>
        </>
    )
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  const avatarUrl = avatarPreview || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${displayName}&background=F59E0B&color=fff`;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <aside className="profile-left">
            <Link to="/edit-profile" className="edit-btn">
              Edit
            </Link>

            <div
              className="avatar-wrap"
              onClick={onPickImage}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onPickImage()}
            >
              <img className="avatar" src={avatarUrl} alt="Profile" />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden-file"
                onChange={onFileChange}
              />
            </div>
            
            <div className="username">
              <span className="code">{displayName}</span>
            </div>

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

          <section className="profile-right">
            <h1 className="title">{displayName}</h1>
            <h2 className="subtitle">
              {user.user_metadata?.location ? `From ${user.user_metadata.location}` : "From KMUTT, Thailand"}
            </h2>
            <p className="bio">
              {user.user_metadata?.bio || "This is a placeholder bio. You can edit your profile to change it."}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}