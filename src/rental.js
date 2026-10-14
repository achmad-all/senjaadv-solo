import { BUSINESS, formatRupiah } from './data.js'

export const RENTAL_STORAGE_KEY = 'outdoor-member:rentals'
export const GUARANTEES = ['KTP', 'STNK', 'KK', 'KIP']

export function calendarDuration(startValue, endValue) {
  if (!startValue || !endValue) return 0
  const start = new Date(startValue)
  const end = new Date(endValue)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.max(1, Math.floor((b - a) / 86400000) + 1)
}

export function calculateRental(products, quantities, duration, hikingDays) {
  // Gunakan durasi kalender bila tanggal lengkap; jika belum, estimasi berdasarkan lama pendakian agar total tidak terlihat Rp 0.
  const billableDays = duration > 0 ? duration : Math.max(1, Number(hikingDays) || 1)
  const lines = products.flatMap((p) => {
    if (p.sizes?.length) return p.sizes.map((size) => {
      const key = `${p.id}::${size}`
      const quantity = Number(quantities[key] || 0)
      return quantity > 0 ? { productId: key, baseProductId: p.id, name: `${p.name} (Size ${size})`, category: p.category, size, quantity, pricePerDay: p.pricePerDay, subtotal: p.pricePerDay * quantity * billableDays } : null
    }).filter(Boolean)
    const quantity = Number(quantities[p.id] || 0)
    return quantity > 0 ? [{ productId: p.id, name: p.name, category: p.category, quantity, pricePerDay: p.pricePerDay, subtotal: p.pricePerDay * quantity * billableDays }] : []
  })
  const quantityTotal = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const discountRate = Number(hikingDays) > 2 ? 0.15 : 0
  const discount = Math.round(subtotal * discountRate)
  return { lines, duration: billableDays, calendarDuration: duration, hikingDays: Number(hikingDays) || 0, quantityTotal, subtotal, discountRate, discount, total: subtotal - discount }
}

export function validateRental(form, selectedCount) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Nama pengambil wajib diisi.'
  const phone = form.phone.replace(/[\s()-]/g, '')
  if (!phone) errors.phone = 'Nomor telepon wajib diisi.'
  else if (!/^\+?[0-9]{9,15}$/.test(phone)) errors.phone = 'Masukkan nomor telepon 9–15 digit.'
  if (!form.pickup) errors.pickup = 'Tanggal dan waktu pengambilan wajib diisi.'
  if (!form.returnAt) errors.returnAt = 'Tanggal dan waktu pengembalian wajib diisi.'
  if (form.pickup && form.returnAt && new Date(form.returnAt) < new Date(form.pickup)) errors.returnAt = 'Pengembalian tidak boleh sebelum pengambilan.'
  if (!selectedCount) errors.products = 'Pilih minimal satu produk untuk disewa.'
  if (form.guarantees.length < 2) errors.guarantees = 'Pilih minimal dua jenis jaminan.'
  if (!Number.isFinite(Number(form.hikingDays)) || Number(form.hikingDays) < 1) errors.hikingDays = 'Lama pendakian minimal 1 hari.'
  return errors
}

export function readRentalHistory() {
  try {
    const raw = localStorage.getItem(RENTAL_STORAGE_KEY)
    if (!raw) return []
    const value = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return value.filter((item) => item && typeof item === 'object' && item.id && item.createdAt && item.form && item.summary)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch { return [] }
}

export function saveRentalHistory(order) {
  const history = readRentalHistory()
  try {
    localStorage.setItem(RENTAL_STORAGE_KEY, JSON.stringify([order, ...history].slice(0, 100)))
    return true
  } catch { return false }
}

export function buildRentalMessage(order) {
  const { form, summary } = order
  const date = (value) => value ? new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
  const lines = [
    `PENGAJUAN SEWA — ${BUSINESS.name}`, '', `Nama pengambil: ${form.name}`, `Nomor telepon: ${form.phone}`,
    `Pengambilan: ${date(form.pickup)}`, `Pengembalian: ${date(form.returnAt)}`,
    `Durasi tagihan: ${summary.duration} hari kalender`, `Lama pendakian: ${form.hikingDays} hari`,
    `Jaminan: ${form.guarantees.join(', ')}`, '', 'DAFTAR BARANG',
    ...summary.lines.map((line, i) => `${i + 1}. ${line.name} (${line.category})\n   Kuantitas: ${line.quantity}\n   Harga/hari: ${formatRupiah(line.pricePerDay)}\n   Subtotal: ${formatRupiah(line.subtotal)}`),
    '', `Total kuantitas: ${summary.quantityTotal}`, `Total sebelum diskon: ${formatRupiah(summary.subtotal)}`,
    `Diskon (${Math.round(summary.discountRate * 100)}%): -${formatRupiah(summary.discount)}`, `TOTAL AKHIR: ${formatRupiah(summary.total)}`,
    '', 'Catatan: ini pengajuan sewa dan menunggu konfirmasi ketersediaan dari pihak bisnis.'
  ]
  return lines.join('\n')
}
