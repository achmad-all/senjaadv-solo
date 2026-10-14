import test from 'node:test'
import assert from 'node:assert/strict'
import { PRODUCTS } from '../src/data.js'
import { calendarDuration, calculateRental, validateRental, buildRentalMessage } from '../src/rental.js'

test('durasi menggunakan hari kalender inklusif dan minimal satu hari', () => {
  assert.equal(calendarDuration('2026-10-10T10:00', '2026-10-10T11:00'), 1)
  assert.equal(calendarDuration('2026-10-10T10:00', '2026-10-12T11:00'), 3)
  assert.equal(calendarDuration('2026-10-12T10:00', '2026-10-10T11:00'), 0)
  assert.equal(calendarDuration('', '2026-10-10T11:00'), 0)
})

test('diskon tidak berlaku untuk pendakian dua hari', () => {
  const summary = calculateRental(PRODUCTS, { 'carrier-60': 1 }, 2, 2)
  assert.equal(summary.subtotal, 80000)
  assert.equal(summary.discount, 0)
  assert.equal(summary.total, 80000)
})

test('diskon 15 persen dan total multi-produk dihitung satu kali', () => {
  const summary = calculateRental(PRODUCTS, { 'carrier-60': 1, 'sleeping-bag': 2 }, 3, 3)
  assert.equal(summary.subtotal, 270000)
  assert.equal(summary.discountRate, 0.15)
  assert.equal(summary.discount, 40500)
  assert.equal(summary.total, 229500)
  assert.equal(summary.quantityTotal, 3)
  assert.equal(summary.lines.length, 2)
})

const validForm = { name: 'Pengguna Uji', phone: '081234567890', pickup: '2026-10-10T10:00', returnAt: '2026-10-12T10:00', hikingDays: '3', guarantees: ['KTP', 'KK'] }
test('validasi menerima formulir yang valid', () => assert.deepEqual(validateRental(validForm, 1), {}))
test('validasi mendeteksi nama, telepon, tanggal, produk, dan jaminan yang tidak valid', () => {
  const errors = validateRental({ ...validForm, name: ' ', phone: 'nomor', pickup: '', returnAt: '2026-10-01T10:00', guarantees: ['KTP'] }, 0)
  for (const field of ['name', 'phone', 'pickup', 'products', 'guarantees']) assert.ok(errors[field], `expected ${field} validation`)
  const reversed = validateRental({ ...validForm, pickup: '2026-10-12T10:00', returnAt: '2026-10-10T10:00' }, 1)
  assert.ok(reversed.returnAt)
})
test('pesan WhatsApp berisi rincian barang, diskon, dan total akhir', () => {
  const summary = calculateRental(PRODUCTS, { 'carrier-60': 1, 'sleeping-bag': 2 }, 3, 3)
  const message = buildRentalMessage({ form: validForm, summary })
  assert.match(message, /Carrier 60 Liter/)
  assert.match(message, /Sleeping Bag Hangat/)
  assert.match(message, /Diskon \(15%\)/)
  assert.match(message, /TOTAL AKHIR: Rp\s*229\.500/)
  assert.match(message, /menunggu konfirmasi/i)
})
