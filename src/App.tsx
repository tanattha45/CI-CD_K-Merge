import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  // --- Mock data (placeholder) ---
  const baseCards = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i + 1,
        title: `Title ${i + 1}`,
        body:
          "Body text for whatever you’d like to say. Add small teasers, notes, quotes, anecdotes, or even a very short story.",
      })),
    []
  );

  // --- UI state (ยังไม่ผูก backend) ---
  const [q, setQ] = useState("");

  // ตัวอย่าง filter ฝั่งหน้าเว็บ (เดี๋ยวค่อยต่อ backend)
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return baseCards;
    return baseCards.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.body.toLowerCase().includes(query)
    );
  }, [q, baseCards]);

  const onSearch = () => {
    // TODO: connect to backend /api/search?q=...
    console.log("search:", q);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <>
      <Navbar />

      <main className="km-container">
        {/* ===== Hero ===== */}
        <section className="km-hero" aria-labelledby="hero-title">
          <div className="km-hero__inner">
            <h1 id="hero-title" className="km-hero__title">K-Merge</h1>
            <p className="km-hero__subtitle">
              Discover amazing portfolios and creative works from KMUTT University.
              Showcase your talent and explore innovative projects.
            </p>

            {/* Search Bar */}
            <form className="km-search" onSubmit={onSubmit} role="search" aria-label="Sitewide">
              <input
                className="km-search__input"
                placeholder="Search student works, projects, and portfolios…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search"
              />
              <button className="km-search__btn" type="submit">
                <span>Search</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21l-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </section>

        {/* ===== Filter & Browse ===== */}
        <section className="km-section" aria-labelledby="browse-title">
          <div className="km-section__head">
            <div>
              <h3 id="browse-title" className="km-section__title">Filter &amp; Browse</h3>
              <p className="km-section__sub">Explore work here</p>
            </div>

            {/* Chips (placeholder) */}
            <div className="km-chips" role="group" aria-label="Quick filters">
              <button className="km-chip" type="button" aria-pressed="false">Popular</button>
              <button className="km-chip" type="button" aria-pressed="false">Newest</button>
              <button className="km-chip" type="button" aria-pressed="false">Featured</button>
            </div>
          </div>

          {/* ===== Cards Grid ===== */}
          {filtered.length > 0 ? (
            <div className="km-grid" aria-live="polite">
              {filtered.map((c) => (
                <article key={c.id} className="km-card">
                  <div className="km-card__thumb" aria-hidden="true">
                    <div className="km-thumb__icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                        <path
                          d="M21 17l-6-6-9 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="km-card__body">
                    <h4 className="km-card__title">{c.title}</h4>
                    <p className="km-card__text">{c.body}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // Empty state เมื่อค้นหาไม่เจอ
            <div className="km-empty">
              <div className="km-empty__icon" aria-hidden="true">🔎</div>
              <h4 className="km-empty__title">No results</h4>
              <p className="km-empty__text">
                Try a different keyword or clear the search box to see all works.
              </p>
              <button className="km-btn km-btn--minimal" onClick={() => setQ("")}>
                Clear search
              </button>
            </div>
          )}

          {/* ===== Pagination (placeholder) ===== */}
          <div className="km-pager" role="navigation" aria-label="Pagination">
            <button className="km-iconbtn" aria-label="Previous" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <span className="km-pager__info">Page 1 of 3</span>
            <button className="km-iconbtn" aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <Footer />
    </>
  );
}
