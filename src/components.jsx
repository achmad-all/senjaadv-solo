import { useEffect, useRef, useState } from 'react'
import { formatRupiah } from './data'

const ICONS = {
  home: ['M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  tent: ['M2 20L12 4l10 16H2z', 'M12 4v16', 'M8.5 20L12 13l3.5 7'],
  activity: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7v5l3 2'],
  scan: ['M4 8V5a1 1 0 0 1 1-1h3', 'M16 4h3a1 1 0 0 1 1 1v3', 'M20 16v3a1 1 0 0 1-1 1h-3', 'M8 20H5a1 1 0 0 1-1-1v-3', 'M8 12h8'],
  left: ['M15 5l-7 7 7 7'],
  right: ['M9 5l7 7-7 7'],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  back: ['M19 12H5', 'M11 6l-6 6 6 6'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  check: ['M5 13l4 4 10-10'],
  instagram: ['M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z', 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z', 'M17.5 6.5h.01'],
  chat: ['M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z'],
  washer: ['M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M12 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8z', 'M7 6h.01'],
}

export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {(ICONS[name] || []).map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// Animasi muncul saat di-scroll (satu kali per elemen).
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={'reveal ' + (shown ? 'is-in ' : '') + className} style={{ transitionDelay: delay + 'ms' }}>
      {children}
    </div>
  )
}

export function Header({ businessName, onScan, onHome }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" onClick={onHome} aria-label={businessName + ' - ke Beranda'}>
          <span className="brand-mark" aria-hidden="true"><Icon name="tent" size={20} /></span>
          <span className="brand-name">{businessName}</span>
        </button>
        <button className="icon-btn scan-btn" onClick={onScan} aria-label="Buka scanner QR">
          <Icon name="scan" />
        </button>
      </div>
    </header>
  )
}

const TABS = [
  { id: 'home', label: 'Beranda', icon: 'home' },
  { id: 'rent', label: 'Sewa', icon: 'tent' },
  { id: 'activity', label: 'Aktivitas', icon: 'activity' },
]

export function BottomNav({ active, onChange }) {
  return (
    <nav className="nav" aria-label="Navigasi utama">
      {TABS.map((t) => (
        <button key={t.id} className={'nav-item' + (active === t.id ? ' is-active' : '')}
          aria-current={active === t.id ? 'page' : undefined} onClick={() => onChange(t.id)}>
          <Icon name={t.icon} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export function BannerSlider({ slides, onAction }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const reduced = useReducedMotion()
  const count = slides.length
  const go = (n) => setIndex((n + count) % count)

  // Autoplay: berhenti saat hover/fokus/sentuh; setiap perpindahan mengulang hitungan.
  useEffect(() => {
    if (paused || reduced) return
    const t = setTimeout(() => setIndex((n) => (n + 1) % count), 6000)
    return () => clearTimeout(t)
  }, [index, paused, reduced, count])

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchX.current = null
    setPaused(false)
  }

  return (
    <section className="slider" aria-roledescription="carousel" aria-label="Promosi"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true) }} onTouchEnd={onTouchEnd}>
      <div className="slider-track" style={{ transform: 'translateX(' + -index * 100 + '%)' }}>
        {slides.map((s, i) => (
          <article key={s.id} className="slide" style={{ backgroundImage: 'url(' + s.image + ')' }}
            aria-hidden={i !== index} aria-roledescription="slide" aria-label={(i + 1) + ' dari ' + count}>
            <div className="slide-body">
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              {s.action.type === 'link' ? (
                <a className="btn btn-light" href={s.action.url} target="_blank" rel="noopener noreferrer" tabIndex={i === index ? 0 : -1}>
                  <Icon name="instagram" size={18} />{s.action.label}
                </a>
              ) : (
                <button className="btn btn-light" onClick={() => onAction(s.action)} tabIndex={i === index ? 0 : -1}>
                  {s.action.label}<Icon name="arrow" size={18} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="slider-controls">
        <div className="dots" role="group" aria-label="Pilih slide">
          {slides.map((s, i) => (
            <button key={s.id} className={'dot' + (i === index ? ' is-active' : '')} onClick={() => go(i)}
              aria-label={'Slide ' + (i + 1) + ': ' + s.title} aria-current={i === index} />
          ))}
        </div>
        <div className="arrows">
          <button className="icon-btn on-dark" onClick={() => go(index - 1)} aria-label="Slide sebelumnya"><Icon name="left" size={20} /></button>
          <button className="icon-btn on-dark" onClick={() => go(index + 1)} aria-label="Slide berikutnya"><Icon name="right" size={20} /></button>
        </div>
      </div>
    </section>
  )
}

export function ProductCard({ product, onRent }) {
  return (
    <article className="card">
      <img className="card-img" src={product.image} alt={product.name} loading="lazy" />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="card-desc">{product.description}</p>
        <p className="card-price"><strong>{formatRupiah(product.pricePerDay)}</strong> / hari</p>
        <button className="btn btn-primary btn-block" onClick={() => onRent(product.id)}>Sewa</button>
      </div>
    </article>
  )
}
