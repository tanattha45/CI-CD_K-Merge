<<<<<<< HEAD
import { useRef, useState, useEffect } from "react";
=======
import { useRef, useState } from "react";
>>>>>>> Editprofile
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./profile.css";
import Navbar from "../components/Navbar";

<<<<<<< HEAD
type UserProfile = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    picture?: string;
    location?: string;
    bio?: string;
  };
};

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load user profile
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setUser(json?.user ?? null);
      // Set avatar if available from user metadata
      if (json?.user?.user_metadata?.picture) {
        setAvatarUrl(json.user.user_metadata.picture);
      }
    } catch (e) {
      console.error("loadUserProfile failed:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const onPickImage = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      
      // TODO: Implement image upload to backend/storage
      // const formData = new FormData();
      // formData.append('avatar', file);
      // await fetch('/api/profile/avatar', {
      //   method: 'POST',
      //   credentials: 'include',
      //   body: formData
      // });
      
      // Refresh profile after upload
      // await loadUserProfile();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="loading">Loading profile...</div>
        </div>
      </>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Guest";

=======
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

>>>>>>> Editprofile
  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          {/* ===== Left card ===== */}
          <aside className="profile-left">
<<<<<<< HEAD
=======
            {/* ปุ่ม Edit แบบตัวอักษร */}
>>>>>>> Editprofile
            <button type="button" className="edit-btn">
              Edit
            </button>

<<<<<<< HEAD
=======
            {/* กรอบรูป */}
>>>>>>> Editprofile
            <div
              className="avatar-wrap"
              onClick={onPickImage}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onPickImage()}
            >
              {avatarUrl ? (
<<<<<<< HEAD
                <img className="avatar" src={avatarUrl} alt="Profile" />
=======
                <img className="avatar" src={avatarUrl} alt="avatar" />
>>>>>>> Editprofile
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

<<<<<<< HEAD
            <div className="two-codes">
              <span className="code">{user?.id?.slice(0, 6) || "XXXXXX"}</span>
              <span className="code">{user?.id?.slice(-6) || "XXXXXX"}</span>
            </div>

=======
            {/* รหัสสองแถวในพื้นส้ม (ให้คลาสตรงกับ CSS) */}
            <div className="two-codes">
              <span className="code">XXXXXX</span>
              <span className="code">XXXXXX</span>
            </div>

            {/* พื้นขาวด้านล่าง */}
>>>>>>> Editprofile
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
<<<<<<< HEAD
            <h1 className="title">{displayName}</h1>
            <h2 className="subtitle">
              {user?.user_metadata?.location ? `From ${user.user_metadata.location}` : "Location not set"}
            </h2>
            <p className="bio">
              {user?.user_metadata?.bio || "No bio available. Click edit to add your bio."}
=======
            <h1 className="title">My name is Brian</h1>
            <h2 className="subtitle">I'm 24 years old, I'm from Korea</h2>
            <p className="bio">
              and right&apos;s top from wine And the love is cool Unknow for most
              kind and time, Hello phone and the night, Just came off for more
              inside Was caters true? In the form of a star vacation This camera I
              love you
>>>>>>> Editprofile
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
