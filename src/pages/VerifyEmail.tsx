import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(initialEmail);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setStatus("verifying");
      setMessage(null);
      try {
        const res = await fetch(`/auth/verify?token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Verification failed");
        }
        setStatus("success");
        setMessage("อีเมลของคุณได้รับการยืนยันแล้ว คุณสามารถเข้าสู่ระบบได้");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatus("error");
        setMessage(msg || "Verification failed.");
      }
    })();
  }, [token]);

  const resend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) {
      setMessage('กรุณาใส่อีเมลเพื่อส่งอีเมลยืนยันใหม่');
      setStatus('error');
      return;
    }

    setPending(true);
    setStatus('verifying');
    setMessage(null);
    try {
      const res = await fetch('/auth/resend-confirmation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((json && (json.message || JSON.stringify(json))) || `Status ${res.status}`);
      }
      setStatus('success');
      setMessage('ส่งอีเมลยืนยันเรียบร้อยแล้ว โปรดตรวจสอบกล่องจดหมาย');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus('error');
      setMessage(msg || 'Could not resend verification.');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: 24, minHeight: '70vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1>Email verification</h1>
          {token ? (
            <>
              {status === 'verifying' && <p>Verifying...</p>}
              {status === 'success' && <p style={{ color: 'green' }}>{message}</p>}
              {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
              <p>
                <Link to="/login">Go to Login</Link>
              </p>
            </>
          ) : (
            <>
              <p>ทำการยืนยัน Email {initialEmail ? ` ที่ส่งไปยัง ${initialEmail}` : ''}.</p>
              <p>หากไม่ได้รับอีเมลหรือไม่สำเร็จ ให้กรอกอีเมลด้านล่างเพื่อส่งอีเมลยืนยันใหม่</p>
              <form onSubmit={resend} style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="km-input" />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button className="km-btn km-btn--brand" disabled={pending}>{pending ? 'Sending...' : 'Resend verification'}</button>
                  <Link to="/register" className="km-btn km-btn--minimal">Register</Link>
                </div>
              </form>
              {message && <p style={{ marginTop: 12 }}>{message}</p>}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
