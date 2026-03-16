<<<<<<< HEAD
# fun-pomodoro README

This is the README for your extension "fun-pomodoro". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
=======
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
>>>>>>> aa185ed8a897edbecd6149e27ecde1da52d975b3
