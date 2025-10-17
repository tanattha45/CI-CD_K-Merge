import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiGet } from '../lib/api';
import type { WorkDetail } from '../lib/api';

export default function WorkView() {
  const { id } = useParams();
  const [data, setData] = useState<WorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const work = await apiGet<WorkDetail>(`/works/${id}`);
        if (!cancelled) setData(work);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const hero = useMemo(() => {
    if (data?.media?.length) return data.media[active]?.fileurl || data.thumbnail || '';
    return data?.thumbnail || '';
  }, [data, active]);

  return (
    <>
      <Navbar />
      <main className="km-wrap">
        {loading && <div style={{padding: 32}}>Loading...</div>}
        {error && <div style={{padding: 32, color: 'crimson'}}>Error: {error}</div>}
        {data && (
          <section className="km-section" aria-labelledby="work-title">
            <div className="km-hero" style={{marginBottom: 20}}>
              {hero ? (
                <img src={hero} alt={data.title} style={{width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 12, background: '#f3f4f6'}} />
              ) : (
                <div style={{width: '100%', aspectRatio: '16/9', borderRadius: 12, background: '#f3f4f6'}} />
              )}
            </div>

            {/* Thumbnails */}
            {!!data.media?.length && (
              <div style={{display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8}}>
                {data.media.map((m, i) => (
                  <button key={m.fileurl} onClick={() => setActive(i)} style={{border: 'none', padding: 0, background: 'transparent', cursor: 'pointer'}} aria-label={`Image ${i+1}`}>
                    <img src={m.fileurl} alt={m.alttext || `image ${i+1}`} style={{height: 72, width: 120, objectFit: 'cover', borderRadius: 8, outline: i===active ? '2px solid #f59e0b' : '1px solid #e5e7eb'}} />
                  </button>
                ))}
              </div>
            )}

            <div style={{marginTop: 20}}>
              <h1 id="work-title" className="km-section__title">{data.title}</h1>
              <div style={{display:'flex', gap:8, alignItems:'center', margin:'8px 0 16px'}}>
                <span style={{fontSize:12, color:'#6b7280'}}>โดย: นักศึกษา / สาขาการศึกษา</span>
                <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                  {(data.tags||[]).map(t => (
                    <span key={t.tagId} className="km-tag">{t.name}</span>
                  ))}
                </div>
              </div>

              <div className="km-tabs">
                <button className="km-chip is-active">รายละเอียด</button>
                <button className="km-chip" disabled>รีวิว</button>
                <button className="km-chip" disabled>ผลงานอื่นๆ</button>
              </div>

              <article style={{marginTop:12, lineHeight:1.7}}>
                {data.description || 'No description provided.'}
              </article>

              <div style={{marginTop:24}}>
                <Link to="/" className="km-btn km-btn--minimal">กลับหน้าแรก</Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
