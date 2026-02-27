import { useState, useEffect, useRef, useCallback } from "react";

const CONTENT = {
  cat: {
    nav: { property: "Propietat", gallery: "Galeria", location: "Ubicació", contact: "Contacte" },
    hero: { label: "Obra nova · Sispony, Andorra", title: "Residència\nde Luxe", subtitle: "Una obra arquitectònica excepcional als peus dels Pirineus, on la sofisticació i la natura s'uneixen en perfecta harmonia.", cta: "Sol·licitar Visita", scroll: "Descobrir" },
    features: { subtitle: "Cada detall concebut per a l'excel·lència" },
    gallery: { title: "Galeria", subtitle: "Espais dissenyats amb precisió i bellesa" },
    beforeAfter: { title: "Evolució del Projecte", subtitle: "De l'avantprojecte a la realitat", before: "Abans", after: "Ara" },
    contact: { title: "Poseu-vos en Contacte", subtitle: "El nostre equip us atén personalment", name: "Nom complet", email: "Correu electrònic", phone: "Telèfon", message: "Missatge", gdpr: "Accepto la política de privacitat i el tractament de les meves dades personals.", send: "Enviar Consulta", success: "Missatge enviat. Ens posarem en contacte aviat." },
    footer: { rights: "Tots els drets reservats" }
  },
  es: {
    nav: { property: "Propiedad", gallery: "Galería", location: "Ubicación", contact: "Contacto" },
    hero: { label: "Obra nueva · Sispony, Andorra", title: "Residencia\nde Lujo", subtitle: "Una obra arquitectónica excepcional a los pies del Pirineo, donde la sofisticación y la naturaleza se unen en perfecta armonía.", cta: "Solicitar Visita", scroll: "Descubrir" },
    features: { subtitle: "Cada detalle concebido para la excelencia" },
    gallery: { title: "Galería", subtitle: "Espacios diseñados con precisión y belleza" },
    beforeAfter: { title: "Evolución del Proyecto", subtitle: "Del anteproyecto a la realidad", before: "Antes", after: "Ahora" },
    contact: { title: "Contáctenos", subtitle: "Nuestro equipo le atiende personalmente", name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono", message: "Mensaje", gdpr: "Acepto la política de privacidad y el tratamiento de mis datos personales.", send: "Enviar Consulta", success: "Mensaje enviado. Nos pondremos en contacto pronto." },
    footer: { rights: "Todos los derechos reservados" }
  },
  en: {
    nav: { property: "Property", gallery: "Gallery", location: "Location", contact: "Contact" },
    hero: { label: "New build · Sispony, Andorra", title: "Luxury\nResidence", subtitle: "An exceptional architectural work at the foot of the Pyrenees, where sophistication and nature unite in perfect harmony.", cta: "Request Viewing", scroll: "Discover" },
    features: { subtitle: "Every detail conceived for excellence" },
    gallery: { title: "Gallery", subtitle: "Spaces designed with precision and beauty" },
    beforeAfter: { title: "Project Evolution", subtitle: "From concept to reality", before: "Before", after: "Now" },
    contact: { title: "Get in Touch", subtitle: "Our team will attend you personally", name: "Full name", email: "Email address", phone: "Phone", message: "Message", gdpr: "I accept the privacy policy and the processing of my personal data.", send: "Send Enquiry", success: "Message sent. We will be in touch soon." },
    footer: { rights: "All rights reserved" }
  }
};

const specs = [
  { icon: "◻", label: { cat: "Superfície", es: "Superficie", en: "Area" }, value: "420 m²" },
  { icon: "⌂", label: { cat: "Habitacions", es: "Habitaciones", en: "Bedrooms" }, value: "5" },
  { icon: "◈", label: { cat: "Banys", es: "Baños", en: "Bathrooms" }, value: "4" },
  { icon: "▣", label: { cat: "Garatge", es: "Garaje", en: "Garage" }, value: "2 vehicles" },
  { icon: "◇", label: { cat: "Terrassa", es: "Terraza", en: "Terrace" }, value: "85 m²" },
  { icon: "✦", label: { cat: "Qualificació", es: "Calificación", en: "Energy" }, value: "A+" },
  { icon: "▲", label: { cat: "Altitud", es: "Altitud", en: "Altitude" }, value: "1.200 m" },
  { icon: "◎", label: { cat: "Entrega", es: "Entrega", en: "Delivery" }, value: "Q4 2025" },
];

const roomColors = [
  ["#1a1a2e","#16213e"],["#0f3460","#1a1a2e"],["#533483","#1a1a2e"],
  ["#2c1810","#1a0a05"],["#0d1b2a","#1b4332"],["#1a0533","#2d1b69"],
];

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return mobile;
}

