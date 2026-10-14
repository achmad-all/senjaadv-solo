import { useMemo, useState } from 'react'
import { PRODUCTS, formatRupiah, buildWhatsAppUrl } from './data'
import { calculateRental, calendarDuration, GUARANTEES, validateRental, saveRentalHistory, buildRentalMessage } from './rental'
import { Icon } from './components'

const CATEGORIES = [
  { id: 'utama', label: 'Perlengkapan utama' }, { id: 'tidur', label: 'Sleeping system' },
  { id: 'masak', label: 'Cooking set' }, { id: 'tektok', label: 'Tektok' },
  { id: 'outfit', label: 'Outfit' }, { id: 'camp', label: 'Camp' }, { id: 'tambahan', label: 'Perlengkapan tambahan' },
]
const initialForm = () => ({ name: '', phone: '', pickup: '', returnAt: '', hikingDays: '1', guarantees: [] })

export default function Rent({ productId }) {
  const [category, setCategory] = useState(() => CATEGORIES.some((c) => c.id === PRODUCTS.find((p) => p.id === productId)?.category) ? PRODUCTS.find((p) => p.id === productId).category : 'utama')
  const [selectedSizes, setSelectedSizes] = useState({})
  const [quantities, setQuantities] = useState(() => { const p = PRODUCTS.find((item) => item.id === productId); return productId ? { [p?.sizes?.length ? `${productId}::${p.sizes[0]}` : productId]: 1 } : {} })
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const duration = calendarDuration(form.pickup, form.returnAt)
  const summary = useMemo(() => calculateRental(PRODUCTS, quantities, duration, form.hikingDays), [quantities, duration, form.hikingDays])
  const setField = (key, value) => { setForm((old) => ({ ...old, [key]: value })); setErrors((old) => ({ ...old, [key]: undefined })); setNotice('') }
  const changeQuantity = (id, delta) => setQuantities((old) => ({ ...old, [id]: Math.max(0, (old[id] || 0) + delta) }))
  const productKey = (p) => p.sizes?.length ? `${p.id}::${selectedSizes[p.id] || p.sizes[0]}` : p.id
  const toggleGuarantee = (value) => setField('guarantees', form.guarantees.includes(value) ? form.guarantees.filter((x) => x !== value) : [...form.guarantees, value])
  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validateRental(form, summary.quantityTotal)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setNotice('Periksa kembali data yang ditandai sebelum melanjutkan.'); return }
    const order = { id: `rent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), status: 'Menunggu konfirmasi', form: { ...form, guarantees: [...form.guarantees] }, summary }
    const saved = saveRentalHistory(order)
    const url = buildWhatsAppUrl(buildRentalMessage(order))
    setNotice(saved ? 'Ringkasan tersimpan di riwayat lokal. WhatsApp akan dibuka untuk mengirim pengajuan.' : 'Riwayat lokal tidak dapat disimpan di browser ini. WhatsApp tetap akan dibuka.')
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  const visibleProducts = PRODUCTS.filter((p) => p.category === category)
  return <section className="section rent-page">
    <div className="section-head"><h1>Sewa perlengkapan</h1><p>Pilih perlengkapan, isi jadwal, lalu kirim pengajuan melalui WhatsApp.</p></div>
    <div className="rent-layout">
      <div className="rent-catalog">
        <div className="rent-categories" aria-label="Kategori produk">{CATEGORIES.map((c) => <button key={c.id} className={'rent-category' + (category === c.id ? ' active' : '')} onClick={() => setCategory(c.id)}>{c.label}</button>)}</div>
        <div className="rent-products">{visibleProducts.length ? visibleProducts.map((p) => <article className="rent-product" key={p.id}>
          <img src={p.image} alt={p.name} /><div className="rent-product-info"><h3>{p.name}</h3><p>{p.description}</p><strong>{formatRupiah(p.pricePerDay)} <small>/ hari</small></strong>{p.sizes?.length > 0 && <label className="rent-size-field">Pilih ukuran<select value={selectedSizes[p.id] || p.sizes[0]} onChange={(e) => setSelectedSizes((old) => ({ ...old, [p.id]: e.target.value }))}>{p.sizes.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>}</div>
          <div className="quantity-control"><button type="button" aria-label={'Kurangi ' + p.name} disabled={!quantities[productKey(p)]} onClick={() => changeQuantity(productKey(p), -1)}>−</button><output aria-label={'Jumlah ' + p.name}>{quantities[productKey(p)] || 0}</output><button type="button" aria-label={'Tambah ' + p.name} onClick={() => changeQuantity(productKey(p), 1)}>+</button></div>
        </article>) : <div className="rent-empty"><strong>Belum ada produk di kategori ini</strong><p>Produk baru dapat ditambahkan melalui src/data.js.</p></div>}</div>
      </div>
      <aside className="rent-summary" aria-live="polite"><h2>Ringkasan sewa</h2>
        {summary.lines.length ? <ul className="rent-summary-lines">{summary.lines.map((line) => <li key={line.productId}><span>{line.name} × {line.quantity}</span><strong>{formatRupiah(line.subtotal)}</strong></li>)}</ul> : <p className="muted">Belum ada barang dipilih.</p>}
        <div className="rent-total-row"><span>Total kuantitas</span><strong>{summary.quantityTotal} barang</strong></div>
        <div className="rent-total-row"><span>Durasi tagihan</span><strong>{summary.duration} hari{!duration ? ' (perkiraan)' : ''}</strong></div>
        <div className="rent-total-row"><span>Sebelum diskon</span><strong>{formatRupiah(summary.subtotal)}</strong></div>
        <div className="rent-total-row"><span>Diskon ({Math.round(summary.discountRate * 100)}%)</span><strong className="discount-value">−{formatRupiah(summary.discount)}</strong></div>
        <div className="rent-grand-total"><span>Total akhir</span><strong>{formatRupiah(summary.total)}</strong></div>
        <p className="rent-hint">Total sementara memakai lama pendakian jika tanggal belum lengkap. Diskon 15% berlaku jika lama pendakian lebih dari 2 hari.</p>
      </aside>
    </div>
    <form className="rent-form" onSubmit={submit} noValidate>
      <div className="rent-form-heading"><span>01</span><div><h2>Data penyewa</h2><p>Isi data pengambil dan jadwal sewa.</p></div></div>
      <div className="rent-form-grid">
        <label className="rent-field">Nama pengambil<input value={form.name} onChange={(e) => setField('name', e.target.value)} autoComplete="name" placeholder="Nama lengkap" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
        <label className="rent-field">Nomor telepon<input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} autoComplete="tel" placeholder="Contoh: 081234567890" />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
        <label className="rent-field">Tanggal & waktu pengambilan<input type="datetime-local" value={form.pickup} onChange={(e) => setField('pickup', e.target.value)} />{errors.pickup && <small className="field-error">{errors.pickup}</small>}</label>
        <label className="rent-field">Tanggal & waktu pengembalian<input type="datetime-local" min={form.pickup || undefined} value={form.returnAt} onChange={(e) => setField('returnAt', e.target.value)} />{errors.returnAt && <small className="field-error">{errors.returnAt}</small>}</label>
        <label className="rent-field">Lama pendakian (hari)<input type="number" min="1" step="1" value={form.hikingDays} onChange={(e) => setField('hikingDays', e.target.value)} />{errors.hikingDays && <small className="field-error">{errors.hikingDays}</small>}</label>
      </div>
      <fieldset className="rent-guarantees"><legend>Jenis jaminan <span>(pilih minimal 2)</span></legend><div className="guarantee-options">{GUARANTEES.map((g) => <label key={g} className={'guarantee-option' + (form.guarantees.includes(g) ? ' checked' : '')}><input type="checkbox" checked={form.guarantees.includes(g)} onChange={() => toggleGuarantee(g)} /><span>{g}</span></label>)}</div>{errors.guarantees && <small className="field-error">{errors.guarantees}</small>}</fieldset>
      {errors.products && <p className="field-error form-error">{errors.products}</p>}{notice && <p className="rent-notice" role="status">{notice}</p>}
      <button className="btn btn-primary rent-submit" type="submit"><Icon name="chat" size={18} />Ajukan sewa via WhatsApp</button>
      <p className="rent-disclaimer">Pengajuan belum menjadi pesanan terkonfirmasi. Ketersediaan dan detail akhir perlu dikonfirmasi oleh pihak bisnis.</p>
    </form>
  </section>
}
