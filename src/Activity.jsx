import { readRentalHistory } from './rental'
import { formatRupiah } from './data'
import { useEffect, useState } from 'react'
import { Icon } from './components'

const fmtDate = (value, includeTime = false) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('id-ID', includeTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' })
}
export default function Activity() {
  const [history, setHistory] = useState(() => readRentalHistory())
  useEffect(() => {
    const refresh = () => setHistory(readRentalHistory())
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh) }
  }, [])
  return <section className="section activity-page">
    <div className="section-head"><h1>Aktivitas</h1><p>Riwayat pengajuan sewa yang tersimpan di browser ini.</p></div>
    {!history.length ? <div className="activity-empty"><span className="activity-empty-icon"><Icon name="activity" size={28} /></span><h2>Belum ada aktivitas</h2><p>Pengajuan sewa yang dikirim dari perangkat ini akan muncul di sini.</p></div> : <div className="activity-list">{history.map((order) => <article className="activity-card" key={order.id}>
      <div className="activity-card-head"><div><span className="activity-date">Diajukan {fmtDate(order.createdAt, true)}</span><h2>{order.form?.name || 'Penyewa'}</h2></div><span className="activity-status">{order.status || 'Menunggu konfirmasi'}</span></div>
      <div className="activity-dates"><div><span>Pengambilan</span><strong>{fmtDate(order.form?.pickup, true)}</strong></div><div><span>Pengembalian</span><strong>{fmtDate(order.form?.returnAt, true)}</strong></div></div>
      <div className="activity-products"><h3>Barang yang diajukan</h3>{(order.summary?.lines || []).map((line) => <div className="activity-product-line" key={line.productId || line.name}><span>{line.name} <small>({line.category}) × {line.quantity}</small></span><strong>{formatRupiah(Number(line.subtotal) || 0)}</strong></div>)}</div>
      <div className="activity-meta"><span>Lama pendakian <strong>{order.form?.hikingDays || '—'} hari</strong></span><span>Jaminan <strong>{(order.form?.guarantees || []).join(', ') || '—'}</strong></span><span>Total barang <strong>{order.summary?.quantityTotal || 0}</strong></span></div>
      <div className="activity-price"><div><span>Sebelum diskon</span><strong>{formatRupiah(Number(order.summary?.subtotal) || 0)}</strong></div><div><span>Diskon</span><strong>−{formatRupiah(Number(order.summary?.discount) || 0)}</strong></div><div className="activity-final"><span>Total pengajuan</span><strong>{formatRupiah(Number(order.summary?.total) || 0)}</strong></div></div>
    </article>)}</div>}
    <p className="activity-footnote">Riwayat ini hanya tersimpan di browser dan perangkat yang sama. Data tidak dikirim ke database terpusat dan dapat hilang jika data browser dihapus.</p>
  </section>
}
