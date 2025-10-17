// src/pages/Profile.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./profile.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

type TabKey = "saved" | "posts";

type Card = {
  id: string | number;
  title: string;
  excerpt: string;
  tags: string[];
  thumb?: string | null;
};

export default function Profile() {
  const { user, loading } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("saved");

  // ---- mock content for demo (เชื่อม backend ภายหลัง) ----
  const saved = useMemo<Card[]>(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i + 1,
        title: `Saved work #${i + 1}`,
        excerpt:
          "A bookmarked project you liked. Short description goes here for context.",
        tags: i % 2 ? ["UI", "Figma"] : ["React", "Web"],
      })),
    []
  );
  const [posts, setPosts] = useState<Card[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/works/my', { credentials: 'include' });
        if (!res.ok) return; // if not authenticated, leave empty
        const works = await res.json();
        const mapped: Card[] = (works || []).map((w: any) => ({
          id: w.workId || w.id,
          title: w.title,
          excerpt: w.description || '',
          tags: (w.tags || []).map((t: any) => t.name),
          thumb: w.thumbnail || null,
        }));
        setPosts(mapped);
      } catch {}
    })();
  }, []);

  const onPickImage = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // TODO: upload -> Supabase Storage, then update profile avatar URL
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page"><div className="loading">Loading Profile...</div></div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="empty-state">
            <h3>Please sign in</h3>
            <p>
              You need to <Link to="/login">log in</Link> to see your profile.
            </p>
          </div>
        </div>
      </>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "User";

  const avatarUrl =
    avatarPreview ||
    user.user_metadata?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=F59E0B&color=fff`;

  const locationText =
    user.user_metadata?.location || "KMUTT, Thailand";

  const bioText =
    user.user_metadata?.bio ||
    "Tell people who you are, what you’re building, and what you’re excited about.";

  const activeList = tab === "saved" ? saved : posts;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          {/* ===== Left: Profile panel ===== */}
          <aside className="profile-left">
            <Link to="/edit-profile" className="edit-btn" aria-label="Edit profile">
              Edit
            </Link>

            <div
              className="avatar-wrap"
              onClick={onPickImage}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPickImage()}
              aria-label="Upload new avatar"
            >
              <img className="avatar" src={avatarUrl} alt={`${displayName} avatar`} />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden-file"
                onChange={onFileChange}
              />
            </div>

            <div className="username">
              <span className="code" title={displayName}>{displayName}</span>
            </div>

            <div className="meta">
              <div className="meta-item"><span>Location</span><strong>{locationText}</strong></div>
              <div className="meta-item">
                <span>Email</span>
                <strong title={user.email || ""}>{user.email || "—"}</strong>
              </div>
              <div className="meta-item"><span>Member since</span><strong>{new Date(user.created_at).toLocaleDateString()}</strong></div>
            </div>

            <div className="bio-left">
              <p>{bioText}</p>
            </div>

            <div className="socials">
              <a href="#" className="social" aria-label="facebook"><FaFacebookF /></a>
              <a href="#" className="social" aria-label="instagram"><FaInstagram /></a>
              <a href="#" className="social" aria-label="linkedin"><FaLinkedinIn /></a>
            </div>

            <div className="copy">© {new Date().getFullYear()} All rights reserved</div>
          </aside>

          {/* ===== Right: Content (Saved / Posts) ===== */}
          <section className="profile-right">
            <div className="header-block">
              <h1 className="title">{displayName}</h1>
              <h2 className="subtitle">From {locationText}</h2>
            </div>

            {/* Tabs */}
            <div className="tabbar" role="tablist" aria-label="Profile sections">
              <button
                role="tab"
                aria-selected={tab === "saved"}
                className={`tab ${tab === "saved" ? "is-active" : ""}`}
                onClick={() => setTab("saved")}
              >
                Saved <span className="badge">{saved.length}</span>
              </button>
              <button
                role="tab"
                aria-selected={tab === "posts"}
                className={`tab ${tab === "posts" ? "is-active" : ""}`}
                onClick={() => setTab("posts")}
              >
                Posts <span className="badge">{posts.length}</span>
              </button>
            </div>

            {/* Grid cards */}
            {activeList.length ? (
              <div className="grid" aria-live="polite">
                {activeList.map((item, i) => (
                  <article
                    key={item.id}
                    className="card fade-in-up"
                    style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                  >
                    <div className="thumb" aria-hidden="true">
                      {item.thumb ? (
                        <img src={item.thumb} alt="thumbnail" style={{width:'100%',height:'100%',objectFit:'cover', borderRadius: 'inherit'}} />
                      ) : (
                        <div className="thumb-shape" />
                      )}
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-text">{item.excerpt}</p>
                      <div className="tags">
                        {item.tags.map((t) => (
                          <span className="tag" key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No {tab === "saved" ? "saved items" : "posts"} yet</h3>
                <p>Start exploring and share your work to see it here.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
