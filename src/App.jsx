import { useCallback, useState } from 'react'
import { BUSINESS, PRODUCTS, SLIDES, LAUNDRY_SERVICES, formatRupiah, buildWhatsAppUrl } from './data'
import { Header, BottomNav, BannerSlider, ProductCard, Reveal, Icon } from './components'
import Scanner from './Scanner'
import Rent from './Rent'
import Activity from './Activity'

export default function App() {
  const [view, setView] = useState('home')
  const [productId, setProductId] = useState(null)
  const [scanning, setScanning] = useState(false)
  const go = useCallback((nextView, nextProductId = null) => {
    setView(nextView)
    setProductId(nextProductId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const onSlideAction = (action) => {
    if (action.type === 'view') go(action.target, action.target === 'rent' ? null : undefined)
    else if (action.type === 'link' && action.url) window.open(action.url, '_blank', 'noopener,noreferrer')
  }
  const activeTab = view === 'laundry' ? 'home' : view
  return <div className="app">
    <Header businessName={BUSINESS.name} onScan={() => setScanning(true)} onHome={() => go('home')} />
    <main className="page" key={view}>
      {view === 'home' && <Home onSlideAction={onSlideAction} onRent={(id) => go('rent', id)} />}
      {view === 'laundry' && <Laundry onBack={() => go('home')} />}
      {view === 'rent' && <Rent key={productId || 'rent-empty'} productId={productId} />}
      {view === 'activity' && <Activity />}
    </main>
    <BottomNav active={activeTab} onChange={(id) => go(id)} />
    <Scanner open={scanning} onClose={() => setScanning(false)} onNavigate={go} />
  </div>
}

function Home({ onSlideAction, onRent }) {
  return <>
    <BannerSlider slides={SLIDES} onAction={onSlideAction} />
    <section className="section">
      <div className="section-head"><h2>Alat unggulan</h2><p>Harga sewa per hari. Pilih alat untuk mulai menyewa.</p></div>
      <div className="grid">{PRODUCTS.slice(0, 4).map((p, i) => <Reveal key={p.id} delay={(i % 4) * 70}><ProductCard product={p} onRent={onRent} /></Reveal>)}</div>
      <button className="btn btn-primary home-all-products" onClick={() => onRent(null)}>Lihat semua perlengkapan <Icon name="arrow" size={18} /></button>
    </section>
  </>
}
function Laundry({ onBack }) {
  const message = 'Halo ' + BUSINESS.name + ', saya ingin bertanya tentang layanan laundry perlengkapan outdoor.'
  return <section className="section narrow"><button className="back" onClick={onBack}><Icon name="back" size={18} />Beranda</button><h1>Laundry perlengkapan outdoor</h1>
    <p className="lead">Perlengkapan dicuci sesuai bahannya, lalu dikeringkan sebelum diserahkan kembali. Harga di bawah adalah contoh.</p>
    <ul className="price-list">{LAUNDRY_SERVICES.map((s) => <li key={s.name}><span>{s.name}</span><strong>{formatRupiah(s.price)}</strong></li>)}</ul>
    <a className="btn btn-primary" href={buildWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} />Tanya laundry via WhatsApp</a>
  </section>
}
