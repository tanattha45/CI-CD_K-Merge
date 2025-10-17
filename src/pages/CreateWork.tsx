import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CreateWork.css";

type TagItem = { tagId?: string; name: string };
type FileItem = { dataUrl: string; name: string };

export default function CreateWork() {
  const navigate = useNavigate();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  // tags state
  const [tags, setTags] = useState<TagItem[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TagItem[]>([]);
  const suggestBoxRef = useRef<HTMLDivElement>(null);

  // media state
  const [files, setFiles] = useState<FileItem[]>([]);
  const dropRef = useRef<HTMLLabelElement>(null);

  // submit
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // --- Fetch tag suggestions (debounced) ---
  useEffect(() => {
    let cancelled = false;
    const h = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/works/meta/tags?q=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled)
          setSuggestions((data || []).map((t: any) => ({ tagId: t.tagId, name: t.name })));
      } catch {
        // ignore
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(h);
    };
  }, [query]);

  // --- Files helpers ---
  const readFiles = (list: File[]) => {
    list.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [...prev, { dataUrl: String(reader.result), name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;
    readFiles(list);
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    readFiles(list);
    dropRef.current?.classList.remove("is-dragover");
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add("is-dragover");
  };
  const onDragLeave = () => dropRef.current?.classList.remove("is-dragover");

  const removeImage = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  // --- Tags helpers ---
  const addTagByName = (name: string) => {
    const n = name.trim();
    if (!n) return;
    if (tags.some((t) => t.name.toLowerCase() === n.toLowerCase())) return;
    const existing = suggestions.find((s) => s.name.toLowerCase() === n.toLowerCase());
    setTags((prev) => [...prev, existing || { name: n }]);
    setQuery("");
    setSuggestions([]);
  };
  const removeTag = (name: string) => setTags((prev) => prev.filter((t) => t.name !== name));

  // --- Submit ---
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("กรอกชื่อโพสก่อน");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const body = {
        title: title.trim(),
        description,
        status,
        tagIds: tags.filter((t) => !!t.tagId).map((t) => t.tagId),
        newTags: tags.filter((t) => !t.tagId).map((t) => t.name),
        images: files.map((f) => ({ dataUrl: f.dataUrl, alttext: f.name })),
      };
      const res = await fetch("/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        setMessage("กรุณาเข้าสู่ระบบ");
        return;
      }
      if (!res.ok) {
        setMessage(await res.text());
        return;
      }
      const work = await res.json();
      setMessage("สร้างโพสสำเร็จ");
      const id = work.workId || work.id;
      navigate(`/works/${id}`);
    } catch (err: any) {
      setMessage(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = useMemo(() => !!title.trim() && !submitting, [title, submitting]);

  return (
    <>
      <Navbar />

      <main className="cw-wrap">
        <section className="cw-head">
          <h1 className="cw-title">สร้างโพสใหม่</h1>
          <p className="cw-sub">เพิ่มรายละเอียด แท็ก และอัปโหลดรูปภาพ (รูปแรกเป็น Thumbnail)</p>
        </section>

        <form className="cw-form" onSubmit={onSubmit} autoComplete="off">
          {/* Left column */}
          <div className="cw-col">
            <div className="cw-field">
              <label htmlFor="title" className="cw-label">ชื่อโพส</label>
              <input
                id="title"
                className="cw-input"
                placeholder="เช่น Student Works Online Gallery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="cw-field">
              <label htmlFor="desc" className="cw-label">รายละเอียด</label>
              <textarea
                id="desc"
                className="cw-textarea"
                rows={8}
                placeholder="อธิบายผลงาน ข้อมูลเทคนิค หรือเป้าหมาย"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="cw-field">
              <label className="cw-label">สถานะ</label>
              <select
                className="cw-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="draft">ฉบับร่าง (Draft)</option>
                <option value="published">เผยแพร่ (Published)</option>
              </select>
            </div>

            <div className="cw-field">
              <label className="cw-label">แท็ก</label>

              {/* Selected tags */}
              <div className="cw-taglist">
                {tags.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className="cw-chip is-active"
                    onClick={() => removeTag(t.name)}
                    title="คลิกเพื่อเอาออก"
                  >
                    <span className="cw-chip__check" aria-hidden>✓</span>
                    {t.name}
                    <span className="cw-chip__x" aria-hidden>×</span>
                  </button>
                ))}
              </div>

              {/* Input + suggestions */}
              <div className="cw-taginput">
                <input
                  className="cw-input"
                  placeholder="พิมพ์ชื่อแท็ก แล้วกด Enter"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTagByName(query);
                    }
                  }}
                  aria-autocomplete="list"
                  aria-expanded={suggestions.length > 0}
                  aria-controls="cw-suggest"
                />

                {suggestions.length > 0 && (
                  <div className="cw-suggest" id="cw-suggest" ref={suggestBoxRef}>
                    {suggestions.map((s) => (
                      <button
                        key={s.tagId || s.name}
                        type="button"
                        className="cw-suggest__item"
                        onClick={() => addTagByName(s.name)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="cw-col">
            <div className="cw-field">
              <label className="cw-label">อัปโหลดรูปภาพ</label>

              {/* Dropzone */}
              <label
                ref={dropRef}
                className="cw-dropzone"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onPickFiles}
                  className="cw-dropzone__input"
                />
                <div className="cw-dropzone__inner">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 16l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>ลากรูปมาวางที่นี่ หรือ <u>เลือกไฟล์</u></span>
                  <small>รองรับ JPG/PNG • รูปแรกจะเป็น Thumbnail</small>
                </div>
              </label>

              {/* Preview */}
              {files.length > 0 && (
                <div className="cw-previews">
                  {files.map((f, i) => (
                    <figure key={i} className={`cw-preview ${i === 0 ? "is-thumb" : ""}`}>
                      <img src={f.dataUrl} alt={f.name} />
                      <figcaption>{i === 0 ? "Thumbnail" : "Image"}</figcaption>
                      <button
                        type="button"
                        className="cw-remove"
                        aria-label="remove image"
                        onClick={() => removeImage(i)}
                      >
                        ×
                      </button>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <div className="cw-actions">
              <button className="cw-btn" disabled={!canSubmit}>
                {submitting ? "กำลังบันทึก..." : "สร้างโพส"}
              </button>
              {message && (
                <p role="status" className="cw-msg">
                  {message}
                </p>
              )}
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}
