// src/components/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./navbar.css";

type UserLite = {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string; name?: string; picture?: string };
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserLite | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const loadMe = async () => {
    try {
      setLoading(true);
      const res = await fetch("/auth/me", { credentials: "include" }); // ← ผ่าน proxy
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setUser(json?.user ?? null);
    } catch (e) {
      console.error("loadMe failed:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMe(); }, []);
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

  // กลับหน้าจอ/สลับแท็บ → refresh สถานะ (หลัง redirect จาก Google)
  useEffect(() => {
    const onFocus = () => loadMe();
    const onVis = () => { if (document.visibilityState === "visible") loadMe(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const signInWithGoogle = () => { window.location.href = "/auth/login"; }; // ← ผ่าน proxy
  const signOut = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setOpen(false);
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User";
  const initial = (displayName || "U").slice(0, 1).toUpperCase();

  return (
    <nav className="km-nav" aria-label="Primary">
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

      <div className="km-nav__right">
        {loading && <div className="km-skel km-skel--btn" aria-hidden="true" />}
        {!loading && !user && (
          <>
            <Link to="/login" className="km-btn km-btn--minimal">Sign In</Link>
            {/* หรือจะให้ login ตรงเลยก็ได้: <button className="km-btn km-btn--minimal" onClick={signInWithGoogle}>Sign In</button> */}
          </>
        )}

        {!loading && user && (
          <div className="km-profile" ref={menuRef}>
            <button
              className="km-avatar"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Open profile menu"
              onClick={() => setOpen(v => !v)}
            >
              {initial}
            </button>

            {open && (
              <div className="km-dropdown" role="menu" aria-label="Profile">
                <div className="km-dropdown__header">
                  <div className="km-avatar km-avatar--sm" aria-hidden="true">{initial}</div>
                  <div className="km-user">
                    <div className="km-user__name">{displayName}</div>
                    <div className="km-user__sub">{user?.email}</div>
                  </div>
                </div>

                <div className="km-dropdown__sep" />

                <Link to="/profile" className="km-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>
                  Profile
                </Link>

                <button className="km-dropdown__item" role="menuitem" onClick={signOut}>
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
