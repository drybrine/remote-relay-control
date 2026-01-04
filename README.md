# 🎛️ Remote Relay Control

Sistem kontrol relay ESP32 berbasis web dengan Firebase Realtime Database untuk kontrol perangkat elektronik jarak jauh secara real-time.

## 📋 Deskripsi

Remote Relay Control adalah aplikasi web modern yang memungkinkan Anda mengontrol relay module melalui ESP32 dari mana saja dengan koneksi internet. Sistem ini menggunakan Firebase Realtime Database untuk komunikasi real-time antara web interface dan perangkat ESP32.

## ✨ Fitur Utama

- ✅ **Kontrol Real-time**: Kontrol relay secara langsung melalui web interface
- ✅ **Sinkronisasi Otomatis**: Perubahan status tersinkronisasi otomatis antara ESP32 dan web
- ✅ **Monitoring Device**: Monitor status device seperti IP Address, WiFi Signal (RSSI), Uptime, dan Memory
- ✅ **Responsive Design**: Tampilan mobile-friendly dengan Tailwind CSS dan shadcn/ui
- ✅ **Toast Notifications**: Feedback visual untuk setiap aksi user
- ✅ **Quick Actions**: Tombol cepat untuk kontrol semua relay sekaligus

## 🔧 Hardware Requirements

### Komponen yang Dibutuhkan
- ESP32 Development Board
- Relay Module (Active HIGH/LOW compatible)
- Kabel jumper
- Power supply 5V untuk relay

### Wiring Diagram
```
Relay Module    ESP32
----------------------------------------
VCC      ->     5V (VIN)
GND      ->     GND
IN       ->     GPIO 14
```

## 💻 Software Requirements

### ESP32 Side
- Arduino IDE 2.0+ atau PlatformIO
- Libraries:
  - `WiFi.h`
  - `FirebaseESP32.h`

### Web Application
- Node.js v18+ atau Bun
- npm atau yarn

## 🚀 Quick Start

### 1. Setup Firebase

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan **Realtime Database**
3. Set database rules ke mode test (untuk development):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
4. Catat `Database URL` dan `API Key`

### 2. Setup ESP32

1. Buka file `relay_control.ino` di Arduino IDE
2. Edit konfigurasi WiFi dan Firebase:
```cpp
#define WIFI_SSID       "Nama_WiFi_Anda"
#define WIFI_PASSWORD   "Password_WiFi"
#define FIREBASE_HOST   "https://your-project.firebaseio.com"
#define FIREBASE_AUTH   "your-api-key"
```
3. Upload code ke ESP32
4. Buka Serial Monitor untuk melihat status koneksi

### 3. Setup Web Application

1. Clone repository:
```bash
git clone <repository-url>
cd remote-relay-control
```

2. Install dependencies:
```bash
npm install
# atau
bun install
```

3. Buat file `.env` di root folder:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

4. Jalankan development server:
```bash
npm run dev
# atau
bun run dev
```

5. Buka browser dan akses `http://localhost:8080`

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Firebase SDK** - Real-time Database
- **Tanstack Query** - Data Fetching
- **React Router** - Routing
- **Lucide React** - Icons

### Backend/IoT
- **ESP32** - Microcontroller
- **Arduino Framework** - ESP32 Programming
- **Firebase Realtime Database** - Cloud Database

## 📁 Struktur Project

```
remote-relay-control/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── RelayCard.tsx
│   │   ├── StatusBar.tsx
│   │   └── QuickActions.tsx
│   ├── lib/
│   │   ├── firebase.ts      # Firebase configuration
│   │   ├── relayService.ts  # Relay control logic
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   └── App.tsx
├── public/              # Static files & PHP version
├── relay_control.ino    # ESP32 Arduino code
├── QUICK_START.md       # Panduan cepat
├── SETUP_GUIDE.md       # Panduan lengkap
└── XAMPP_SETUP.md       # Setup dengan XAMPP

```

## 📖 Documentation

- [Quick Start Guide](QUICK_START.md) - Mulai dalam 5 menit
- [Setup Guide](SETUP_GUIDE.md) - Panduan setup lengkap
- [XAMPP Setup](XAMPP_SETUP.md) - Setup dengan XAMPP (PHP version)

## 🔨 Development

### Available Scripts

```bash
# Development server dengan hot reload
npm run dev

# Build untuk production
npm run build

# Build untuk development mode
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)
1. Push code ke GitHub repository
2. Connect repository di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Option 2: Netlify
1. Build project: `npm run build`
2. Upload folder `dist` ke Netlify
3. Configure environment variables
4. Deploy

### Option 3: Self-hosted dengan XAMPP
Lihat [XAMPP_SETUP.md](XAMPP_SETUP.md) untuk panduan lengkap

## 🐛 Troubleshooting

### ESP32 tidak terhubung ke WiFi
- Pastikan SSID dan password benar
- Cek jarak dari router WiFi
- Periksa Serial Monitor untuk error message

### Relay tidak merespon
- Cek koneksi hardware (pin GPIO 14)
- Pastikan Firebase database URL benar
- Periksa Firebase database rules

### Website tidak bisa connect ke Firebase
- Verifikasi file `.env` sudah benar
- Cek Firebase configuration di `src/lib/firebase.ts`
- Buka browser console untuk error details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/drybrine/remote-relay-control/issues).

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**drybrine**
- GitHub: [@drybrine](https://github.com/drybrine)

## ⭐ Show your support

Give a ⭐️ if this project helped you!
