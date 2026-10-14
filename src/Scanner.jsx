import jsQR from 'jsqr'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './components'

function safeHttpUrl(value) {
  try {
    const url = new URL(value.trim())
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}
export default function Scanner({ open, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const lastResultRef = useRef('')
  const [status, setStatus] = useState('Tekan “Mulai kamera” untuk memindai kode QR.')
  const [error, setError] = useState('')
  const [manual, setManual] = useState('')
  const [result, setResult] = useState('')
  const [cameraStarted, setCameraStarted] = useState(false)

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraStarted(false)
  }
  useEffect(() => {
    if (!open) { stopCamera(); return }
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    setError(''); setResult(''); setManual(''); setStatus('Tekan “Mulai kamera” untuk memindai kode QR.')
    return () => { window.removeEventListener('keydown', onKey); stopCamera() }
  }, [open, onClose])

  const processValue = (raw) => {
    const value = String(raw || '').trim()
    if (!value || value === lastResultRef.current) return
    lastResultRef.current = value
    setResult(value)
    const url = safeHttpUrl(value)
    if (url) setStatus('QR berisi tautan web yang dapat dibuka. Pastikan alamatnya tepercaya sebelum melanjutkan.')
    else setStatus('QR terbaca, tetapi hasilnya bukan URL HTTP/HTTPS yang didukung. Tidak ada tautan yang dibuka.')
    stopCamera()
  }
  const startCamera = async () => {
    setError(''); setResult('')
    if (!navigator.mediaDevices?.getUserMedia) { setError('Browser ini tidak menyediakan akses kamera. Coba localhost/HTTPS atau gunakan input manual.'); return }
    try {
      const detector = ('BarcodeDetector' in window) ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null
      detectorRef.current = detector
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      streamRef.current = stream
      if (!videoRef.current) { stream.getTracks().forEach((track) => track.stop()); return }
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCameraStarted(true); setStatus('Arahkan kamera ke kode QR.')
      const scan = async () => {
        if (!streamRef.current || !videoRef.current) return
        try {
          if (detector) {
            const codes = await detector.detect(videoRef.current)
            if (codes.length && codes[0].rawValue) { processValue(codes[0].rawValue); return }
          } else {
            const video = videoRef.current
            if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
              const canvas = canvasRef.current || document.createElement('canvas')
              canvasRef.current = canvas
              canvas.width = video.videoWidth; canvas.height = video.videoHeight
              const context = canvas.getContext('2d', { willReadFrequently: true })
              context.drawImage(video, 0, 0, canvas.width, canvas.height)
              const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
              const code = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'dontInvert' })
              if (code?.data) { processValue(code.data); return }
            }
          }
        } catch { /* frame tidak terbaca; lanjutkan pemindaian */ }
        rafRef.current = requestAnimationFrame(scan)
      }
      rafRef.current = requestAnimationFrame(scan)
    } catch (e) {
      stopCamera()
      if (e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError') setError('Izin kamera ditolak. Izinkan akses kamera di pengaturan browser lalu tekan Mulai kamera lagi.')
      else if (e?.name === 'NotFoundError' || e?.name === 'DevicesNotFoundError') setError('Kamera tidak ditemukan pada perangkat ini. Gunakan input manual.')
      else setError('Kamera gagal dijalankan. Pastikan tidak sedang dipakai aplikasi lain, lalu coba lagi atau gunakan input manual.')
    }
  }
  const openResult = () => {
    const url = safeHttpUrl(result)
    if (!url) { setError('Hanya tautan HTTP atau HTTPS yang dapat dibuka.'); return }
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  if (!open) return null
  return <div className="sheet-backdrop scanner-backdrop" onClick={onClose}><div className="sheet scanner-sheet" role="dialog" aria-modal="true" aria-labelledby="scanner-title" onClick={(e) => e.stopPropagation()}>
    <button className="icon-btn sheet-close" onClick={onClose} aria-label="Tutup scanner"><Icon name="close" /></button>
    <div className="scanner-heading"><span className="scanner-mark"><Icon name="scan" size={26} /></span><div><h2 id="scanner-title">Scan kode QR</h2><p>Pindai kode menggunakan kamera atau masukkan hasilnya secara manual.</p></div></div>
    <div className="scanner-camera"><video ref={videoRef} playsInline muted aria-label="Pratinjau kamera untuk scan QR" className={cameraStarted ? 'scanner-video is-visible' : 'scanner-video'} />{!cameraStarted && <div className="scanner-camera-placeholder"><Icon name="scan" size={42} /><span>Pratinjau kamera muncul di sini</span></div>}</div>
    {!cameraStarted ? <button className="btn btn-primary btn-block" onClick={startCamera}>Mulai kamera</button> : <button className="btn btn-light btn-block scanner-stop" onClick={stopCamera}>Hentikan kamera</button>}
    <p className="scanner-status" role="status">{status}</p>{error && <p className="field-error scanner-error" role="alert">{error}</p>}
    <form className="scanner-manual" onSubmit={(e) => { e.preventDefault(); processValue(manual) }}><label className="rent-field">Input hasil QR secara manual<input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="https://contoh.com" /></label><button className="btn btn-primary" type="submit" disabled={!manual.trim()}>Periksa hasil</button></form>
    {result && <div className="scanner-result"><span className="scanner-result-label">Hasil scan</span><p>{result}</p>{safeHttpUrl(result) && <button className="btn btn-primary btn-block" onClick={openResult}>Buka tautan</button>}</div>}
    <p className="scanner-disclaimer">Tautan tidak dibuka otomatis. Periksa alamatnya sebelum membuka.</p>
  </div></div>
}
