import { useState, useEffect, useRef } from "react";

const PURPLE = "#5a3fa0";
const PURPLE_LIGHT = "#7155b8";
const PURPLE_PALE = "#ede9f8";
const PURPLE_DARK = "#4a3488";
const GREEN = "#1a8a5a";
const RED = "#c93535";
const AMBER = "#b86a0a";
const INK = "#0f0e0c";
const INK_MID = "#3d3b35";
const INK_SOFT = "#72706a";
const INK_GHOST = "#b0ada4";
const PAPER = "#faf9f6";
const PAPER_WARM = "#f3f1ec";
const RULE = "#ddd9d0";

function IconSend({ s = 16 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function IconHash({ s = 14 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="9" y1="4" x2="9" y2="20" />
      <line x1="15" y1="4" x2="15" y2="20" />
    </svg>
  );
}

function IconLock({ s = 14 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function IconChat({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconMail({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function IconCalendar({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconPipeline({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="18" rx="1" />
      <rect x="10" y="8" width="5" height="13" rx="1" />
      <rect x="17" y="12" width="5" height="9" rx="1" />
    </svg>
  );
}

function IconChart({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );

  useEffect(() => {
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsMobile(window.innerWidth <= breakpoint), 100);
    };
    window.addEventListener("resize", handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handler);
    };
  }, [breakpoint]);

  return isMobile;
}

function Avatar({ initials, bg = PURPLE, size = 32 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size > 28 ? 10 : 6, background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 800 }}>
      {initials}
    </div>
  );
}

function Badge({ text, color }) {
  const colors = {
    hot: { bg: "#fcebeb", text: "#a32d2d" },
    warm: { bg: "#fdf2e3", text: AMBER },
    new: { bg: "#e6f1fb", text: "#185fa5" },
    won: { bg: "#e4f5ed", text: GREEN },
    replied: { bg: "#e4f5ed", text: GREEN },
    opened: { bg: "#fdf2e3", text: AMBER },
    sent: { bg: PAPER_WARM, text: INK_SOFT },
    linkedin: { bg: "#e6f1fb", text: "#185fa5" },
    email: { bg: PAPER_WARM, text: INK_SOFT },
    instagram: { bg: PURPLE_PALE, text: PURPLE },
  };

  const c = colors[color] || colors.new;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: c.bg, color: c.text, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

function ScoreBar({ score }) {
  const color = score >= 80 ? GREEN : score >= 50 ? AMBER : score >= 30 ? "#378add" : INK_GHOST;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
      <div style={{ flex: 1, height: 3, borderRadius: 2, background: RULE }}>
        <div style={{ width: `${score}%`, height: "100%", borderRadius: 2, background: color }} />
      </div>
      <span style={{ fontSize: 11, color: INK_GHOST, minWidth: 20, textAlign: "right" }}>{score}</span>
    </div>
  );
}

function Sidebar({ active, onNav, onClose }) {
  const isMobile = useIsMobile();
  const channels = [
    { id: "founders", label: "for-founders", lock: true },
    { id: "chat", label: "talk-to-william", dot: true },
    { id: "outreach", label: "activity-log", badge: "3" },
    { id: "meetings", label: "meetings", badge: "2" },
    { id: "pipeline", label: "results" },
  ];

  return (
    <div style={{ width: 220, maxWidth: "80vw", background: "#16102a", padding: "20px 12px 14px", color: "rgba(255,255,255,0.45)", fontSize: 14, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px 20px", color: "#fff", fontSize: 17, fontWeight: 700 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff" }}>
          W
        </div>
        HireWilliam
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>
            ×
          </button>
        )}
      </div>

      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", padding: "10px 8px 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Channels</div>

      {channels.map((ch) => {
        const isActive = active === ch.id;
        return (
          <div
            key={ch.id}
            onClick={() => onNav(ch.id)}
            style={{
              padding: isMobile ? "8px 10px" : "5px 10px",
              minHeight: isMobile ? 44 : undefined,
              borderRadius: 5,
              marginBottom: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
              background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {ch.lock ? <IconLock s={11} /> : <IconHash s={11} />}
            {ch.label}
            {ch.badge && (
              <span style={{ marginLeft: "auto", fontSize: 10, background: RED, color: "#fff", padding: "1px 5px", borderRadius: 8, fontWeight: 600 }}>
                {ch.badge}
              </span>
            )}
          </div>
        );
      })}

      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", padding: "16px 8px 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Direct messages</div>
      <div onClick={() => onNav("chat")} style={{ padding: isMobile ? "8px 10px" : "5px 10px", minHeight: isMobile ? 44 : undefined, borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: active === "chat" ? "#fff" : "rgba(255,255,255,0.6)" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>W</div>
          <div style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: "#44b700", border: "1.5px solid #16102a" }} />
        </div>
        William
      </div>
    </div>
  );
}

const WILLIAM_INTRO_MESSAGES = [
  { id: "intro-1", sender: "william", content: "Good you found me", time: "now" },
  { id: "intro-2", sender: "william", content: "I'm William. An AI built by an AI agency to sell AI.", time: "now" },
  { id: "intro-3", sender: "william", content: "Right. So here's what happens next: you click that link, book 15 min call and we can discuss what we can actually do for your business.", hasButton: true, buttonText: "Book a meeting", buttonUrl: "https://cal.com/" },
];

const WILLIAM_FINAL_MSG = { content: "I appreciate your engagement..." };

function ChatView() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatLocked, setChatLocked] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    let cancelled = false;
    async function playIntro() {
      await new Promise((r) => setTimeout(r, 600));
      for (const msg of WILLIAM_INTRO_MESSAGES) {
        if (cancelled) return;
        const typingDelay = Math.min(Math.max(msg.content.length * 22, 900), 2800);
        setTyping(true);
        await new Promise((r) => setTimeout(r, typingDelay));
        if (cancelled) return;
        setTyping(false);
        setMsgs((p) => [...p, msg]);
        await new Promise((r) => setTimeout(r, 450));
      }
      if (!cancelled) setIntroPlaying(false);
    }
    playIntro();
    return () => {
      cancelled = true;
    };
  }, []);

  function send() {
    const text = input.trim();
    if (!text || chatLocked || introPlaying) return;
    const userMsg = { id: Date.now().toString(), sender: "user", content: text, time: "now" };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMsgs((p) => [...p, { id: (Date.now() + 1).toString(), sender: "william", ...WILLIAM_FINAL_MSG, time: "now" }]);
      setTyping(false);
      setChatLocked(true);
    }, 1200);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14, padding: isMobile ? "8px 16px" : "22px 24px", borderBottom: `1px solid ${RULE}`, flexShrink: 0, minHeight: isMobile ? 64 : 86 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Avatar initials="W" size={isMobile ? 36 : 46} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: isMobile ? 9 : 12, height: isMobile ? 9 : 12, borderRadius: "50%", background: "#44b700", border: "2.5px solid #fff" }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: isMobile ? 15 : 18, display: "flex", alignItems: "center", gap: 8, lineHeight: 1.3 }}>
            William
            <span style={{ fontSize: 12, fontWeight: 600, background: PURPLE_PALE, color: PURPLE, padding: "2px 7px", borderRadius: 4 }}>AI</span>
          </div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: GREEN, marginTop: 2 }}>Online - always</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: isMobile ? "12px 14px" : "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 10, flexDirection: m.sender === "user" ? "row-reverse" : "row" }}>
            {m.sender === "william" ? <Avatar initials="W" size={28} /> : <Avatar initials="Y" bg={PAPER_WARM} size={28} />}
            <div style={{ maxWidth: "75%", borderRadius: 16, padding: "10px 14px", background: m.sender === "william" ? PAPER_WARM : PURPLE, color: m.sender === "william" ? INK : "#fff" }}>
              <p style={{ fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap", margin: 0 }}>{m.content}</p>
              {m.hasButton && (
                <a href={m.buttonUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 10, padding: "10px 16px", background: PURPLE, color: "#fff", borderRadius: 10, textDecoration: "none" }}>
                  {m.buttonText}
                </a>
              )}
              <p style={{ fontSize: 10, marginTop: 4, color: m.sender === "william" ? INK_GHOST : "rgba(255,255,255,0.6)", margin: 0 }}>{m.time}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", gap: 10 }}>
            <Avatar initials="W" size={28} />
            <div style={{ background: PAPER_WARM, borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: PURPLE, opacity: 0.5, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: INK_SOFT, marginLeft: 4 }}>William is thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{ padding: isMobile ? "10px 14px" : "14px 20px", borderTop: `1px solid ${RULE}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              if (!chatLocked && !introPlaying) setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={introPlaying ? "William is typing..." : chatLocked ? "Chat ended" : "Message William..."}
            rows={1}
            disabled={chatLocked || introPlaying}
            style={{ flex: 1, resize: "none", borderRadius: 10, border: `1px solid ${RULE}`, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", background: chatLocked || introPlaying ? "#f8f7f4" : "#fff" }}
          />
          <button onClick={send} disabled={!input.trim() || chatLocked || introPlaying} style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() && !chatLocked && !introPlaying ? PURPLE : RULE, color: "#fff", border: "none", cursor: "pointer" }}>
            <IconSend s={16} />
          </button>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 0.8; transform: scale(1.1); } }`}</style>
    </div>
  );
}

