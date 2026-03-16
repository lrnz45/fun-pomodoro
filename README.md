# 🍅 Fun Pomodoro

> Pomodoro timer lucu dan bisa dikustomisasi langsung dari status bar VSCode kamu!

![VSCode](https://img.shields.io/badge/VSCode-^1.100.0-007ACC?style=flat-square&logo=visual-studio-code)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Fitur

- **Timer langsung di status bar** — countdown tampil di pojok kiri bawah VSCode, ga perlu buka app lain
- **Tombol start, stop, dan config** — semua kontrol ada di status bar, 1 klik langsung jalan
- **Pop-up warning saat stop** — kalau timer dihentikan di tengah jalan, muncul halaman konfirmasi keren dengan pilihan lanjut atau reset
- **Notifikasi saat selesai** — timer habis? Langsung muncul halaman selebrasi dengan tombol mulai istirahat
- **Mode kerja & istirahat** — otomatis ganti mode setelah tiap sesi selesai
- **Peringatan visual** — status bar berubah warna merah saat 1 menit tersisa
- **Emoji kustom** — ganti emoji timer sesuka hati (🍅🦊🐼🦄 atau apapun!)
- **Durasi bisa diatur** — atur lama kerja dan istirahat langsung dari Settings VSCode

---

## 🚀 Cara Pakai

### Install

> *(Segera tersedia di VSCode Marketplace)*

Atau install manual lewat file `.vsix`:

```bash
code --install-extension fun-pomodoro-0.0.1.vsix
```

### Mulai timer

1. Lihat status bar di pojok **kiri bawah** VSCode
2. Klik tombol **▶** atau jalankan command `Pomodoro: Mulai` via `Ctrl+Shift+P`
3. Timer langsung jalan! 🍅

### Kontrol di status bar

| Ikon | Fungsi |
|------|--------|
| `▶` / `⟳` | Mulai / sedang berjalan |
| `🍅 25:00` | Tampilan timer (klik untuk mulai) |
| `⏹` | Stop timer |
| `⚙` | Buka pengaturan |

---

## ⚙️ Kustomisasi

Buka **Settings VSCode** (`Ctrl+,`) lalu cari `Fun Pomodoro`, atau klik ikon `⚙` di status bar.

| Setting | Default | Keterangan |
|---------|---------|------------|
| `pomodoro.workMinutes` | `25` | Durasi sesi kerja (menit) |
| `pomodoro.breakMinutes` | `5` | Durasi istirahat (menit) |
| `pomodoro.emoji` | `🍅` | Emoji yang tampil di timer |

---

## 📸 Screenshot

### Status bar
```
▶  🍅 24:37  ⏹  ⚙
```

### Pop-up stop warning
Muncul saat kamu menghentikan timer di tengah sesi — bisa pilih **Lanjut** atau **Reset**.

### Pop-up sesi selesai
Muncul otomatis saat timer habis — langsung bisa mulai istirahat atau tutup.

---

## 🛠️ Development

### Prerequisites

- Node.js >= 18
- VSCode >= 1.100.0

### Setup

```bash
git clone https://github.com/lrnz45/fun-pomodoro
cd fun-pomodoro
npm install
```

### Jalankan

```bash
# Compile sekali
npm run compile

# Watch mode (auto-compile saat ada perubahan)
npm run watch
```

Lalu tekan **F5** di VSCode untuk buka Extension Development Host.

### Build & Package

```bash
npm install -g @vscode/vsce
vsce package
# Menghasilkan fun-pomodoro-0.0.1.vsix
```

### Struktur project

```
fun-pomodoro/
├── src/
│   └── extension.ts    ← semua logic timer & webview
├── out/                ← hasil compile TypeScript
├── package.json        ← manifest, commands, config
├── tsconfig.json
└── .vscode/
    └── launch.json
```

---

## 🧠 Cara Kerja

1. **Aktivasi** — ekstensi aktif saat command `pomodoro.*` dipanggil pertama kali
2. **Status bar** — 4 item ditampilkan di kiri bawah: play, timer, stop, gear
3. **Timer** — menggunakan `setInterval` 1 detik, countdown dari menit × 60
4. **WebView Panel** — pop-up stop dan selesai dibuat dengan WebView HTML murni, komunikasi dua arah via `postMessage`
5. **Config** — baca dari `vscode.workspace.getConfiguration('pomodoro')` tiap sesi mulai

---

## 📝 Commands

Semua command bisa dijalankan via `Ctrl+Shift+P`:

| Command | Deskripsi |
|---------|-----------|
| `Pomodoro: Mulai` | Mulai sesi timer |
| `Pomodoro: Stop` | Hentikan timer (muncul warning) |
| `Pomodoro: Reset` | Reset timer ke awal |
| `Pomodoro: Kustomisasi` | Buka halaman pengaturan |

---

## 🤝 Kontribusi

Pull request welcome! Untuk perubahan besar, buka issue dulu ya.

1. Fork repo ini
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`
3. Commit: `git commit -m 'Tambah fitur keren'`
4. Push: `git push origin fitur/nama-fitur`
5. Buka Pull Request

---

## 📄 License

MIT © 2025 — bebas dipakai, dimodifikasi, dan didistribusikan.

---

<p align="center">Dibuat dengan ☕ dan sedikit prokrastinasi</p>
