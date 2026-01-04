# Quick Start Guide

## 🚀 Memulai dalam 5 Menit

### Step 1: Upload Code ke ESP32

1. Buka `relay_control.ino` di Arduino IDE
2. Edit konfigurasi WiFi dan Firebase:
```cpp
#define WIFI_SSID       "Nama_WiFi_Anda"
#define WIFI_PASSWORD   "Password_WiFi"
#define FIREBASE_HOST   "https://your-project.firebaseio.com"
#define FIREBASE_AUTH   "your-api-key"
```
3. Upload ke ESP32 (Ctrl + U)
4. Buka Serial Monitor (Ctrl + Shift + M) untuk cek koneksi

### Step 2: Setup Website

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` dengan isi:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser: `http://localhost:8080`

### Step 3: Test Koneksi

1. Website akan menampilkan status "Connected" (hijau) jika ESP32 online
2. Klik tombol toggle relay
3. LED pada relay module akan menyala/mati
4. Status akan tersinkronisasi real-time

## ✅ Checklist Troubleshooting

- [ ] ESP32 terhubung ke WiFi?
- [ ] Serial Monitor menampilkan "Stream started successfully!"?
- [ ] Firebase Realtime Database sudah aktif?
- [ ] Credentials di ESP32 dan website sudah sama?
- [ ] Relay terhubung dengan benar ke GPIO 14?
- [ ] Browser bisa akses localhost:8080?

## 📱 Akses dari HP/Device Lain

1. Cek IP komputer Anda:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. Di browser HP, buka:
```
http://[IP_KOMPUTER]:8080
```

Contoh: `http://192.168.1.100:8080`

## 🌐 Deploy ke Internet (Optional)

### Firebase Hosting (Gratis)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login dan init:
```bash
firebase login
firebase init hosting
```

3. Build dan deploy:
```bash
npm run build
firebase deploy
```

URL Anda: `https://your-project.web.app`

## 🔒 Keamanan (Production)

### Firebase Rules
Di Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "relay": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Note**: Untuk production, implementasikan authentication!

## 📊 Monitoring

### Serial Monitor ESP32
```
=================================
ESP32 Firebase Relay Controller
=================================

Connecting to WiFi: Your_WiFi
✓ WiFi Connected!
  IP Address: 192.168.1.100
  Signal Strength: -45 dBm

✓ Last relay status: OFF
✓ Stream started successfully!

>>> Sistem Siap! <<<

Device status updated
⚡ RELAY: ON
Device status updated
○ RELAY: OFF
```

### Browser Console
Tekan F12 untuk membuka DevTools dan lihat logs Firebase connection.

## 🎯 Next Steps

- [ ] Tambahkan lebih banyak relay
- [ ] Implementasikan scheduling/timer
- [ ] Tambahkan sensor (temperature, humidity)
- [ ] Buat mobile app
- [ ] Tambahkan user authentication
- [ ] Integrasi dengan Google Assistant/Alexa

## 💡 Tips

1. **Gunakan WiFi 2.4GHz** - ESP32 tidak support 5GHz
2. **Signal strength** - RSSI < -70 dBm = koneksi lemah
3. **Power supply** - Gunakan power supply yang cukup (minimal 500mA)
4. **Relay Active HIGH** - HIGH = ON, LOW = OFF
5. **Firebase limit** - Free tier: 10GB/month transfer, 1GB storage

## 📞 Support

**Bermasalah?**
- Cek file SETUP_GUIDE.md untuk panduan lengkap
- Serial Monitor untuk debug ESP32
- Browser Console (F12) untuk debug website
- Firebase Console untuk cek data structure

---

**Happy Hacking! 🚀**