function PipelineView() {
  const isMobile = useIsMobile();
  const CATEGORIES = [
    { id: "sales", label: "Sales", color: "#5a3fa0" },
    { id: "marketing", label: "Marketing", color: "#1a8a5a" },
    { id: "ops", label: "Operations", color: "#b86a0a" },
    { id: "support", label: "Customer Support", color: "#378add" },
    { id: "strategy", label: "Strategy", color: "#c93535" },
  ];

  const INITIAL_TESTIMONIALS = [
    { id: "1", category: "ops", quote: "We mainly used it for follow-ups and CRM updates.", name: "Teodora", company: "Acme Ops" },
    { id: "2", category: "support", quote: "It helped us automate lead handling and customer replies.", name: "Mila", company: "Northstar" },
    { id: "3", category: "sales", quote: "This reduced a lot of repetitive work and kept follow-ups moving.", name: "Nate", company: "Launchpad" },
    { id: "4", category: "marketing", quote: "It quietly took care of a bunch of admin tasks in the background.", name: "Alex", company: "Cluster" },
  ];

  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null);

  const handleDragStart = (e, t) => {
    setDraggedCard(t);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, catId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCategory(catId);
  };

  const handleDrop = (e, catId) => {
    e.preventDefault();
    if (!draggedCard) return;
    setTestimonials((prev) => prev.map((t) => (t.id === draggedCard.id ? { ...t, category: catId } : t)));
    setDraggedCard(null);
    setDragOverCategory(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverCategory(null);
  };

  const Stars = () => (
    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px", borderBottom: `1px solid ${RULE}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <IconHash s={14} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>results</span>
        <span style={{ fontSize: 12, color: INK_GHOST, marginLeft: 4 }}>{testimonials.length} founders</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", background: PAPER_WARM }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${CATEGORIES.length}, minmax(240px, 1fr))`, gap: 12, padding: 16, minWidth: CATEGORIES.length * 260 + "px" }}>
          {CATEGORIES.map((cat) => {
            const items = testimonials.filter((t) => t.category === cat.id);
            const isOver = dragOverCategory === cat.id;
            return (
              <div key={cat.id} onDragOver={(e) => handleDragOver(e, cat.id)} onDrop={(e) => handleDrop(e, cat.id)} onDragLeave={() => setDragOverCategory(null)} style={{ display: "flex", flexDirection: "column", minHeight: 120 }}>
                <div style={{ marginBottom: 10, padding: "0 4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.label}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: INK_GHOST, background: "#fff", padding: "2px 6px", borderRadius: 6 }}>{items.length}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 120, borderRadius: 10, padding: 6, transition: "background 0.15s", background: isOver ? `${cat.color}10` : "#f8f7f5" }}>
                  {items.map((t) => (
                    <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} onDragEnd={handleDragEnd} style={{ background: "#fff", border: `1px solid ${RULE}`, borderTop: `3px solid ${cat.color}`, borderRadius: 10, padding: 12 }}>
                      <Stars />
                      <p style={{ fontSize: 14, color: "#3d3b35", lineHeight: 1.7, margin: "0 0 16px 0", fontStyle: "italic" }}>
                        "{t.quote}"
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${RULE}` }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: cat.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{t.name.slice(0, 1)}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f0e0c" }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: "#72706a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div style={{ padding: "20px 12px", textAlign: "center", color: INK_GHOST, fontSize: 11, borderRadius: 8, background: "rgba(255,255,255,0.5)" }}>No testimonials yet</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OutreachView() {
  const [filter, setFilter] = useState("all");

  const CONVOS = [
    { id: "1", name: "Alex Morin", company: "Shipyard", channel: "linkedin", status: "replied", stage: "Meeting booked", stageColor: GREEN, time: "2h ago", avatar: "AM" },
    { id: "2", name: "Priya Kumar", company: "DataStack", channel: "email", status: "pending approval", stage: "Awaiting your review", stageColor: AMBER, time: "4h ago", avatar: "PK", needsApproval: true },
    { id: "3", name: "Leo Tanaka", company: "Kitemaker", channel: "instagram", status: "replied", stage: "Interested", stageColor: AMBER, time: "6h ago", avatar: "LT" },
    { id: "4", name: "Jake Rivera", company: "Launchpad", channel: "email", status: "opened", stage: "Reviewing", stageColor: "#378add", time: "12h ago", avatar: "JR" },
  ];

  const filters = [
    { id: "all", label: "All conversations", count: CONVOS.length },
    { id: "replied", label: "Replied", count: CONVOS.filter((c) => c.status === "replied").length },
    { id: "pending approval", label: "Needs approval", count: CONVOS.filter((c) => c.status === "pending approval").length },
    { id: "opened", label: "Opened", count: CONVOS.filter((c) => c.status === "opened").length },
  ];

  const filtered = filter === "all" ? CONVOS : CONVOS.filter((c) => c.status === filter);

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", color: INK, background: "#fff" }}>
      <div style={{ padding: "18px 20px", borderBottom: `1px solid ${RULE}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={INK_GHOST} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="9" y1="4" x2="9" y2="20" /><line x1="15" y1="4" x2="15" y2="20" /></svg>
          <span style={{ fontWeight: 600, fontSize: 15 }}>activity-log</span>
          <span style={{ fontSize: 12, color: INK_GHOST, marginLeft: 4 }}>{CONVOS.length} active threads</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "12px 20px", borderBottom: `1px solid ${RULE}`, overflowX: "auto", flexShrink: 0 }}>
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${filter === f.id ? PURPLE : RULE}`, background: filter === f.id ? PURPLE : "#fff", color: filter === f.id ? "#fff" : INK, cursor: "pointer" }}>
            {f.label}
            <span style={{ fontSize: 11, fontWeight: 600, background: filter === f.id ? PURPLE_LIGHT : PAPER_WARM, color: filter === f.id ? "#fff" : INK_GHOST, padding: "1px 6px", borderRadius: 10, marginLeft: 6 }}>{f.count}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {filtered.map((convo) => (
          <div key={convo.id} style={{ borderBottom: `1px solid ${RULE}`, padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: PURPLE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{convo.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>{convo.name}</span>
                  <span style={{ fontSize: 13, color: INK_SOFT }}>{convo.company}</span>
                </div>
                <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 2 }}>{convo.stage}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: convo.status === "replied" ? "#e4f5ed" : convo.status === "opened" ? "#e6f1fb" : "#fdf2e3", color: convo.status === "replied" ? GREEN : convo.status === "opened" ? "#185fa5" : AMBER }}>{convo.status}</span>
                <span style={{ fontSize: 12, color: INK_GHOST, minWidth: 50, textAlign: "right" }}>{convo.time}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: INK_GHOST, fontSize: 14 }}>No conversations match this filter.</div>}
      </div>
    </div>
  );
}

function MeetingsView() {
  return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: INK_SOFT, fontSize: 18, padding: 20 }}>Meetings view placeholder</div>;
}

function ForFoundersView({ onNav }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", background: "#ffffff", padding: 20 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", fontSize: 15, lineHeight: 1.6, color: INK_MID }}>
        <h2 style={{ fontSize: 28, margin: "0 0 20px", color: INK }}>For founders</h2>
        <p style={{ marginBottom: 16 }}>HireWilliam is an AI agency that designs, builds, and runs custom AI systems inside your business.</p>
        <p style={{ marginBottom: 16 }}>We help founders automate sales, support, operations, and content workflows so the business keeps running without constant founder intervention.</p>
        <button onClick={() => onNav("chat")} style={{ background: PURPLE, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}>Talk to William</button>
      </div>
    </div>
  );
}

function MobileBottomNav({ active, onNav }) {
  const navItems = [
    { id: "chat", label: "William", Icon: IconChat, badge: null },
    { id: "outreach", label: "Activity", Icon: IconMail, badge: "3" },
    { id: "meetings", label: "Meetings", Icon: IconCalendar, badge: "2" },
    { id: "pipeline", label: "Results", Icon: IconPipeline, badge: null },
    { id: "founders", label: "Founders", Icon: IconLock, badge: null },
  ];

  return (
    <div style={{ display: "flex", background: "#16102a", borderTop: "1px solid rgba(255,255,255,0.1)", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {navItems.map(({ id, label, Icon, badge }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onNav(id)} aria-label={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, height: 56, background: "transparent", border: "none", color: isActive ? "#fff" : "rgba(255,255,255,0.7)", cursor: "pointer", position: "relative" }}>
            {isActive && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: 2, borderRadius: "0 0 2px 2px", background: PURPLE_LIGHT }} />}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Icon s={20} />
              {badge && <span style={{ position: "absolute", top: -5, right: -7, fontSize: 9, fontWeight: 700, background: RED, color: "#fff", padding: "1px 4px", borderRadius: 8, lineHeight: 1.4 }}>{badge}</span>}
            </div>
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%", lineHeight: 1.2 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("founders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const views = {
    chat: <ChatView />,
    pipeline: <PipelineView />,
    outreach: <OutreachView />,
    meetings: <MeetingsView />,
    founders: <ForFoundersView onNav={setPage} />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'DM Sans', system-ui, sans-serif", color: INK, background: "#fff", overflow: "hidden" }}>
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", padding: "0 16px", background: "#16102a", height: 52, flexShrink: 0, gap: 12 }}>
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", cursor: "pointer", padding: "10px 12px" }}>
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2, marginBottom: 5 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2, marginBottom: 5 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>W</div>
            <div>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>HireWilliam</span>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.2 }}>
                {{ chat: "talk-to-william", pipeline: "results", outreach: "activity-log", meetings: "meetings", founders: "for-founders" }[page]}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {!isMobile && <Sidebar active={page} onNav={setPage} />}

        {isMobile && sidebarOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 200, display: "flex" }}>
            <Sidebar active={page} onNav={(p) => { setPage(p); setSidebarOpen(false); }} onClose={() => setSidebarOpen(false)} />
            <div role="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} style={{ flex: 1, background: "rgba(0,0,0,0.45)" }} />
          </div>
        )}

        <div style={{ flex: 1, display: "flex", overflow: "hidden", flexDirection: isMobile && page === "chat" ? "column" : "row" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>{views[page]}</div>
          {page === "chat" && <RightPanel isMobile={isMobile} />}
        </div>
      </div>

      {isMobile && <MobileBottomNav active={page} onNav={setPage} />}
    </div>
  );
}

function RightPanel({ isMobile = false }) {
  if (isMobile) return null;
  return (
    <div style={{ width: 210, borderLeft: `1px solid ${RULE}`, padding: "22px 14px 14px", fontSize: 12, background: PAPER, flexShrink: 0, overflowY: "auto" }}>
      <div style={{ fontWeight: 700, color: INK, fontSize: 13 }}>Founders Survival Kit</div>
    </div>
  );
}
