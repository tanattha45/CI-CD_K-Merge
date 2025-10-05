import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // TODO(BE): uncomment when backend ready
import logo from "../assets/logo.png";
import "./navbar.css";

export default function Navbar() {
  // ─────────────────────────────────────────────────────────────
  // FRONTEND-ONLY MODE (no AuthContext)
  // When backend is ready, remove the 3 lines below and use useAuth().
  // const { user, loading, signOut, signInWithGoogle } = useAuth();
  const loading = false;                 // TODO(BE): derive from context
  const user: null | { name?: string; email?: string } = null; // TODO(BE): real user from /api/auth/me
  const signOut = async () => { /* TODO(BE): POST /api/auth/logout */ };
  // const signInWithGoogle = () => window.location.href = "/api/auth/google"; // optional
  // ─────────────────────────────────────────────────────────────

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // ปิด dropdown เมื่อเปลี่ยนหน้า หรือคลิกนอกกรอบ / กด Esc
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <nav className="km-nav" aria-label="Primary">
      {/* LEFT: Logo → Home */}
      <div className="km-nav__left">
        <Link
          to="/"
          className="km-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Go to Home"
        >
          <img src={logo} alt="K-Merge" className="km-logo-img" />
        </Link>
      </div>

      {/* RIGHT: Frontend-only
          - ยังไม่เช็คสถานะ auth จริง
          - แสดงปุ่ม Sign In เสมอ (ยกเว้นอยู่ที่ /login) */}
      <div className="km-nav__right">
        {!loading && !user && (
          <>
            {/* ทางเลือก 1: ส่งผู้ใช้ไปหน้า /login (แนะนำช่วง frontend-only) */}
            <Link to="/login" className="km-btn km-btn--minimal">Sign In</Link>

            {/* ทางเลือก 2 (BE พร้อมแล้ว): ไป Google OAuth ตรงๆ
                <button className="km-btn km-btn--minimal" onClick={signInWithGoogle}>Sign In</button>
            */}
          </>
        )}

        {/* โครงสำหรับตอน “ล็อกอินแล้ว” (ตอนนี้ยังไม่ใช้) */}
        {!loading && user && (
          <div className="km-profile" ref={menuRef}>
            <button
              className="km-avatar"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Open profile menu"
              onClick={() => setOpen(v => !v)}
            >
              {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
            </button>

            {open && (
              <div className="km-dropdown" role="menu" aria-label="Profile">
                <div className="km-dropdown__header">
                  <div className="km-avatar km-avatar--sm" aria-hidden="true">
                    {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="km-user">
                    <div className="km-user__name">{user.name || "User"}</div>
                    <div className="km-user__sub">{user.email}</div>
                  </div>
                </div>

                <div className="km-dropdown__sep" />

                <Link
                  to="/profile"
                  className="km-dropdown__item"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <button
                  className="km-dropdown__item"
                  role="menuitem"
                  onClick={async () => {
                    await signOut();      // TODO(BE): implement real logout
                    setOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
