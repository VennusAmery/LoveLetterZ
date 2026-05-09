import {useEffect, useRef, useMemo } from "react";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Check,
  ChevronLeft, ChevronRight, Volume2
} from "lucide-react";

import { 
  X, 
  Heart, 
  Music, 
  Music2, 
  MapPin, 
  Clock, 
  BookOpen, 
  Camera 
} from 'lucide-react';

// ── fotos ──────────────────────────────────────────────────────────────────────
import fotoMeet  from "./assets/fotos/1enero.jpg";
import fotoKiss  from "./assets/fotos/22febrero2026.jpg";
import fotoRand  from "./assets/fotos/2.jpg";
import fotoToday from "./assets/fotos/3.jpg";

import futeca         from "./assets/fotos/futeca.jpeg";
import parqueEcologico from "./assets/fotos/parque-ecologico.jpeg";
import ruinas         from "./assets/fotos/ruinas.jpeg";

import flor1 from "./assets/fotos/flores1.jpeg";
import flor2 from "./assets/fotos/flores2.jpeg";
import flor3 from "./assets/fotos/flores3.jpeg";

// ── fonts ──────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Courier+Prime:ital@0;1&display=swap');`;

// ── PLAYLIST ──────────────────────────────────────────────────────────────────
const PLAYLIST = [
  { id:1, title:"Suenan como tú",  artist:"Mafalda Cardenal",      file:"/LoveLetterZ/audio/suenan-como-tu.mp3", duration:"3:34" },
  { id:2, title:"Miel ♡",          artist:"Valeria Jasso",         file:"/LoveLetterZ/audio/Miel.mp3",           duration:"3:22" },
  { id:3, title:"Mar",             artist:"Valeria Jasso",         file:"/LoveLetterZ/audio/Mar.mp3",            duration:"3:06" },
  { id:4, title:"K.",              artist:"Cigarettes After Sex",  file:"/LoveLetterZ/audio/K.mp3",              duration:"4:29" },
  { id:5, title:"Si tú supieras",  artist:"solamentedan",          file:"/LoveLetterZ/audio/Si-tu-supieras.mp3", duration:"3:27" },
  { id:6, title:"Ojos Color Sol",  artist:"Maullek",               file:"/LoveLetterZ/audio/Ojos-Color-Sol.mp3", duration:"3:17" },
  { id:7, title:"Te Quiero",       artist:"Marlete Volz",          file:"/LoveLetterZ/audio/te-quiero.mp3",      duration:"2:52" },
];

