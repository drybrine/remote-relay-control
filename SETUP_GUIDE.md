# Remote Relay Control

Sistem kontrol relay ESP32 berbasis web dengan Firebase Realtime Database.

## 🚀 Fitur

- ✅ Kontrol relay secara real-time via website
- ✅ Sinkronisasi otomatis antara ESP32 dan web interface
- ✅ Monitoring status device (IP, RSSI, Uptime, Memory)
- ✅ Responsive design dengan Tailwind CSS
- ✅ Toast notifications untuk feedback user
- ✅ Firebase Realtime Database untuk komunikasi

## 🔧 Hardware Setup

### Komponen yang Dibutuhkan
- ESP32 Development Board
- Relay Module (Active HIGH)
- Kabel jumper
- Power supply 5V

### Koneksi Hardware
```
Relay Module    ESP32
----------------------------------------
VCC      ->     5V (VIN)
GND      ->     GND
IN       ->     GPIO 14
```

## 📦 Software Requirements

### ESP32
- Arduino IDE atau PlatformIO
- Library:
  - WiFi.h
  - FirebaseESP32.h

### Website
- Node.js v18+ atau Bun
- React + TypeScript
- Vite
- Firebase SDK

## ⚙️ Konfigurasi

### 1. Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Realtime Database:
   - Pilih region: `asia-southeast1`
   - Mode: Test mode (untuk development)
3. Salin credentials:
   - Database URL: `https://[PROJECT-ID]-default-rtdb.asia-southeast1.firebasedatabase.app`
   - API Key: Dari Project Settings > General

### 2. Konfigurasi ESP32

Edit file `relay_control.ino`:

```cpp
// WiFi Credentials
#define WIFI_SSID       "NAMA_WIFI_ANDA"
#define WIFI_PASSWORD   "PASSWORD_WIFI_ANDA"

// Firebase Credentials
#define FIREBASE_HOST   "https://[PROJECT-ID]-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH   "YOUR_API_KEY"

// Pin Configuration
#define RELAY_PIN 14  // Sesuaikan dengan GPIO yang digunakan
```

Upload ke ESP32:
```bash
# Via Arduino IDE: Tools > Upload
# Via PlatformIO: pio run --target upload
```

### 3. Konfigurasi Website

1. Clone repository dan install dependencies:
```bash
npm install
# atau
bun install
```

2. Edit file `.env`:
```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_DATABASE_URL=https://[PROJECT-ID]-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project-id
```

3. Jalankan development server:
```bash
npm run dev
# atau
bun dev
```

4. Build untuk production:
```bash
npm run build
# atau
bun build
```

## 🎮 Cara Penggunaan

### Web Interface

1. Buka browser ke `http://localhost:5173` (development) atau URL hosting Anda
2. Website akan otomatis terhubung ke Firebase
3. Klik tombol toggle untuk menghidupkan/mematikan relay
4. Status akan langsung tersinkronisasi ke ESP32

### Quick Actions
- **All ON**: Nyalakan relay
- **All OFF**: Matikan relay  
- **Reset**: Reset ke kondisi OFF

### Monitoring
- Status koneksi (hijau = online, merah = offline)
- Informasi device:
  - IP Address ESP32
  - Signal strength (RSSI)
  - Uptime
  - Free memory

## 📊 Firebase Data Structure

```json
{
  "relay": {
    "status": false,
    "lastControl": 1704326400000,
    "lastUpdate": "2026-01-04T10:00:00.000Z",
    "deviceOnline": true,
    "deviceIP": "192.168.1.100",
    "device": {
      "deviceOnline": true,
      "deviceIP": "192.168.1.100",
      "rssi": -45,
      "uptime": 3600,
      "freeHeap": 245760
    }
  }
}
```

## 🔐 Firebase Security Rules

Untuk production, update Security Rules di Firebase Console:

```json
{
  "rules": {
    "relay": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 🚀 Deploy

### Deploy ESP32
1. Upload code ke ESP32
2. Monitor Serial untuk memastikan koneksi WiFi dan Firebase berhasil

### Deploy Website

#### Vercel
```bash
npm run build
vercel --prod
```

#### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

#### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🐛 Troubleshooting

### ESP32 tidak bisa connect ke WiFi
- Cek SSID dan password
- Pastikan WiFi 2.4GHz (ESP32 tidak support 5GHz)
- Cek signal strength

### Website tidak bisa connect ke Firebase
- Cek credentials di `.env`
- Pastikan Realtime Database sudah diaktifkan
- Cek Firebase Console untuk error logs

### Relay tidak merespon
- Cek koneksi hardware (VCC, GND, IN)
- Pastikan relay module Active HIGH
- Monitor Serial untuk debug info

### Data tidak sinkron
- Cek koneksi internet ESP32
- Refresh website
- Cek Firebase Console untuk data structure

## 📝 Development

### Project Structure
```
├── relay_control.ino          # ESP32 firmware
├── src/
│   ├── lib/
│   │   ├── firebase.ts        # Firebase config
│   │   └── relayService.ts    # Relay control service
│   ├── pages/
│   │   └── Index.tsx          # Main page
│   └── components/            # UI components
├── .env                       # Environment variables
└── package.json
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: TailwindCSS, Radix UI, Shadcn/ui
- **Backend**: Firebase Realtime Database
- **Hardware**: ESP32, Arduino Framework

## 📄 License

MIT License

## 👥 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📧 Support

Jika ada pertanyaan, silakan buat issue di repository ini.

---

**Made with ❤️ for IoT enthusiasts**
