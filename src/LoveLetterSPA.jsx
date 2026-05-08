import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Check,
  MapPin, Music2, Clock, BookOpen, Camera,
  ChevronLeft, ChevronRight, Volume2
} from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Courier+Prime:ital@0;1&display=swap');`;

// ─── PLAYLIST ─────────────────────────────────────────────────────────────────
const PLAYLIST = [
  { id: 1, title: "Suenan como tú",   
    artist: "Mafalda Cardenal",     
    file: "/audio/suenan-como-tu.mp3",    
    duration: "3:24" 
  },

  { id: 2, title: "Miel ♡",           
    artist: "Valeria Jasso",        
    file: "/audio/Miel.mp3",              
    duration: "3:10" 
  },
  
  { id: 3, title: "Mar",              
    artist: "Valeria Jasso",        
    file: "/audio/Mar.mp3",               
    duration: "3:09s" 
  },
  
  { id: 5, title: "K.",               
    artist: "Cigarettes After Sex", 
    file: "/audio/K.mp3",             
    duration: "5:12" 
  },
  
  { id: 4, title: "próximamente",     
    artist: "",                     
    file: "/audio/",  
    duration: "" 
  },  
  
  { id: 6, title: "— próximamente",   
    artist: "",                     
    file: "/audio/",                          
    duration: "--:--" 
  },
  
  { id: 7, title: "— próximamente",   
    artist: "",                     
    file: "/audio/",                           
    duration: "--:--" 
  },
  
  { id: 8, title: "— próximamente",   
    artist: "",                     
    file: "/audio/",                           
    duration: "--:--" 
  },
  
  { id: 9, title: "— próximamente",   
    artist: "",                     
    file: "/audio/",                           
    duration: "--:--" 
  },
  
  { id:10, title: "— próximamente",   
    artist: "",                 
    file: "/audio/",                           
    duration: "--:--" 
  },
];

// ─── MUSIC PLAYER ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const [idx, setIdx]         = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProg]   = useState(0);
  const [duration, setDur]    = useState(0);
  const [volume, setVol]      = useState(0.8);
  const [waving, setWaving]   = useState([]);
  const audioRef = useRef(null);
  const track = PLAYLIST[idx];

  // wave animation bars
  useEffect(() => {
    setWaving(Array.from({ length: 20 }, () => Math.random()));
    const t = setInterval(() => {
      if (playing) setWaving(Array.from({ length: 20 }, () => Math.random()));
    }, 400);
    return () => clearInterval(t);
  }, [playing]);