const RoomPlaceholder = ({ index, label }) => {
  const [c1, c2] = roomColors[index % roomColors.length];
  return (
    <div style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(212,175,55,0.08), transparent 60%)" }} />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(212,175,55,0.4)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", padding: "0 1rem", position: "relative" }}>{label}</span>
    </div>
  );
};

/* ─── BEFORE / AFTER SLIDER ─── */
const BeforeAfterSlider = ({ lang }) => {
  const t = CONTENT[lang].beforeAfter;
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const active = useRef(false);
  const isMobile = useIsMobile();

  const move = useCallback((clientX) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - left) / width) * 100)));
  }, []);

  useEffect(() => {
    const up = () => { active.current = false; };
    const mv = (e) => { if (active.current) move(e.clientX); };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [move]);

  return (
    <div style={{ textAlign: "center", padding: isMobile ? "4rem 1.25rem" : "6rem 2rem" }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d4af37", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{t.subtitle}</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "1.9rem" : "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: "#f5f0e8", marginBottom: "2rem" }}>{t.title}</h2>

      {/* Mobile quick-set buttons */}
      {isMobile && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
          {[0,25,50,75,100].map(v => (
            <button key={v} onClick={() => setPos(v)} style={{ background: Math.round(pos) === v ? "#d4af37" : "transparent", border: "1px solid rgba(212,175,55,0.4)", color: Math.round(pos) === v ? "#0e0e0e" : "#d4af37", fontFamily: "'Crimson Pro', serif", fontSize: "0.6rem", padding: "3px 9px", borderRadius: 2, cursor: "pointer" }}>{v}%</button>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        onMouseDown={(e) => { active.current = true; e.preventDefault(); }}
        onTouchMove={(e) => { e.preventDefault(); move(e.touches[0].clientX); }}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") setPos(p => Math.max(0, p-2)); if (e.key === "ArrowRight") setPos(p => Math.min(100, p+2)); }}
        aria-label={`${t.before} / ${t.after} slider`}
        style={{ position: "relative", width: "100%", maxWidth: isMobile ? "100%" : 700, height: isMobile ? 240 : 400, margin: "0 auto", cursor: "ew-resize", borderRadius: 4, overflow: "hidden", userSelect: "none", touchAction: "none", outline: "none", border: "1px solid rgba(212,175,55,0.2)" }}
      >
        {/* Before panel */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#2c1810,#0d1b2a)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ width: 44, height: 44, border: "1px solid rgba(212,175,55,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "rgba(212,175,55,0.5)" }}>◻</span></div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.3)", fontSize: "0.6rem", letterSpacing: "0.3em" }}>{t.before.toUpperCase()}</span>
        </div>
        {/* After panel (clipped) */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100-pos}% 0 0)`, background: "linear-gradient(135deg,#1b4332,#0f3460)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 50%, rgba(212,175,55,0.12), transparent 60%)" }} />
          <div style={{ width: 44, height: 44, border: "1px solid rgba(212,175,55,0.5)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><span style={{ color: "#d4af37" }}>✦</span></div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.6)", fontSize: "0.6rem", letterSpacing: "0.3em", position: "relative" }}>{t.after.toUpperCase()}</span>
        </div>
        {/* Handle line + circle */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 2, background: "#d4af37", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, background: "#d4af37", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <svg width="14" height="10" viewBox="0 0 16 10" fill="none"><path d="M5 5L1 2v6l4-3zm6 0l4-3v6l-4-3z" fill="#1a1208"/></svg>
          </div>
        </div>
        {/* Corner labels */}
        <div style={{ position: "absolute", bottom: 10, left: 10, fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.45)", fontSize: "0.55rem", letterSpacing: "0.2em", background: "rgba(0,0,0,0.55)", padding: "2px 8px", borderRadius: 2 }}>{t.before}</div>
        <div style={{ position: "absolute", bottom: 10, right: 10, fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,240,232,0.75)", fontSize: "0.55rem", letterSpacing: "0.2em", background: "rgba(0,0,0,0.55)", padding: "2px 8px", borderRadius: 2 }}>{t.after}</div>
        {/* % badge */}
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Cormorant Garamond', serif", color: "#d4af37", fontSize: "0.6rem", letterSpacing: "0.15em", background: "rgba(0,0,0,0.65)", padding: "2px 10px", borderRadius: 20 }}>{Math.round(pos)}%</div>
      </div>
      <p style={{ marginTop: "1rem", fontFamily: "'Crimson Pro', serif", color: "rgba(245,240,232,0.3)", fontSize: "0.7rem" }}>← {t.before} / {t.after} →</p>
    </div>
  );
};

/* ─── CONTACT FORM ─── */
const ContactForm = ({ lang }) => {
  const t = CONTENT[lang].contact;
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"", gdpr:false });
  const [status, setStatus] = useState(null);
  const isMobile = useIsMobile(640);

  const handle = (e) => { e.preventDefault(); setStatus("loading"); setTimeout(() => setStatus("success"), 1500); };
  const inp = { width:"100%", background:"transparent", border:"none", borderBottom:"1px solid rgba(212,175,55,0.3)", padding:"0.7rem 0", color:"#f5f0e8", fontFamily:"'Crimson Pro',serif", fontSize:"1rem", outline:"none", boxSizing:"border-box" };
  const lbl = { display:"block", fontFamily:"'Crimson Pro',serif", color:"rgba(212,175,55,0.65)", fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"0.2rem" };

  return (
    <section id="contact" style={{ background:"#0a0a0a", padding: isMobile ? "4rem 1.25rem" : "7rem 2rem", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", color:"#d4af37", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:"0.75rem", textAlign:"center" }}>{t.subtitle}</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "1.9rem" : "clamp(2rem,4vw,3rem)", fontWeight:300, color:"#f5f0e8", marginBottom:"2.5rem", textAlign:"center" }}>{t.title}</h2>
        {status === "success" ? (
          <div style={{ textAlign:"center", padding:"2.5rem 1.5rem", border:"1px solid rgba(212,175,55,0.3)", borderRadius:4 }}>
            <div style={{ color:"#d4af37", fontSize:"1.8rem", marginBottom:"0.75rem" }}>✦</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", color:"#f5f0e8", fontSize:"1.1rem" }}>{t.success}</p>
          </div>
        ) : (
          <form onSubmit={handle}>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "1.5rem" : "2rem", marginBottom:"1.5rem" }}>
              <div><label style={lbl}>{t.name}</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>{t.email}</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inp}/></div>
            </div>
            <div style={{ marginBottom:"1.5rem" }}><label style={lbl}>{t.phone}</label><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inp}/></div>
            <div style={{ marginBottom:"1.75rem" }}><label style={lbl}>{t.message}</label><textarea required rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{...inp,resize:"vertical"}}/></div>
            <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", marginBottom:"1.75rem" }}>
              <input required type="checkbox" id="gdpr" checked={form.gdpr} onChange={e=>setForm({...form,gdpr:e.target.checked})} style={{ marginTop:3, accentColor:"#d4af37", flexShrink:0, width:15, height:15 }}/>
              <label htmlFor="gdpr" style={{ fontFamily:"'Crimson Pro',serif", color:"rgba(245,240,232,0.4)", fontSize:"0.85rem", lineHeight:1.6, cursor:"pointer" }}>{t.gdpr}</label>
            </div>
            <button type="submit" disabled={status==="loading"} style={{ background:"transparent", border:"1px solid #d4af37", color:"#d4af37", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", padding:"1rem 2rem", cursor:"pointer", width:"100%" }}>
              {status === "loading" ? "···" : t.send}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

/* ─── APP ─── */
export default function App() {
  const [lang, setLang] = useState("es");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(null);
  const t = CONTENT[lang];
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 60); };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  const galleryItems = ["Saló Principal","Cuina Gourmet","Suite Master","Bany Principal","Terrassa Est","Vestíbul","Sala de Cine","SPA / Soterrani","Jardí i Piscina","Vistes Pirinenques"];
  const navKeys = ["property","gallery","location","contact"];

  return (
    <div style={{ fontFamily:"'Crimson Pro',serif", background:"#0e0e0e", color:"#f5f0e8", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Crimson+Pro:wght@300;400;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        ::selection{background:rgba(212,175,55,0.3);}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:#d4af37;}
        input,textarea,button{font-family:inherit;}
        input:focus,textarea:focus{border-bottom-color:rgba(212,175,55,0.75)!important;}
        .spec-card:hover{transform:translateY(-3px);border-color:rgba(212,175,55,0.4)!important;}
        .gthumb:hover .gover{opacity:1!important;}
        .nav-btn:hover{color:#d4af37!important;}
        .cta-gold{background:#d4af37!important;}
        .cta-gold:hover{background:rgba(212,175,55,0.85)!important;}
        .outline-btn:hover{background:rgba(255,255,255,0.05)!important;}
        @media(max-width:480px){.hero-btns{flex-direction:column!important;}.hero-btns button{width:100%!important;}}
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding: isMobile ? "0 1.25rem" : "0 clamp(1.5rem,4vw,4rem)",
        background: scrolled || menuOpen ? "rgba(8,8,8,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(18px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid rgba(212,175,55,0.1)" : "none",
        transition:"all 0.35s", display:"flex", alignItems:"center", height:66, justifyContent:"space-between"
      }}>
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left", flexShrink:0, padding:0 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "0.95rem" : "1.05rem", letterSpacing:"0.15em", color:"#f5f0e8" }}>BEST HOMES</div>
          <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.5rem", letterSpacing:"0.45em", color:"rgba(212,175,55,0.75)", marginTop:1, textTransform:"uppercase" }}>Sispony · Andorra</div>
        </button>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display:"flex", gap:"2.5rem", alignItems:"center" }}>
            {navKeys.map(k => (
              <button key={k} className="nav-btn" onClick={() => scrollTo(k)} style={{ background:"none", border:"none", color:"rgba(245,240,232,0.6)", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.25em", textTransform:"uppercase", cursor:"pointer", transition:"color 0.2s" }}>{t.nav[k]}</button>
            ))}
            <div style={{ display:"flex", gap:"0.3rem", borderLeft:"1px solid rgba(212,175,55,0.18)", paddingLeft:"1.4rem" }}>
              {["cat","es","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "rgba(212,175,55,0.15)" : "none", border: lang===l ? "1px solid rgba(212,175,55,0.4)" : "1px solid transparent", color: lang===l ? "#d4af37" : "rgba(245,240,232,0.3)", padding:"2px 7px", borderRadius:2, fontFamily:"'Crimson Pro',serif", fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button className="cta-gold" onClick={() => scrollTo("contact")} style={{ border:"none", color:"#0e0e0e", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.68rem", letterSpacing:"0.25em", textTransform:"uppercase", padding:"0.55rem 1.3rem", cursor:"pointer", transition:"background 0.2s" }}>{t.hero.cta}</button>
          </nav>
        )}

        {/* Mobile: lang + burger */}
        {isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <div style={{ display:"flex", gap:"0.25rem" }}>
              {["cat","es","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "rgba(212,175,55,0.15)" : "none", border: lang===l ? "1px solid rgba(212,175,55,0.4)" : "1px solid transparent", color: lang===l ? "#d4af37" : "rgba(245,240,232,0.3)", padding:"2px 6px", borderRadius:2, fontFamily:"'Crimson Pro',serif", fontSize:"0.58rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => setMenuOpen(m => !m)} aria-label="Menu" style={{ background:"none", border:"none", cursor:"pointer", padding:"6px", display:"flex", flexDirection:"column", gap:"5px", justifyContent:"center" }}>
              <span style={{ display:"block", width:21, height:1.5, background:"#d4af37", borderRadius:1, transition:"all 0.3s", transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
              <span style={{ display:"block", width:21, height:1.5, background:"#d4af37", borderRadius:1, transition:"opacity 0.2s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display:"block", width:21, height:1.5, background:"#d4af37", borderRadius:1, transition:"all 0.3s", transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        )}
      </header>

      {/* ═══ MOBILE DRAWER ═══ */}
      {isMobile && (
        <nav style={{ position:"fixed", top:66, left:0, right:0, background:"rgba(8,8,8,0.98)", backdropFilter:"blur(20px)", zIndex:999, padding:"1.5rem 1.25rem 2rem", transform: menuOpen ? "translateY(0)" : "translateY(-105%)", transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)", borderBottom:"1px solid rgba(212,175,55,0.1)" }}>
          {navKeys.map(k => (
            <button key={k} onClick={() => scrollTo(k)} style={{ display:"block", width:"100%", background:"none", border:"none", borderBottom:"1px solid rgba(212,175,55,0.07)", color:"rgba(245,240,232,0.7)", fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer", padding:"1rem 0", textAlign:"left", transition:"color 0.2s" }}>{t.nav[k]}</button>
          ))}
          <button className="cta-gold" onClick={() => scrollTo("contact")} style={{ border:"none", color:"#0e0e0e", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", padding:"0.9rem", cursor:"pointer", width:"100%", marginTop:"1.5rem" }}>{t.hero.cta}</button>
        </nav>
      )}

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{ position:"relative", height:"100svh", minHeight:580, display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#0a0f1a 0%,#0e1a0e 40%,#1a0a05 70%,#0a0a0e 100%)" }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 60% 50%, rgba(212,175,55,0.05), transparent 70%)" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(212,175,55,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.025) 1px,transparent 1px)", backgroundSize: isMobile ? "38px 38px" : "60px 60px" }} />
        {/* Mountains */}
        <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%" }} viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d="M0 300 L0 200 L120 160 L200 180 L350 90 L480 130 L600 60 L720 100 L840 40 L960 80 L1080 20 L1200 70 L1320 30 L1440 80 L1440 300Z" fill="rgba(0,0,0,0.55)" />
          <path d="M0 300 L0 230 L180 200 L300 215 L440 155 L560 175 L680 115 L800 145 L920 85 L1040 115 L1160 65 L1280 105 L1440 55 L1440 300Z" fill="rgba(0,0,0,0.38)" />
        </svg>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"35%", background:"linear-gradient(to bottom,transparent,rgba(14,14,14,0.9))" }} />

        <div style={{ position:"relative", zIndex:2, padding: isMobile ? "5rem 1.25rem 2rem" : "0 clamp(2rem,8vw,10rem)", maxWidth:900, width:"100%" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom: isMobile ? "1.25rem" : "2rem" }}>
            <div style={{ width: isMobile ? 24 : 40, height:1, background:"#d4af37", flexShrink:0 }} />
            <span style={{ fontFamily:"'Crimson Pro',serif", color:"#d4af37", fontSize: isMobile ? "0.58rem" : "0.68rem", letterSpacing:"0.4em", textTransform:"uppercase" }}>{t.hero.label}</span>
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "clamp(3rem,15vw,4.5rem)" : "clamp(4rem,10vw,9rem)", fontWeight:300, lineHeight:0.88, color:"#f5f0e8", marginBottom: isMobile ? "1.5rem" : "2.5rem" }}>
            {t.hero.title.split("\n").map((line, i) => (
              <span key={i} style={{ display:"block", marginLeft: i===1 ? (isMobile ? "1.25rem" : "clamp(2rem,6vw,6rem)") : 0, fontStyle: i===1 ? "italic" : "normal" }}>{line}</span>
            ))}
          </h1>
          <p style={{ fontFamily:"'Crimson Pro',serif", fontSize: isMobile ? "0.95rem" : "clamp(1rem,1.8vw,1.2rem)", color:"rgba(245,240,232,0.6)", maxWidth:460, lineHeight:1.8, marginBottom: isMobile ? "1.75rem" : "3rem", fontWeight:300 }}>{t.hero.subtitle}</p>
          <div className="hero-btns" style={{ display:"flex", gap:"0.9rem", alignItems:"center", flexWrap:"wrap" }}>
            <button className="cta-gold" onClick={() => scrollTo("contact")} style={{ border:"none", color:"#0e0e0e", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.3em", textTransform:"uppercase", padding: isMobile ? "0.8rem 1.75rem" : "0.9rem 2.5rem", cursor:"pointer" }}>{t.hero.cta}</button>
            <button className="outline-btn" onClick={() => scrollTo("property")} style={{ background:"none", border:"1px solid rgba(245,240,232,0.2)", color:"rgba(245,240,232,0.6)", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.3em", textTransform:"uppercase", padding: isMobile ? "0.8rem 1.5rem" : "0.9rem 2rem", cursor:"pointer" }}>{t.hero.scroll}</button>
          </div>
        </div>
        {/* Decorative vertical line — desktop only */}
        {!isMobile && (
          <div style={{ position:"absolute", right:"clamp(2rem,8vw,8rem)", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem" }}>
            <div style={{ width:1, height:70, background:"linear-gradient(to bottom,transparent,rgba(212,175,55,0.4))" }} />
            <div style={{ width:5, height:5, background:"#d4af37", borderRadius:"50%" }} />
            <div style={{ width:1, height:70, background:"linear-gradient(to bottom,rgba(212,175,55,0.4),transparent)" }} />
          </div>
        )}
      </section>

      {/* ═══ SPECS ═══ */}
      <section id="property" style={{ padding: isMobile ? "4rem 1.25rem" : "8rem clamp(2rem,6vw,6rem)", background:"#0e0e0e", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "3rem" : "5rem", alignItems:"start" }}>
            {/* Text */}
            <div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", color:"#d4af37", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:"1.25rem" }}>{t.features.subtitle}</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "2.4rem" : "clamp(2.5rem,4vw,4rem)", fontWeight:300, color:"#f5f0e8", lineHeight:1.0, marginBottom:"2rem" }}><em>Best Homes</em><br/>Sispony</h2>
              <p style={{ fontFamily:"'Crimson Pro',serif", color:"rgba(245,240,232,0.6)", lineHeight:1.85, fontSize:"1rem", fontWeight:300, marginBottom:"1.25rem" }}>
                Enclavada a 1.200 metres d'altitud, entre boscos de pi roig i paisatges alpins, aquesta residència representa el cim de l'arquitectura contemporània de luxe al Principat d'Andorra.
              </p>
              <p style={{ fontFamily:"'Crimson Pro',serif", color:"rgba(245,240,232,0.38)", lineHeight:1.85, fontSize:"1rem", fontWeight:300 }}>
                Materials d'altíssima qualitat, tecnologia domèstica de darrera generació i acabats artesanals defineixen cada racó d'aquest espai únic.
              </p>
              <div style={{ marginTop:"2.5rem", padding:"1.5rem", border:"1px solid rgba(212,175,55,0.15)", position:"relative" }}>
                <div style={{ position:"absolute", top:-1, left:36, right:36, height:1, background:"#d4af37" }} />
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "1.8rem" : "2.5rem", fontWeight:300, color:"#d4af37" }}>TODO: Preu</div>
                <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.6rem", letterSpacing:"0.3em", color:"rgba(245,240,232,0.3)", textTransform:"uppercase", marginTop:"0.2rem" }}>Preu de venda · IVA incl.</div>
              </div>
            </div>
            {/* Specs grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.1)" }}>
              {specs.map((s,i) => (
                <div key={i} className="spec-card" style={{ background:"#0e0e0e", padding: isMobile ? "1.1rem" : "1.6rem", transition:"all 0.3s", borderBottom:"1px solid rgba(212,175,55,0.05)" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", color:"rgba(212,175,55,0.45)", marginBottom:"0.55rem" }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.52rem", letterSpacing:"0.28em", color:"rgba(245,240,232,0.28)", textTransform:"uppercase", marginBottom:"0.3rem" }}>{s.label[lang]}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "1.15rem" : "1.35rem", color:"#f5f0e8" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section id="gallery" style={{ padding: isMobile ? "4rem 1rem" : "7rem clamp(2rem,5vw,5rem)", background:"#080808", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.2),transparent)" }} />
        <div style={{ maxWidth:1300, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom: isMobile ? "2rem" : "4rem" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", color:"#d4af37", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:"0.75rem" }}>{t.gallery.subtitle}</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "1.9rem" : "clamp(2rem,4vw,3.5rem)", fontWeight:300, color:"#f5f0e8" }}>{t.gallery.title}</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(270px,1fr))", gap: isMobile ? "0.4rem" : "0.9rem" }}>
            {galleryItems.map((label,i) => (
              <div key={i} className="gthumb" style={{ position:"relative", aspectRatio: (!isMobile && i%5===0) ? "16/9" : "4/3", cursor:"pointer", overflow:"hidden", borderRadius:2, gridColumn: (!isMobile && i%5===0) ? "span 2" : "span 1" }} onClick={() => setGalleryOpen(i)}>
                <RoomPlaceholder index={i} label={label} />
                <div className="gover" style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.38)", opacity:0, transition:"opacity 0.3s", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:36, height:36, border:"1px solid #d4af37", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#d4af37", fontSize:"1rem" }}>+</div>
                </div>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"1.25rem 0.65rem 0.55rem", background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", color:"rgba(245,240,232,0.65)", fontSize: isMobile ? "0.55rem" : "0.7rem", letterSpacing:"0.12em" }}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      {galleryOpen !== null && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.96)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }} onClick={() => setGalleryOpen(null)}>
          <div style={{ width:"min(800px,100%)", aspectRatio:"16/9", position:"relative" }} onClick={e => e.stopPropagation()}>
            <RoomPlaceholder index={galleryOpen} label={galleryItems[galleryOpen]} />
            <button onClick={() => setGalleryOpen(null)} style={{ position:"absolute", top:"0.7rem", right:"0.7rem", width:36, height:36, background:"rgba(0,0,0,0.65)", border:"1px solid rgba(212,175,55,0.35)", borderRadius:"50%", color:"#d4af37", fontSize:"1.1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            <div style={{ position:"absolute", bottom:"0.7rem", left:0, right:0, display:"flex", justifyContent:"center", gap:"1.5rem", alignItems:"center" }}>
              <button onClick={() => setGalleryOpen(g => (g-1+galleryItems.length)%galleryItems.length)} style={{ width:36, height:36, background:"rgba(0,0,0,0.65)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:"50%", color:"#d4af37", cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", color:"rgba(245,240,232,0.45)", fontSize:"0.7rem", letterSpacing:"0.2em" }}>{galleryOpen+1} / {galleryItems.length}</span>
              <button onClick={() => setGalleryOpen(g => (g+1)%galleryItems.length)} style={{ width:36, height:36, background:"rgba(0,0,0,0.65)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:"50%", color:"#d4af37", cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BEFORE / AFTER ═══ */}
      <section style={{ background:"#0a0a0a" }}>
        <BeforeAfterSlider lang={lang} />
      </section>

      {/* ═══ LOCATION ═══ */}
      <section id="location" style={{ padding: isMobile ? "4rem 1.25rem" : "7rem clamp(2rem,6vw,6rem)", background:"#0e0e0e" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2.5rem" : "5rem", alignItems:"center" }}>
          <div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", color:"#d4af37", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:"1.1rem" }}>Andorra · Pirineus</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "1.9rem" : "clamp(2rem,3.5vw,3.5rem)", fontWeight:300, color:"#f5f0e8", marginBottom:"1.4rem", lineHeight:1.1 }}>Sispony,<br/><em>Urb. Coma del Quico</em></h2>
            <p style={{ fontFamily:"'Crimson Pro',serif", color:"rgba(245,240,232,0.52)", lineHeight:1.85, marginBottom:"2rem", fontSize:"0.95rem" }}>
              Sispony és una de les parròquies més exclusives d'Andorra, amb connexió directa a les pistes d'esquí d'Ordino-Arcalís i a només 10 minuts d'Andorra la Vella.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.1rem" }}>
              {[["5'","Andorra la Vella"],["10'","Ordino-Arcalís"],["2h","Barcelona"],["45'","La Seu d'Urgell"]].map(([time,place]) => (
                <div key={place} style={{ borderLeft:"1px solid rgba(212,175,55,0.3)", paddingLeft:"0.8rem" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: isMobile ? "1.5rem" : "1.75rem", color:"#d4af37", fontWeight:300 }}>{time}</div>
                  <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.65rem", letterSpacing:"0.1em", color:"rgba(245,240,232,0.32)" }}>{place}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Map placeholder */}
          <div style={{ height: isMobile ? 260 : 420, background:"linear-gradient(135deg,#0a1628,#0d2b1f)", borderRadius:4, border:"1px solid rgba(212,175,55,0.1)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(212,175,55,0.045) 1px,transparent 1px)", backgroundSize:"26px 26px" }} />
            <div style={{ textAlign:"center", position:"relative" }}>
              <div style={{ width:50, height:50, background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.35)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 0.9rem" }}>
                <span style={{ color:"#d4af37", fontSize:"1.1rem" }}>◎</span>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", color:"#f5f0e8", fontSize:"0.9rem", letterSpacing:"0.1em" }}>Sispony, AD400</div>
              <div style={{ fontFamily:"'Crimson Pro',serif", color:"rgba(212,175,55,0.5)", fontSize:"0.62rem", letterSpacing:"0.18em", marginTop:"0.35rem" }}>42.5706° N, 1.5081° E</div>
              <div style={{ marginTop:"1.4rem", fontFamily:"'Crimson Pro',serif", color:"rgba(245,240,232,0.22)", fontSize:"0.6rem", letterSpacing:"0.12em" }}>TODO: Google Maps embed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <ContactForm lang={lang} />

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: isMobile ? "2rem 1.25rem" : "3rem clamp(2rem,6vw,6rem)", background:"#050505", borderTop:"1px solid rgba(212,175,55,0.07)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexDirection: isMobile ? "column" : "row", justifyContent:"space-between", alignItems: isMobile ? "flex-start" : "center", gap:"1.25rem" }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", letterSpacing:"0.15em", color:"#f5f0e8" }}>BEST HOMES SL</div>
            <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.6rem", letterSpacing:"0.25em", color:"rgba(212,175,55,0.42)", marginTop:3 }}>Sispony · Andorra · AD400</div>
          </div>
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
            {["Legal","Privacitat","Cookies"].map(l => (
              <a key={l} href="#" style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.6rem", letterSpacing:"0.2em", color:"rgba(245,240,232,0.22)", textDecoration:"none" }}>{l.toUpperCase()}</a>
            ))}
          </div>
          <div style={{ fontFamily:"'Crimson Pro',serif", fontSize:"0.6rem", color:"rgba(245,240,232,0.18)", letterSpacing:"0.08em" }}>© {new Date().getFullYear()} Best Homes SL — {t.footer.rights}</div>
        </div>
      </footer>

      {/* ═══ FLOATING BUTTONS ═══ */}
      <div style={{ position:"fixed", bottom: isMobile ? "1.1rem" : "2rem", right: isMobile ? "1.1rem" : "2rem", zIndex:999, display:"flex", flexDirection:"column", gap:"0.55rem" }}>
        <a href="tel:+376000000" aria-label="Llamar" style={{ width: isMobile ? 42 : 48, height: isMobile ? 42 : 48, background:"#d4af37", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", boxShadow:"0 4px 18px rgba(212,175,55,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0e0e0e"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
        </a>
        <a href="https://wa.me/376000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ width: isMobile ? 42 : 48, height: isMobile ? 42 : 48, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", boxShadow:"0 4px 18px rgba(37,211,102,0.25)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>
    </div>
  );
}
