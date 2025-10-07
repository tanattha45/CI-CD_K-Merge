import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
  // --- UI state (ยังไม่ผูก backend) ---
  const [q, setQ] = useState("");
  const cards = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i + 1,
        title: "Title",
        body:
          "Body text for whatever you’d like to say. Add small teasers, notes, quotes, anecdotes, or even a very short story.",
      })),
    []
  );

  const onSearch = () => {
    // TODO: connect to backend /api/search?q=...
    console.log("search:", q);
  };

  return (
    <>
      <Navbar />
      <main className="km-container">
        {/* ===== Hero ===== */}
        <section className="km-hero">
          <div className="km-hero__inner">
            <h1 className="km-hero__title">K-Merge</h1>
            <p className="km-hero__subtitle">
              Discover amazing portfolios and creative works from KMUTT University.
              Showcase your talent and explore innovative projects.
            </p>

            {/* Search Bar */}
            <div className="km-search">
              <input
                className="km-search__input"
                placeholder="Search student works, projects, and portfolios…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search"
              />
              <button className="km-search__btn" onClick={onSearch}>
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
            </div>
          </div>
        </section>

        {/* ===== Filter & Browse ===== */}
        <section className="km-section">
          <div className="km-section__head">
            <div>
              <h3 className="km-section__title">Filter &amp; Browse</h3>
              <p className="km-section__sub">Explore work heare</p>
            </div>
            {/* (ตัวอย่างช่อง filter เป็นแค่ placeholder) */}
            <div className="km-chips">
              <span className="km-chip" />
              <span className="km-chip" />
              <span className="km-chip" />
            </div>
          </div>

          {/* ===== Cards Grid (placeholders) ===== */}
          <div className="km-grid">
            {cards.map((c) => (
              <article key={c.id} className="km-card">
                <div className="km-card__thumb">
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

          {/* ===== Pagination (placeholder) ===== */}
          <div className="km-pager">
            <button className="km-iconbtn" aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="km-iconbtn" aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