const loadAndPlay = (i, autoPlay = false) => {
  const t = PLAYLIST[i];
  if (!t.file || !audioRef.current) return;
  
  audioRef.current.pause(); 
  audioRef.current.src = t.file;
  audioRef.current.load();
  audioRef.current.volume = volume;

  if (autoPlay) {
    setTimeout(() => {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }, 50);
  } else {
    setPlaying(false);
  }
  setProg(0);
};

  const selectTrack = (i) => { setIdx(i); loadAndPlay(i, false); };

  const togglePlay = () => {
    if (!track.file || !audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const next = () => { const n = (idx + 1) % PLAYLIST.length; setIdx(n); loadAndPlay(n, playing); };
  const prev = () => { const n = (idx - 1 + PLAYLIST.length) % PLAYLIST.length; setIdx(n); loadAndPlay(n, playing); };

  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ borderRadius: 16, overflow: "hidden", border: "none", background: "#100e0c", display: "flex", height: 340 }}>

    <audio 
      ref={audioRef}
      src={PLAYLIST[idx].file}
      onTimeUpdate={() => audioRef.current && setProg((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)}
      onLoadedMetadata={() => audioRef.current && setDur(audioRef.current.duration)}
      onEnded={next} 
    />

      {/* ── LEFT: playlist ── */}
      <div style={{ width: 220, borderRight: "1px solid #1e1a16", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid #1e1a16" }}>
          <Music2 size={12} color="#c8a97e" />
          <span style={{ fontSize: 9, letterSpacing: 3, color: "#6b5840", textTransform: "uppercase" }}>Our Soundtrack</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {PLAYLIST.map((t, i) => {
            const active = i === idx;
            const empty  = !t.file;
            return (
              <motion.div key={t.id} whileHover={!empty ? { x: 4 } : {}}
                onClick={() => !empty && selectTrack(i)}
                style={{
                  padding: "9px 16px", display: "flex", alignItems: "center", gap: 10,
                  cursor: empty ? "default" : "pointer",
                  background: active ? "#1e1a16" : "transparent",
                  borderLeft: active ? "2px solid #c8a97e" : "2px solid transparent",
                  transition: "all .2s"
                }}>

                {/* track number / play indicator */}
                <div style={{ width: 18, textAlign: "center", flexShrink: 0 }}>
                  {active && playing
                    ? <span style={{ fontSize: 8, color: "#c8a97e" }}>▶</span>
                    : <span style={{ fontSize: 10, color: empty ? "#2d2620" : "#3d2f1f" }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11.5, color: active ? "#f5f0e8" : empty ? "#2a2420" : "#8a7560",
                    fontFamily: "'Lora',serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    fontStyle: empty ? "italic" : "normal"
                  }}>{t.title}</div>
                  {t.artist && <div style={{ fontSize: 9.5, color: active ? "#c8a97e" : "#4a3828", marginTop: 1 }}>{t.artist}</div>}
                </div>
                <div style={{ fontSize: 9, color: "#3d2f1f", flexShrink: 0 }}>{t.duration}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: controls ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 22px" }}>
        {/* Now playing info */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#4a3828", textTransform: "uppercase", marginBottom: 10 }}>Reproduciendo</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: "#f5f0e8", fontWeight: 600, lineHeight: 1.2 }}>{track.title}</div>
          <div style={{ fontSize: 12, color: "#6b5840", marginTop: 4 }}>{track.artist || "—"}</div>
        </div>

        {/* Waveform visualizer */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 40, padding: "0 2px" }}>
          {waving.map((h, i) => (
            <motion.div key={i}
              animate={{ height: playing ? `${20 + h * 80}%` : "20%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ flex: 1, background: i < Math.floor((progress / 100) * 20) ? "#c8a97e" : "#2a2420", borderRadius: 2 }} />
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div onClick={seek} style={{ height: 3, background: "#1e1a16", borderRadius: 2, cursor: "pointer", overflow: "hidden", marginBottom: 6 }}>
            <motion.div style={{ height: "100%", background: "linear-gradient(90deg,#c8a97e,#e8c89e)", width: `${progress}%`, borderRadius: 2 }}
              transition={{ duration: 0.5 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "#3d2f1f" }}>{fmtTime((progress / 100) * duration)}</span>
            <span style={{ fontSize: 9, color: "#3d2f1f" }}>{fmtTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <button onClick={prev} style={S.darkBtn}><SkipBack size={17} /></button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlay}
            style={{ width: 44, height: 44, borderRadius: "50%", background: track.file ? "#c8a97e" : "#2a2420", border: "none", cursor: track.file ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {playing ? <Pause size={16} fill="#1a1714" color="#1a1714" /> : <Play size={16} fill="#1a1714" color="#1a1714" />}
          </motion.button>
          <button onClick={next} style={S.darkBtn}><SkipForward size={17} /></button>
        </div>

        {/* Volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Volume2 size={11} color="#3d2f1f" />
          <input type="range" min={0} max={1} step={0.01} value={volume}
            onChange={e => { setVol(+e.target.value); if (audioRef.current) audioRef.current.volume = +e.target.value; }}
            style={{ flex: 1, accentColor: "#c8a97e" }} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── MEMORY CLOCK ─────────────────────────────────────────────────────────────
function MemoryClock({ startDate }) {
  const [el, setEl] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = Date.now() - new Date(startDate);
      const total = Math.floor(diff / 86400000);
      setEl({ years: Math.floor(total / 365), months: Math.floor((total % 365) / 30), days: total % 30, total });
    };
    calc(); const t = setInterval(calc, 60000); return () => clearInterval(t);
  }, [startDate]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={S.card}>
      <Row icon={<Clock size={13} color="#a89880" />} label="Memory Clock" />
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 50, fontWeight: 700, color: "#1a1714", lineHeight: 1, marginTop: 10 }}>{el.total?.toLocaleString()}</div>
      <div style={{ fontSize: 9, color: "#a89880", letterSpacing: 2, marginTop: 2 }}>DÍAS TRANSCURRIDOS</div>
      <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
        {[{ v: el.years, l: "años" }, { v: el.months, l: "meses" }, { v: el.days, l: "días" }].map(({ v, l }) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: "#3d2f1f" }}>{v}</div>
            <div style={{ fontSize: 9, color: "#b0a090", letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────
const ITEMS = [
  "Tu risa parecida a Stitch", "Esa canción de 1975 sonando suave",
  "La forma en que dices 'Abu'", "Tus manos cuando escribes",
  "El olor de tu shampoo de coco", "Cuando me corriges sin reírte", "Tu playlist de las 2am"
];
function Inventory() {
  const [checked, setChecked] = useState([0, 1, 3]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={S.card}>
      <Row icon={<BookOpen size={13} color="#a89880" />} label="Inventory of the Invisible" />
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 12 }}>
        {ITEMS.map((item, i) => (
          <motion.div key={i} whileHover={{ x: 3 }}
            onClick={() => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
            style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
            <div style={{ width: 15, height: 15, borderRadius: 3, border: "1.5px solid #c8a97e", background: checked.includes(i) ? "#c8a97e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
              {checked.includes(i) && <Check size={9} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 12, color: checked.includes(i) ? "#8a7560" : "#3d2f1f", textDecoration: checked.includes(i) ? "line-through" : "none", fontFamily: "'Lora',serif" }}>{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── MEMORIES GALLERY ─────────────────────────────────────────────────────────
const SLOTS = [
  { title: "Cuando nos conocimos", key: "meet", icon: "🕊️" },
  { title: "Primer beso",          key: "kiss", icon: "💋" },
  { title: "Primer año juntos",    key: "year1",icon: "🌹" },
  { title: "Viaje juntos",         key: "trip", icon: "✈️" },
  { title: "Ese día random",       key: "rand", icon: "🌅" },
  { title: "Hoy",                  key: "today",icon: "✦"  },
];

function MemoriesGallery() {
  const [photos, setPhotos]       = useState({});
  const [nasaPhotos, setNasaPh]   = useState({});
  const [loadingNasa, setLoadNasa]= useState({});
  const fileRefs = useRef({});
  const dateRefs = useRef({});

  const handleNasaDate = async (key, date) => {
    setLoadNasa(p => ({ ...p, [key]: true }));
    try {
      const res  = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);
      const data = await res.json();
      if (data.media_type === "image") setNasaPh(p => ({ ...p, [key]: { url: data.url, title: data.title, date: data.date } }));
      else alert("NASA no tiene imagen para esa fecha, prueba otra.");
    } catch { alert("Error al consultar NASA APOD."); }
    setLoadNasa(p => ({ ...p, [key]: false }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      <Row icon={<Camera size={13} color="#a89880" />} label="Our Constellation of Moments" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        {SLOTS.map((slot, si) => (
          <motion.div key={slot.key}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + si * 0.06 }}
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.09)" }}
            style={{ ...S.card, padding: 10 }}>
            <input ref={el => fileRefs.current[slot.key] = el} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { if (e.target.files[0]) setPhotos(p => ({ ...p, [slot.key]: URL.createObjectURL(e.target.files[0]) })); }} />
            <input ref={el => dateRefs.current[slot.key] = el} type="date" style={{ display: "none" }}
              onChange={e => handleNasaDate(slot.key, e.target.value)} />

            <div style={{ height: 110, borderRadius: 8, overflow: "hidden", position: "relative", background: "#f0e8de" }}>
              {photos[slot.key] ? (
                <img src={photos[slot.key]} alt={slot.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : nasaPhotos[slot.key] ? (
                <>
                  <img src={nasaPhotos[slot.key].url} alt={nasaPhotos[slot.key].title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.8)" }} />
                  <div style={{ position: "absolute", bottom: 3, left: 4, right: 4, fontSize: 7.5, color: "#fff", opacity: .7, fontStyle: "italic" }}>NASA · {nasaPhotos[slot.key].date}</div>
                </>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <span style={{ fontSize: 22 }}>{slot.icon}</span>
                  <span style={{ fontSize: 9, color: "#b0a090" }}>Sin foto aún</span>
                </div>
              )}
              {loadingNasa[slot.key] && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#c8a97e" }}>Cargando…</div>
              )}
              <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 3 }}>
                <button onClick={() => dateRefs.current[slot.key]?.click()} title="Foto NASA de esa fecha" style={S.overlayBtn}>🌌</button>
                <button onClick={() => fileRefs.current[slot.key]?.click()} title="Subir foto" style={S.overlayBtn}><Camera size={9} /></button>
              </div>
            </div>
            <div style={{ marginTop: 7 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#3d2f1f", fontFamily: "'Lora',serif" }}>{slot.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 9.5, color: "#a89880", textAlign: "center" }}>
        🌌 elige la fecha y aparece la foto NASA de ese día &nbsp;·&nbsp; 📷 sube tu propia foto
      </div>
    </motion.div>
  );
}

// ─── MAP ──────────────────────────────────────────────────────────────────────
function CoordinatesMap() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{ ...S.card, background: "#0f0d0b", border: "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px,#1e1a16 1px,transparent 0)", backgroundSize: "18px 18px", opacity: .8 }} />
      <div style={{ position: "relative" }}>
        <Row icon={<MapPin size={13} color="#c8a97e" />} label="Coordinates Atlas" dark />
        <svg viewBox="0 0 200 160" style={{ width: "100%", marginTop: 10 }}>
          {[40,80,120,160].map(x => <line key={x} x1={x} y1={0} x2={x} y2={160} stroke="#1e1a16" strokeWidth={1}/>)}
          {[40,80,120].map(y => <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#1e1a16" strokeWidth={1}/>)}
          <path d="M 0 90 Q 60 80 100 85 Q 140 90 200 75" fill="none" stroke="#2a2420" strokeWidth={2}/>
          <path d="M 80 0 Q 95 50 100 85 Q 102 110 98 160" fill="none" stroke="#2a2420" strokeWidth={2}/>
          <path d="M 0 130 Q 50 125 100 120 Q 150 115 200 118" fill="none" stroke="#1e1a16" strokeWidth={1.5}/>
          <motion.circle 
              cx={100} cy={85} 
              r={18} 
              initial={{ r: 18 }} 
              animate={{ r: [18, 28, 18] }} 
              transition={{ duration: 2.5, repeat: Infinity }}
              fill="none" stroke="#c8a97e" strokeWidth={.5} opacity={.3}
            />
            <motion.circle 
              cx={100} cy={85} 
              r={10} 
              initial={{ r: 10 }}
              animate={{ r: [10, 18, 10] }} 
              transition={{ duration: 2.5, repeat: Infinity, delay: .4 }}
              fill="none" stroke="#c8a97e" strokeWidth={.8} opacity={.5}
            />
          <circle cx={100} cy={85} r={5} fill="#c8a97e"/>
          <circle cx={100} cy={85} r={2} fill="#fff"/>
          <rect x={55} y={95} width={90} height={26} rx={4} fill="#1a1714"/>
          <text x={100} y={108} textAnchor="middle" fill="#c8a97e" fontSize={7} fontFamily="serif">UMG Sede Central</text>
          <text x={100} y={117} textAnchor="middle" fill="#6b5840" fontSize={5.5} fontFamily="serif">Zona 2, Ciudad de Guatemala</text>
          <text x={100} y={62} textAnchor="middle" fill="#2d2620" fontSize={5} fontFamily="monospace">14.6487° N, 90.5128° W</text>
        </svg>
        <div style={{ marginTop: 10, padding: "10px 12px", background: "#1a1714", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#c8a97e", fontFamily: "'Playfair Display',serif", fontStyle: "italic" }}>"Aquí comenzó todo."</div>
          <div style={{ fontSize: 9.5, color: "#4a3828", marginTop: 3 }}>Universidad Mariano Gálvez · Sede Central · Zona 2</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── POETRY BOOK ──────────────────────────────────────────────────────────────
const PAGES = [
  { title: "I.", 
    body: `A los que viven en el borde,
    \nlos verdaderos insurgentes—
    \nlos que sueñan con los ojos abiertos
    \ny no le piden permiso al tiempo.
    \n\nTú eras una de ellos\nla primera vez que te vi
    \ncon ese libro mal doblado\ny esa mirada de quien
    \nya ha vivido tres vidas.` 
  },

  { title: "II.", 
    body: `Hay universos enteros\nque caben en el espacio
    \nentre tu nombre y el mío.
    \n\nUniversos de martes ordinarios,\nde cafés sin terminar,
    \nde silencioso entendimiento\na mitad de la clase.` 
  },
  { title: "III.", 
    body: `Escribo sobre ti
    \ncon la misma torpeza\ncon que aprendí a caminar—\n
    \ncayendo, levantándome,\nconvencido de que el suelo
    \nes solo una excusa\npara volverte a encontrar.`
  },
  { title: "IV.", 
    body: `Dicen que los sueños\nse olvidan al despertar.\n
    \nEl mío tiene tu cara\ny sobrevive al café,\nal bus, al ruido,
    \na todo lo que el día\nintenta borrar.` 
  },
  { title: "V.", 
    body: `No necesito mapas\npara encontrarte.\n
    \nSolo recuerdo\nque doblas hacia la izquierda
    \ncuando estás nerviosa\ny sonríes primero\ncon los ojos.` 
  },
  { title: "VI.", 
    body: `— escrito en los márgenes
    \nde un martes cualquiera,\ncon tinta azul y sin borrador.\n
    \nPerdóname si no es perfecto.\nTú tampoco lo eres
    \ny te quiero igual.` 
  },
];

function MiniPoetry() {
  const [page, setPage] = useState(0);
  const [dir, setDir]   = useState(1);
  const go = (d) => { setDir(d); setPage(p => Math.max(0, Math.min(PAGES.length - 1, p + d))); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ ...S.card, background: "#fefcf8", border: "1px solid #e8e2d9", position: "relative", minHeight: 320 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 54 + i * 28, height: 1, background: "#ede7dd" }} />
        ))}
        <div style={{ position: "absolute", top: 0, left: 38, bottom: 0, width: 1.5, background: "rgba(240,160,100,.3)" }} />
      </div>
      <div style={{ position: "relative", paddingLeft: 14 }}>
        <Row icon={<BookOpen size={13} color="#a89880" />} label="Mini Poetry Book" />
        <div style={{ position: "absolute", top: 0, right: 0, fontSize: 9.5, color: "#c8a97e", letterSpacing: 1 }}>{page + 1} / {PAGES.length}</div>
        <div style={{ minHeight: 240, marginTop: 14, overflow: "hidden" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={page} custom={dir}
              initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c8a97e", marginBottom: 14, letterSpacing: 2, fontFamily: "'Courier Prime',monospace" }}>{PAGES[page].title}</div>
              <pre style={{ fontSize: 12.5, color: "#3d2f1f", lineHeight: 2.1, whiteSpace: "pre-wrap", fontFamily: "'Courier Prime',monospace", fontStyle: "italic", margin: 0 }}>
                {PAGES[page].body}
              </pre>
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <motion.button whileHover={{ scale: 1.07 }} whileTap={{ scale: .94 }} onClick={() => go(-1)} disabled={page === 0}
            style={{ ...S.pageBtn, opacity: page === 0 ? .3 : 1 }}><ChevronLeft size={14} /> Anterior</motion.button>
          <div style={{ display: "flex", gap: 5 }}>
            {PAGES.map((_, i) => (
              <div key={i} onClick={() => { setDir(i > page ? 1 : -1); setPage(i); }}
                style={{ width: i === page ? 14 : 6, height: 6, borderRadius: 3, background: i === page ? "#c8a97e" : "#e0d4c0", cursor: "pointer", transition: "all .3s" }} />
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.07 }} whileTap={{ scale: .94 }} onClick={() => go(1)} disabled={page === PAGES.length - 1}
            style={{ ...S.pageBtn, opacity: page === PAGES.length - 1 ? .3 : 1 }}>Siguiente <ChevronRight size={14} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Row({ icon, label, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      {icon}
      <span style={{ fontSize: 9, letterSpacing: 3, color: dark ? "#6b5840" : "#a89880", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}
function fmtTime(s) {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

const S = {
  card:       { borderRadius: 12, padding: 18, background: "#faf9f7", border: "1px solid #e8e2d9" },
  darkBtn:    { background: "none", border: "none", cursor: "pointer", color: "#6b5840", display: "flex", alignItems: "center" },
  overlayBtn: { background: "rgba(0,0,0,.5)", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", padding: "3px 5px", display: "flex", alignItems: "center" },
  pageBtn:    { display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #e0d4c0", borderRadius: 20, padding: "5px 10px", fontSize: 11, color: "#8a7560", cursor: "pointer", fontFamily: "'Lora',serif" },
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function LoveLetter() {

  const [cursor, setCursor] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const h = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'Lora',serif", cursor: "none" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #c8a97e; border-radius: 2px; }
        input[type=range] { cursor: pointer; }
      `}</style>

      <motion.div animate={{ x: cursor.x - 8, y: cursor.y - 8 }} transition={{ type: "spring", stiffness: 600, damping: 40 }}
        style={{ position: "fixed", width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #c8a97e", pointerEvents: "none", zIndex: 9999, mixBlendMode: "multiply" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 20px" }}>
       
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: "#a89880", textTransform: "uppercase", marginBottom: 8 }}>Una carta digital</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: "#1a1714", lineHeight: 1.2 }}>
            Todo lo que guardo<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "#c8a97e" }}>de ti</span>
          </h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6 }}
            style={{ width: 50, height: 1.5, background: "#c8a97e", margin: "14px auto 0" }} />
        </motion.div>

        {/* Music player — full width */}
        <div style={{ marginBottom: 18 }}>
          <MusicPlayer />
        </div>

        {/* 3-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 280px", gap: 18, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <MemoryClock startDate="2026-01-01" />
            <Inventory />
          </div>
          <div><MemoriesGallery /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <CoordinatesMap />
            <MiniPoetry />
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ textAlign: "center", marginTop: 44, color: "#b0a090", fontSize: 11, letterSpacing: 3 }}>
          ✦ &nbsp; hecho con todo &nbsp; ✦
        </motion.div>
      </div>
    </div>
  );
}