// ── MUSIC PLAYER ──────────────────────────────────────────────────────────────
function MusicPlayer() {
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProg] = useState(0);
  const [duration, setDur]  = useState(0);
  const [volume, setVol]    = useState(0.8);
  const [waving, setWaving] = useState(Array.from({ length: 20 }, () => Math.random()));
  const audioRef = useRef(null);
  const track = PLAYLIST[idx];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setWaving(Array.from({ length: 20 }, () => Math.random())), 400);
    return () => clearInterval(t);
  }, [playing]);

  const loadAndPlay = (i, autoPlay = false) => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = PLAYLIST[i].file;
    audioRef.current.load();
    audioRef.current.volume = volume;
    setProg(0);
    if (autoPlay) setTimeout(() => audioRef.current?.play().then(() => setPlaying(true)).catch(() => {}), 50);
    else setPlaying(false);
  };

  const selectTrack = (i) => {
    setIdx(i);
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = PLAYLIST[i].file;
    audioRef.current.load();
    audioRef.current.volume = volume;
    setProg(0);
    setTimeout(() => audioRef.current?.play().then(() => setPlaying(true)).catch(() => {}), 100);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
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
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
      style={{ borderRadius:16, overflow:"hidden", background:"#100e0c", display:"flex", height:340 }}>

      <audio ref={audioRef} src={track.file}
        onTimeUpdate={() => audioRef.current && setProg((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)}
        onLoadedMetadata={() => audioRef.current && setDur(audioRef.current.duration)}
        onEnded={next} />

      {/* playlist */}
      <div style={{ width:220, borderRight:"1px solid #1e1a16", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", gap:7, borderBottom:"1px solid #1e1a16" }}>
          <Music2 size={12} color="#c8a97e" />
          <span style={{ fontSize:9, letterSpacing:3, color:"#6b5840", textTransform:"uppercase" }}>Canciones con sonido a ti...</span>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {PLAYLIST.map((t, i) => {
            const active = i === idx;
            return (
              <motion.div key={t.id} whileHover={{ x:4 }} onClick={() => selectTrack(i)}
                style={{ padding:"9px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                  background: active ? "#1e1a16" : "transparent",
                  borderLeft: active ? "2px solid #c8a97e" : "2px solid transparent", transition:"all .2s" }}>
                <div style={{ width:18, textAlign:"center", flexShrink:0 }}>
                  {active && playing
                    ? <span style={{ fontSize:8, color:"#c8a97e" }}>▶</span>
                    : <span style={{ fontSize:10, color:"#3d2f1f" }}>{i + 1}</span>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11.5, color: active ? "#f5f0e8" : "#8a7560",
                    fontFamily:"'Lora',serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</div>
                  <div style={{ fontSize:9.5, color: active ? "#c8a97e" : "#4a3828", marginTop:1 }}>{t.artist}</div>
                </div>
                <div style={{ fontSize:9, color:"#3d2f1f", flexShrink:0 }}>{t.duration}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* controls */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"20px 22px" }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:3, color:"#4a3828", textTransform:"uppercase", marginBottom:10 }}>Reproduciendo</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:"#f5f0e8", fontWeight:600, lineHeight:1.2 }}>{track.title}</div>
          <div style={{ fontSize:12, color:"#6b5840", marginTop:4 }}>{track.artist}</div>
        </div>

        {/* waveform */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:40, padding:"0 2px" }}>
          {waving.map((h, i) => (
            <motion.div key={i}
              animate={{ height: playing ? `${20 + h * 80}%` : "20%" }}
              transition={{ duration:0.4, ease:"easeInOut" }}
              style={{ flex:1, background: i < Math.floor((progress / 100) * 20) ? "#c8a97e" : "#2a2420", borderRadius:2 }} />
          ))}
        </div>

        {/* progress */}
        <div>
          <div onClick={seek} style={{ height:3, background:"#1e1a16", borderRadius:2, cursor:"pointer", overflow:"hidden", marginBottom:6 }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#c8a97e,#e8c89e)", width:`${progress}%`, borderRadius:2, transition:"width .5s linear" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:9, color:"#3d2f1f" }}>{fmtTime((progress / 100) * duration)}</span>
            <span style={{ fontSize:9, color:"#3d2f1f" }}>{fmtTime(duration)}</span>
          </div>
        </div>

        {/* buttons */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:22 }}>
          <button onClick={prev} style={S.darkBtn}><SkipBack size={17} /></button>
          <motion.button whileTap={{ scale:0.9 }} onClick={togglePlay}
            style={{ width:44, height:44, borderRadius:"50%", background:"#c8a97e", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {playing ? <Pause size={16} fill="#1a1714" color="#1a1714" /> : <Play size={16} fill="#1a1714" color="#1a1714" />}
          </motion.button>
          <button onClick={next} style={S.darkBtn}><SkipForward size={17} /></button>
        </div>

        {/* volume */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Volume2 size={11} color="#3d2f1f" />
          <input type="range" min={0} max={1} step={0.01} value={volume}
            onChange={e => { setVol(+e.target.value); if (audioRef.current) audioRef.current.volume = +e.target.value; }}
            style={{ flex:1, accentColor:"#c8a97e" }} />
        </div>
      </div>
    </motion.div>
  );
}

// ── MEMORY CLOCK ──────────────────────────────────────────────────────────────
function MemoryClock({ startDate }) {
  const [el, setEl] = useState({});
  useEffect(() => {
    const calc = () => {
      const total = Math.floor((Date.now() - new Date(startDate)) / 86400000);
      setEl({ years: Math.floor(total / 365), months: Math.floor((total % 365) / 30), days: total % 30, total });
    };
    calc(); const t = setInterval(calc, 60000); return () => clearInterval(t);
  }, [startDate]);
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} style={S.card}>
      <Row icon={<Clock size={30} color="#a89880" />} label="¿El tiempo realmente avanza estando contigo?" />
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:50, fontWeight:700, color:"#1a1714", lineHeight:1, marginTop:10 }}>{el.total?.toLocaleString()}</div>
      <div style={{ fontSize:9, color:"#a89880", letterSpacing:2, marginTop:2 }}>DÍAS TRANSCURRIDOS</div>
      <div style={{ display:"flex", gap:18, marginTop:14 }}>
        {[{ v:el.years, l:"años" }, { v:el.months, l:"meses" }, { v:el.days, l:"días" }].map(({ v, l }) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:"#3d2f1f" }}>{v}</div>
            <div style={{ fontSize:9, color:"#b0a090", letterSpacing:2 }}>{l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
const ITEMS = [
  "La sensibilidad escondida detrás de tus bromas y dramatismos",
  "Cómo notas detalles que otros dejarían pasar desapercibidos.",
  "Lo viva que se siente tu energía",
  "La dulzura escondida en tu sarcasmo",
  "Tu forma de querer, incluso cuando no la dices directamente",
  "El engagement que generas en mi corazón sin ni siquiera intentarlo.",
  "Esa dulzura que te hace un perfil único en un mercado tan genérico.",
];

function Inventory() {
  const [checked, setChecked] = useState([0, 1, 3]);
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ ...S.card, textAlign:"left" }}>
      <Row icon={<BookOpen size={13} color="#a89880" />} label="Inventario de tu esencia" />
      <div style={{ display:"flex", flexDirection:"column", gap:9, marginTop:12 }}>
        {ITEMS.map((item, i) => (
          <motion.div key={i} whileHover={{ x:3 }}
            onClick={() => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
            style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
            <div style={{ width:15, height:15, borderRadius:3, border:"1.5px solid #c8a97e",
              background: checked.includes(i) ? "#c8a97e" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
              {checked.includes(i) && <Check size={9} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontSize:12, color: checked.includes(i) ? "#8a7560" : "#3d2f1f",
              textDecoration: checked.includes(i) ? "line-through" : "none", fontFamily:"'Lora',serif" }}>{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── MEMORIES GALLERY ──────────────────────────────────────────────────────────
const SLOTS = [
  { title:"Cuando nos conocimos", key:"meet",  icon:"🕊️", desc:"La foto que tomó la NASA cuando hablamos por primera vez" },
  { title:"Primer beso",          key:"kiss",  icon:"💋",  desc:"La foto que tomó la NASA el día de nuestro primer beso" },
  { title:"Nuestras Citas",       key:"year1", icon:"🧑🏻‍❤️‍👩🏻", desc:"Recuerdos que guardo de cada cita", isCarousel:true },
  { title:"Primeras flores",      key:"trip",  icon:"🌹",  desc:"Cada flor que florece en nuestro cariño", isCarousel:true },
  { title:"Ese día random",       key:"rand",  icon:"🌅",  desc:"Simplemente siendo nosotros" },
  { title:"Hoy",                  key:"today", icon:"✦",   desc:"Un día más a tu lado" },
];

function MiniCarousel({ images }) {
  const [index, setIndex] = useState(0);
  return (
    <div style={{ width:"100%", height:"100%", position:"relative" }}>
      <img src={images[index]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", inset:0, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 5px" }}>
        <button onClick={e => { e.stopPropagation(); setIndex(p => (p - 1 + images.length) % images.length); }} style={S.carouselBtn}>‹</button>
        <button onClick={e => { e.stopPropagation(); setIndex(p => (p + 1) % images.length); }} style={S.carouselBtn}>›</button>
      </div>
      <div style={{ position:"absolute", bottom:5, width:"100%", display:"flex", justifyContent:"center", gap:3 }}>
        {images.map((_, i) => (
          <div key={i} style={{ width:4, height:4, borderRadius:"50%", background: i === index ? "#fff" : "rgba(255,255,255,0.5)" }} />
        ))}
      </div>
    </div>
  );
}

function MemoriesGallery() {
  const [nasaPhotos, setNasaPh]    = useState({});
  const [loadingNasa, setLoadNasa] = useState({});
  const dateRefs = useRef({});

  const [photos] = useState({
    meet:  fotoMeet,
    kiss:  fotoKiss,
    year1: [futeca, parqueEcologico, ruinas],
    trip:  [flor1, flor2, flor3],
    rand:  fotoRand,
    today: fotoToday,
  });

  const handleNasaDate = async (key, date) => {
    setLoadNasa(p => ({ ...p, [key]:true }));
    try {
      const res  = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);
      const data = await res.json();
      if (data.media_type === "image") setNasaPh(p => ({ ...p, [key]:{ url:data.url, title:data.title, date:data.date } }));
      else alert("NASA no tiene imagen para esa fecha, intenta otra.");
    } catch { alert("Error al consultar NASA APOD."); }
    setLoadNasa(p => ({ ...p, [key]:false }));
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}>
      <Row icon={<Camera size={13} color="#a89880" />} label="Our Constellation of Moments" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14 }}>
        {SLOTS.map((slot, si) => (
          <motion.div key={slot.key}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 + si * 0.06 }}
            whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.09)" }}
            style={{ ...S.card, padding:10 }}>
            <input ref={el => dateRefs.current[slot.key] = el} type="date" style={{ display:"none" }}
              onChange={e => handleNasaDate(slot.key, e.target.value)} />
            <div style={{ height:110, borderRadius:8, overflow:"hidden", position:"relative", background:"#f0e8de" }}>
              {Array.isArray(photos[slot.key]) ? (
                <MiniCarousel images={photos[slot.key]} />
              ) : photos[slot.key] ? (
                <img src={photos[slot.key]} alt={slot.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : nasaPhotos[slot.key] ? (
                <>
                  <img src={nasaPhotos[slot.key].url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.8)" }} />
                  <div style={{ position:"absolute", bottom:3, left:4, right:4, fontSize:7.5, color:"#fff", opacity:.7, fontStyle:"italic" }}>NASA · {nasaPhotos[slot.key].date}</div>
                </>
              ) : (
                <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <span style={{ fontSize:22 }}>{slot.icon}</span>
                  <span style={{ fontSize:9, color:"#b0a090" }}>Sin foto aún</span>
                </div>
              )}
              {loadingNasa[slot.key] && (
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#c8a97e" }}>Cargando…</div>
              )}
            </div>
            <div style={{ marginTop:7 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#3d2f1f", fontFamily:"'Lora',serif" }}>{slot.title}</div>
              <div style={{ fontSize:9, color:"#8a7d6a", marginTop:2, lineHeight:"1.2" }}>{slot.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── MAP ───────────────────────────────────────────────────────────────────────
function CoordinatesMap() {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
      style={{ ...S.card, background:"#0f0d0b", border:"none", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,#1e1a16 1px,transparent 0)", backgroundSize:"18px 18px", opacity:.8 }} />
      <div style={{ position:"relative" }}>
        <Row icon={<MapPin size={13} color="#c8a97e" />} label="Coordinadas de Destino" dark />
        <svg viewBox="0 0 200 160" style={{ width:"100%", marginTop:10 }}>
          {[40,80,120,160].map(x => <line key={x} x1={x} y1={0} x2={x} y2={160} stroke="#1e1a16" strokeWidth={1}/>)}
          {[40,80,120].map(y => <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#1e1a16" strokeWidth={1}/>)}
          <path d="M 0 90 Q 60 80 100 85 Q 140 90 200 75" fill="none" stroke="#2a2420" strokeWidth={2}/>
          <path d="M 80 0 Q 95 50 100 85 Q 102 110 98 160" fill="none" stroke="#2a2420" strokeWidth={2}/>
          <path d="M 0 130 Q 50 125 100 120 Q 150 115 200 118" fill="none" stroke="#1e1a16" strokeWidth={1.5}/>
          <motion.circle cx={100} cy={85} r={18} fill="none" stroke="#c8a97e" strokeWidth={.5} opacity={.3}
            animate={{ r:[18,28,18] }} transition={{ duration:2.5, repeat:Infinity }}/>
          <motion.circle cx={100} cy={85} r={10} fill="none" stroke="#c8a97e" strokeWidth={.8} opacity={.5}
            animate={{ r:[10,18,10] }} transition={{ duration:2.5, repeat:Infinity, delay:.4 }}/>
          <circle cx={100} cy={85} r={5} fill="#c8a97e"/>
          <circle cx={100} cy={85} r={2} fill="#fff"/>
          <rect x={55} y={95} width={90} height={26} rx={4} fill="#1a1714"/>
          <text x={100} y={108} textAnchor="middle" fill="#c8a97e" fontSize={7} fontFamily="serif">UMG Sede Central</text>
          <text x={100} y={117} textAnchor="middle" fill="#6b5840" fontSize={5.5} fontFamily="serif">Zona 2, Ciudad de Guatemala</text>
          <text x={100} y={62} textAnchor="middle" fill="#2d2620" fontSize={5} fontFamily="monospace">14.6487° N, 90.5128° W</text>
        </svg>
        <div style={{ marginTop:10, padding:"10px 12px", background:"#1a1714", borderRadius:8 }}>
          <div style={{ fontSize:12, color:"#c8a97e", fontFamily:"'Playfair Display',serif", fontStyle:"italic" }}>"Donde mis órbitas cambiaron ♡"</div>
          <div style={{ fontSize:9.5, color:"#a17855", marginTop:3 }}>Base de Lanzamiento UMG • Zona 2</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── MARKETING STATS ───────────────────────────────────────────────────────────
function MarketingStats() {
  const stats = [
    { label:"Posicionamiento en mi mente", value:"99.9%", w:"100%" },
    { label:"Engagement emocional",        value:"Alto",  w:"95%"  },
    { label:"ROI (Felicidad x Minuto)",    value:"∞",     w:"100%" },
  ];
  return (
    <motion.div style={{ ...S.card, background:"#100e0c", border:"none", color:"#f5f0e8", marginTop:14 }}>
      <Row icon={<Camera size={13} color="#c8a97e" />} label="Métricas de Impacto" dark />
      <div style={{ marginTop:15 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, marginBottom:4, letterSpacing:1, color:"#8a7560" }}>
              <span>{s.label}</span><span>{s.value}</span>
            </div>
            <div style={{ height:2, background:"#1e1a16", borderRadius:2 }}>
              <motion.div initial={{ width:0 }} animate={{ width:s.w }} transition={{ duration:2, delay:i * 0.3 }}
                style={{ height:"100%", background:"#c8a97e" }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
// ── STAR CHART ────────────────────────────────────────────────────────────────
// Estrellas estáticas generadas una sola vez (useMemo evita el re-render)
const STATIC_STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i,
  cx: +(Math.random() * 100).toFixed(2),
  cy: +(Math.random() * 100).toFixed(2),
  r:  +(Math.random() * 0.35 + 0.08).toFixed(2),
  twinkle: Math.random() > 0.7,
  dur: (1.8 + Math.random() * 3).toFixed(1),
  delay: (Math.random() * 5).toFixed(1),
}));
 
// Meteoros: cada uno con posición y tiempo de aparición distintos
const METEORS = [
  { top:"8%",  left:"4%",  rotate:34, delay:1.5,  repeatDelay:7  },
  { top:"14%", left:"52%", rotate:34, delay:5.5,  repeatDelay:9  },
  { top:"6%",  left:"27%", rotate:34, delay:10.2, repeatDelay:13 },
  { top:"20%", left:"70%", rotate:34, delay:3.8,  repeatDelay:11 },
];
 
function Meteor({ style }) {
  return (
    <motion.div
      style={{
        position:"absolute", width:90, height:1.5,
        background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.9))",
        borderRadius:2, pointerEvents:"none",
        top: style.top, left: style.left,
        rotate: style.rotate,
        zIndex: 1,
      }}
      initial={{ x:0, y:0, opacity:0 }}
      animate={{ x:200, y:140, opacity:[0, 1, 1, 0] }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        repeatDelay: style.repeatDelay,
        delay: style.delay,
        ease: "easeIn",
        times: [0, 0.1, 0.8, 1],
      }}
    />
  );
}
 
function StarNode({ x, y, label, date }) {
  return (
    <div style={{ position:"absolute", left:x, top:y, transform:"translate(-50%,-50%)", textAlign:"center", zIndex:3 }}>
      {/* wrapper centrado — anillos se posicionan relativo al punto */}
      <div style={{ position:"relative", width:12, height:12, margin:"0 auto" }}>
        {/* anillo exterior */}
        <motion.div style={{
          position:"absolute",
          width:32, height:32, borderRadius:"50%",
          border:"1px solid #c8a97e",
          top:"50%", left:"50%",
          marginTop:-16, marginLeft:-16,
          pointerEvents:"none",
        }}
          animate={{ scale:[1, 2.2, 1], opacity:[0.35, 0, 0.35] }}
          transition={{ duration:2.6, repeat:Infinity, ease:"easeOut" }}
        />
        {/* anillo medio */}
        <motion.div style={{
          position:"absolute",
          width:18, height:18, borderRadius:"50%",
          border:"1px solid #c8a97e",
          top:"50%", left:"50%",
          marginTop:-9, marginLeft:-9,
          pointerEvents:"none",
        }}
          animate={{ scale:[1, 1.7, 1], opacity:[0.55, 0.1, 0.55] }}
          transition={{ duration:2.6, repeat:Infinity, ease:"easeOut", delay:0.4 }}
        />
        {/* punto central */}
        <motion.div whileHover={{ scale:1.9 }}
          style={{
            width:12, height:12, background:"#c8a97e", borderRadius:"50%",
            cursor:"pointer", position:"relative", zIndex:1,
            boxShadow:"0 0 10px #c8a97e, 0 0 22px rgba(200,169,126,.45)",
          }}
        />
      </div>
      <div style={{ fontSize:12, color:"#fff", marginTop:14, fontWeight:600, width:150, marginLeft:-69, fontFamily:"'Playfair Display',serif", textShadow:"0 1px 6px #000" }}>
        {label}
      </div>
      <div style={{ fontSize:9, color:"#8a7560", letterSpacing:1, marginTop:4, marginLeft:-69 }}>{date}</div>
    </div>
  );
}
 
function StarChart() {
  // useMemo para que las estrellas no se regeneren en cada render
  const stars = useMemo(() => STATIC_STARS, []);
 
  return (
    <motion.div
      initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
      style={{
        background:"radial-gradient(ellipse at 30% 40%, #12102a 0%, #060410 60%, #020108 100%)",
        borderRadius:12, padding:"80px 40px",
        position:"relative", overflow:"hidden",
        border:"1px solid #1a1a2e",
        boxShadow:"0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Estrellas de fondo — SVG para mejor rendimiento */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}
        viewBox="0 0 100 100" preserveAspectRatio="none">
        {stars.map(s => (
          <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r * 0.4} fill="white"
            opacity={s.twinkle ? undefined : 0.55}>
            {s.twinkle && (
              <animate attributeName="opacity" values="0.9;0.15;0.9"
                dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite"/>
            )}
          </circle>
        ))}
      </svg>
 
      {/* Meteoros */}
      {METEORS.map((m, i) => <Meteor key={i} style={m} />)}
 
      <div style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:7, marginBottom:40 }}>
          <span style={{ fontSize:10, letterSpacing:5, color:"#c8a97e", textTransform:"uppercase" }}>
            Misión: Nuestra Línea del Tiempo
          </span>
        </div>
 
        <div style={{ height:260, position:"relative", width:"100%", margin:"0 auto" }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible" }}>
            <motion.path
              d="M 50,200 C 200,80 600,220 950,60"
              vectorEffect="non-scaling-stroke"
              fill="none"
              stroke="rgba(200,169,126,0.25)"
              strokeWidth="1.5"
              strokeDasharray="6,6"
              initial={{ pathLength:0 }}
              whileInView={{ pathLength:1 }}
              viewport={{ once:true }}
              transition={{ duration:2.5 }}
            />
          </svg>
 
          <StarNode x="10%"  y="75%" label="Te vi por primera vez"  date="16/10/25 • El Big Bang"         />
          <StarNode x="35%"  y="30%" label="Primera conversación"   date="01/01/26 • Gravedad Cero"       />
          <StarNode x="65%"  y="70%" label="Primera cita"           date="22/02/26 • Órbita Estable"      />
          <StarNode x="90%"  y="22%" label="Primer beso"            date="22/02/26 • Combustible Estelar" />
        </div>
      </div>
    </motion.div>
  );
}

// ── LIBRARY ───────────────────────────────────────────────────────────────────
const BOOK_POEMS = [
  { title:"Sobre tu risa",  author:"P. Neruda (adaptado)", excerpt:"Tu risa me hace libre, me pone alas. Soledades me quita, cárcel me arranca.", color:"#4a3828" },
  { title:"El Espacio",     author:"Anónimo",              excerpt:"No hay galaxia más lejana que el silencio entre nosotros, ni estrella más brillante que tu mirada.", color:"#1a1714" },
  { title:"Branding",       author:"M. Benedetti",         excerpt:"Tu nombre es mi palabra favorita, la marca que mi corazón decidió registrar para siempre.", color:"#c8a97e" },
];
function LibrarySection() {
  const [selected, setSelected] = useState(null);
  return (
    <motion.div style={{ ...S.card, marginTop:14 }}>
      <Row icon={<BookOpen size={13} color="#a89880" />} label="Poemas que me recuerdan a ti" />
      <div style={{ display:"flex", gap:8, marginTop:15, overflowX:"auto", paddingBottom:10 }}>
        {BOOK_POEMS.map((book, i) => (
          <motion.div key={i} whileHover={{ y:-5 }} onClick={() => setSelected(i)}
            style={{ minWidth:70, height:100, background:book.color, borderRadius:"2px 5px 5px 2px",
              borderLeft:"3px solid rgba(255,255,255,0.2)", cursor:"pointer", padding:8,
              display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
            <div style={{ fontSize:8, color:"#fff", fontWeight:"bold", fontFamily:"'Playfair Display',serif" }}>{book.title}</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
            style={{ marginTop:10, padding:"10px", background:"#fdfbf8", borderRadius:8, border:"1px solid #e8e2d9" }}>
            <div style={{ fontSize:11, fontStyle:"italic", color:"#3d2f1f", lineHeight:1.4 }}>"{BOOK_POEMS[selected].excerpt}"</div>
            <div style={{ fontSize:8, color:"#a89880", marginTop:5, textAlign:"right" }}>— {BOOK_POEMS[selected].author}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── POETRY BOOK ───────────────────────────────────────────────────────────────
const PAGES = [
  { title:"I. El Lanzamiento",
    body:`Estudias cómo atraer audiencias,\npero no sabes que conmigo\nno te hizo falta estrategia.\n\nFuiste marketing de guerrilla:\nun impacto directo,\nun encuentro inesperado,\nun cambio total en mi mercado interno.`
  },
  { title:"II. Gravedad Zero",
    body:`Dicen que el espacio es vacío,\npero yo lo siento lleno\ncuando hablas de las estrellas.\n\nQuería ser astronauta y terminó\nsiendo el universo mismo\ndonde mis días orbitan\nsin querer aterrizar.`
  },
  { title:"III. Entre Páginas",
    body:`Te veo leer y me pregunto\nsi algún autor habrá logrado\ndescribir la curva de tu espalda\ncuando te pierdes en una historia.\n\nSi fueras un libro, serías ese\nque subrayo con miedo a olvidar\nlo que sentí en el primer capítulo.`
  },
  { title:"IV. Posicionamiento",
    body:`No es una campaña temporal.\nTe has quedado con el 'top of mind'\nde mis mañanas y mis noches.\n\nNo hay competencia posible\ncuando el producto es tu risa\ny el beneficio es mi paz.`
  },
];

function MiniPoetry() {
  const [page, setPage] = useState(0);
  const [dir, setDir]   = useState(1);
  const go = (d) => { setDir(d); setPage(p => Math.max(0, Math.min(PAGES.length - 1, p + d))); };
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
      style={{ ...S.card, background:"#fefcf8", border:"1px solid #e8e2d9", position:"relative", minHeight:320 }}>
      
      {/* notebook lines */}
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{ position:"absolute", left:0, right:0, top:44 + i * 19, height:1, background:"#ede7dd" }} />
      ))}

      {/* bookmark */}
      <div style={{ position:"absolute", right:20, top:0, width:15, height:40,
        background:"#c8a97e", clipPath:"polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)" }} />
      {/* margin line */}
      <div style={{ position:"absolute", top:0, left:38, bottom:0, width:1.5, background:"rgba(240,160,100,.3)" }} />

      <div style={{ position:"relative", paddingLeft:14 }}>
        
        <Row icon={<BookOpen size={13} color="#a89880" />} label="Versos escritos para ti..." />
        <div style={{ position:"absolute", top:0, right:0, fontSize:9.5, color:"#c8a97e", letterSpacing:1 }}>{page + 1} / {PAGES.length}</div>
        <div style={{ minHeight:240, marginTop:14, overflow:"hidden" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={page} custom={dir}
              initial={{ opacity:0, x:dir * 40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:dir * -40 }}
              transition={{ duration:0.32, ease:"easeInOut" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#c8a97e", marginBottom:14, letterSpacing:2, fontFamily:"'Courier Prime',monospace" }}>{PAGES[page].title}</div>
              <pre style={{ fontSize:12.5, color:"#3d2f1f", lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"'Courier Prime',monospace", fontStyle:"italic", margin:0 }}>
                {PAGES[page].body}
              </pre>
            </motion.div>
          </AnimatePresence>

        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:14 }}>
          <motion.button whileHover={{ scale:1.07 }} whileTap={{ scale:.94 }} onClick={() => go(-1)} disabled={page === 0}
            style={{ ...S.pageBtn, opacity: page === 0 ? .3 : 1 }}><ChevronLeft size={14} /> Anterior</motion.button>
          <div style={{ display:"flex", gap:5 }}>
            {PAGES.map((_, i) => (
              <div key={i} onClick={() => { setDir(i > page ? 1 : -1); setPage(i); }}
                style={{ width: i === page ? 14 : 6, height:6, borderRadius:3,
                  background: i === page ? "#c8a97e" : "#e0d4c0", cursor:"pointer", transition:"all .3s" }} />
            ))}
          </div>
          <motion.button whileHover={{ scale:1.07 }} whileTap={{ scale:.94 }} onClick={() => go(1)} disabled={page === PAGES.length - 1}
            style={{ ...S.pageBtn, opacity: page === PAGES.length - 1 ? .3 : 1 }}>Siguiente <ChevronRight size={14} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── SupportShield ───────────────────────────────────────────────────────────────────
function SupportShield() {
  const fears = [
    { id: 1, fear: "Miedo al futuro", response: "Trazaremos el mapa juntos", icon: "🚀" },
    { id: 2, fear: "Inseguridad", response: "Eres mi prioridad N° 1", icon: "💎" },
    { id: 3, fear: "¿Te irás?", response: "Mi contrato es de por vida", icon: "🤝" },
    { id: 4, fear: "No ser suficiente", response: "Eres más de lo que soñé", icon: "✨" },
  ];

  return (
    <div style={{ 
      background: "#fff", 
      padding: "24px", 
      borderRadius: "12px", 
      border: "1px solid #eaddca",
      marginTop: "18px",
      boxShadow: "0 4px 15px rgba(212, 197, 176, 0.1)"
    }}>
      <h3 style={{ fontSize: "10px", letterSpacing: "2px", color: "#c8a97e", marginBottom: "20px", textTransform: "uppercase", textAlign: "center" }}>
        Risk Mitigation Strategy
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {fears.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ x: 5 }}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "12px",
              background: "#fdfcf0",
              borderRadius: "8px",
              border: "1px solid #eee"
            }}
          >
            {/* El "Miedo" siendo bloqueado */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "16px", opacity: 0.3, filter: "grayscale(1)" }}>{item.icon}</div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                style={{ position: "absolute", color: "#e74c3c", fontSize: "20px", fontWeight: "bold" }}
              >
                ✕
              </motion.div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "10px", color: "#a89880", textDecoration: "line-through" }}>
                {item.fear}
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: "13px", color: "#1a1714", fontWeight: "600", marginTop: "2px" }}
              >
                {item.response}
              </motion.div>
            </div>

            {/* Shield Icon */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ color: "#c8a97e" }}
            >
              <Heart size={14} fill="#c8a97e" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div style={{ 
        marginTop: "20px", 
        padding: "10px", 
        border: "1px dashed #c8a97e", 
        borderRadius: "6px",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "9px", color: "#c8a97e", textTransform: "uppercase", fontWeight: "bold" }}>
          Garantía de Acompañamiento
        </p>
        <p style={{ fontSize: "11px", color: "#8a7560", marginTop: "4px" }}>
          "En todas las tormentas, yo soy tu puerto seguro. Lo prometo."
        </p>
      </div>
    </div>
  );
}

// ── PositioningMap ───────────────────────────────────────────────────────────────────
function PositioningMap() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ 
        background: "radial-gradient(circle at 30% 20%, #1a1830, #070611 70%)",
        padding: "24px", 
        borderRadius: "12px", 
        border: "1px solid #1a1a2e",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        marginTop: "14px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden"
      }}
    >

      {/* ✨ estrellas de fondo */}
      {[...Array(40)].map((_, i) => (
        <div key={i}
          style={{
            position: "absolute",
            width: "2px",
            height: "2px",
            background: "white",
            borderRadius: "50%",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8
          }}
        />
      ))}

      {/* Encabezado */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px", marginBottom: "20px" }}>
        <span style={{ fontSize: "10px", color: "#c8a97e", letterSpacing: "2px", textTransform: "uppercase" }}>
          Mapa de percepción
        </span>

        <h2 style={{ fontSize: "18px", color: "#fff", marginTop: "4px", fontWeight: "600" }}>
          Cómo orbitas en mi mundo
        </h2>
      </div>
      
      <div style={{ position: "relative", width: "100%", height: "240px" }}>
        
        {/* ejes como líneas espaciales */}
        <div style={{ position: "absolute", bottom: "0", left: "50%", width: "1px", height: "100%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", top: "50%", left: "0", width: "100%", height: "1px", background: "rgba(255,255,255,0.1)" }} />

        {/* etiquetas */}
        <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "8px", color: "#c8a97e" }}>
          DONDE TODO TIENE SENTIDO
        </span>

        <span style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "8px", color: "#6b7280" }}>
          LO QUE SE SIENTE LEJANO
        </span>

        {/* competencia  */}
        <div style={{ position: "absolute", left: "15%", bottom: "15%" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i}
              style={{
                width: "3px",
                height: "3px",
                background: "#f9f9f9",
                borderRadius: "50%",
                margin: "2px",
                display: "inline-block",
                opacity: 0.5
              }}
            />
          ))}
          <div style={{ fontSize: "9px", color: "#6b7280", marginTop: "4px" }}>
            todo lo demás
          </div>
        </div>

        {/* estrella principal */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ position: "absolute", right: "12%", top: "20%", textAlign: "center" }}
        >
          {/* glow */}
          <div style={{
            width: "16px",
            height: "16px",
            background: "#c8a97e",
            borderRadius: "50%",
            boxShadow: "0 0 20px #c8a97e, 0 0 40px rgba(200,169,126,0.6)",
            margin: "0 auto"
          }} />

          <div style={{ marginTop: "10px", color: "#fff", fontSize: "11px", fontWeight: "600" }}>
            Tú
          </div>

          <div style={{ fontSize: "8px", color: "#c8a97e" }}>
            mi punto de referencia
          </div>
        </motion.div>

        {/* eje labels */}
        <div style={{ position: "absolute", bottom: "-25px", left: "0", right: "0", display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#6b7280" }}>
          <span>← conexión baja</span>
          <span>conexión infinita →</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "8px", color: "#6b7280" }}>espacio que ocupas</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>100%</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "8px", color: "#6b7280" }}>probabilidad de irme</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#c8a97e" }}>0%</div>
        </div>
      </div>

      <p style={{ fontSize: "8px", color: "#6b7280", textAlign: "center", marginTop: "15px", fontStyle: "italic" }}>
        *Análisis basado en 0% competencia detectada y 100% de exclusividad en el mercado.
      </p>
    </motion.div>
  );
}

  
// ── HELPERS ───────────────────────────────────────────────────────────────────
function Row({ icon, label, dark }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
      {icon}
      <span style={{ fontSize:9, letterSpacing:3, color: dark ? "#6b5840" : "#a89880", textTransform:"uppercase" }}>{label}</span>
    </div>
  );
}
function fmtTime(s) {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

const S = {
  card:        { borderRadius:12, padding:18, background:"#faf9f7", border:"1px solid #e8e2d9" },
  darkBtn:     { background:"none", border:"none", cursor:"pointer", color:"#6b5840", display:"flex", alignItems:"center" },
  overlayBtn:  { background:"rgba(0,0,0,.5)", border:"none", borderRadius:4, color:"#fff", cursor:"pointer", padding:"3px 5px", display:"flex", alignItems:"center" },
  pageBtn:     { display:"flex", alignItems:"center", gap:4, background:"none", border:"1px solid #e0d4c0", borderRadius:20, padding:"5px 10px", fontSize:11, color:"#8a7560", cursor:"pointer", fontFamily:"'Lora',serif" },
  carouselBtn: { background:"rgba(255,255,255,0.3)", backdropFilter:"blur(4px)", border:"none", borderRadius:"50%", width:20, height:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:"bold" },
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 5, 10, 0.9)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // Por encima de todo
    backdropFilter: 'blur(8px)',
  },
  card: {
    background: '#fdfcf0', 
    padding: '40px',
    borderRadius: '2px', 
    maxWidth: '450px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(200, 169, 126, 0.1)',
    border: '1px solid #d4c5b0',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#8a7560',
  },
  letterContent: {
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
  },
  stamp: {
    fontSize: '40px',
    marginBottom: '20px',
    opacity: 0.8,
  },
  title: {
    color: '#2d2d2d',
    fontSize: '22px',
    marginBottom: '20px',
  },
  text: {
    color: '#555',
    lineHeight: '1.6',
    fontSize: '15px',
    marginBottom: '25px',
  },
  signature: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '30px',
  },
  startButton: {
    background: '#1a1a2e',
    color: '#c8a97e',
    border: '1px solid #c8a97e',
    padding: '10px 25px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  }
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function LoveLetter() {
const [showModal, setShowModal] = useState(true);

  return (<>
  
      {/* Modal*/}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalStyles.overlay}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={modalStyles.card}
            >
              {/* Botón de cerrar */}
                <button 
                  onClick={() => setShowModal(false)} 
                  style={modalStyles.closeButton}
                >
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>×</span> 
                </button>

              {/* Contenido de la Carta */}
              <div style={modalStyles.letterContent}>
                <div style={modalStyles.stamp}>✉️</div>
                <h2 style={modalStyles.title}>Holaaaa...</h2>
                
                <p style={modalStyles.text}>
                  Antes que nada, si me dices que parece sacado de chat te pego y no te vuelvo hablar 😭,
                  JAJAJA pero quería de alguna forma darte algo diferente, para decirte lo mucho que te quiero
                  sé que no soy muy expresiva en palabras, así busco formas de dartelo entender sin decirlo directamente, 
                  y pues... esto es lo que salió, espero te guste y sepas que cada detalle lo hice pensando en ti, intentado
                  incluir cosas que sé que te gustan, te representan o cosas parte de tu escencia...
                  No se de marketing ni del espacio, pero espero tenga sentido y sino, pido perdón 
                </p>

                <p style={modalStyles.signature}>¿No es demasiado, verdad?</p>
                
                <button 
                  onClick={() => setShowModal(false)} 
                  style={modalStyles.startButton}
                >
                  Empezar 
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido Principal de la Página */}
      <div style={{ minHeight:"100vh", background:"#f5f0e8", fontFamily:"'Lora',serif", cursor:"default" }}>
        <style>{`
          ${FONTS}
          * { box-sizing:border-box; margin:0; padding:0; }
          button { font-family:inherit; }
          ::-webkit-scrollbar { width:3px; }
          ::-webkit-scrollbar-thumb { background:#c8a97e; border-radius:2px; }
          input[type=range] { cursor:pointer; }
        `}</style>

        <div style={{ maxWidth:1240, margin:"0 auto", padding:"32px 20px" }}>

          {/* Header */}
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:9, letterSpacing:5, color:"#a89880", textTransform:"uppercase", marginBottom:8 }}>Una pequeña carta de amor ♡</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:"#1a1714", lineHeight:1.2 }}>
              Todo lo que guardo<br /><span style={{ fontStyle:"italic", fontWeight:400, color:"#c8a97e" }}>de ti</span>
            </h1>

            <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.6 }}
              style={{ width:50, height:1.5, background:"#c8a97e", margin:"14px auto 0" }} />
            </motion.div>

            <div style={{
              marginTop: 12,
              marginBottom: 24,
              fontSize: 12,
              color: "#8a7560",
              fontStyle: "italic",
              maxWidth: 420,
              marginInline: "auto",
              lineHeight: 1.6
            }}>
              No sé exactamente cómo funciona tu mundo, pero intenté y trataré de entenderlo.
              Mezclé estrellas, números y recuerdos para explicarte algo que no sé decir directamente.
            </div>

          {/* Music Player */}
          <div style={{ marginBottom:18 }}>
            <MusicPlayer />
          </div>

          {/* 3 columns */}
          <div style={{ display:"grid", gridTemplateColumns:"280px 1fr 280px", gap:18, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <MemoryClock startDate="2026-01-01" />
              <Inventory />
            </div>

            <div><MemoriesGallery /></div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <CoordinatesMap />
              <MarketingStats />              
            </div>
          </div>

          {/* Star Chart */}
          <div style={{ marginTop:24, marginBottom:40 }}>
            <PositioningMap />
          </div>

          {/* Star Chart */}
          <div style={{ marginTop:24, marginBottom:40 }}>
            <StarChart />
          </div>

          {/* Poetry + Library */}
          <div style={{ display:"grid", gridTemplateColumns:"350px 1fr", gap:18, alignItems:"stretch" }}>
            <div><LibrarySection /></div>
            <div style={{ flex: 1 }}><MiniPoetry /></div>
          </div>

          {/* Footer */}
          <motion.div style={{ textAlign:"center", marginTop:44, color:"#b0a090", fontSize:11, letterSpacing:3 }}
            animate={{ opacity:[0.4, 1, 0.4] }} transition={{ duration:3, repeat:Infinity }}>
            ♡ &nbsp; Una forma distinta de decirte wue te quiero &nbsp; ♡
          </motion.div>
        </div>
      </div>
    </>
  );
}