# Setup XAMPP untuk Kontrol Relay Firebase

## Panduan Instalasi dan Konfigurasi

### 1. Persiapan File

File yang dibutuhkan:
- `index.php` - Backend API untuk komunikasi dengan Firebase
- `relay-control.html` - Interface web untuk kontrol relay

### 2. Instalasi XAMPP

1. Download XAMPP dari https://www.apachefriends.org/
2. Install XAMPP di komputer Anda
3. Jalankan XAMPP Control Panel
4. Start Apache service

### 3. Setup File di XAMPP

#### Opsi A: Copy ke htdocs
```bash
# Copy file ke folder htdocs XAMPP
# Windows default: C:\xampp\htdocs\relay-control\
# Linux default: /opt/lampp/htdocs/relay-control/
# Mac default: /Applications/XAMPP/htdocs/relay-control/

mkdir C:\xampp\htdocs\relay-control
copy public\index.php C:\xampp\htdocs\relay-control\
copy public\relay-control.html C:\xampp\htdocs\relay-control\
```

#### Opsi B: Setup Virtual Host
Edit file `httpd-vhosts.conf` di folder XAMPP:
```apache
<VirtualHost *:80>
    DocumentRoot "path/to/remote-relay-control/public"
    ServerName relay.local
    <Directory "path/to/remote-relay-control/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Edit file `hosts` (Windows: C:\Windows\System32\drivers\etc\hosts):
```
127.0.0.1    relay.local
```

### 4. Konfigurasi Firebase

1. Buka Firebase Console (https://console.firebase.google.com)
2. Pilih project Anda
3. Dapatkan Database URL dari Settings > Project Settings

4. Edit file `index.php`, ganti baris berikut dengan konfigurasi Anda:
```php
define('FIREBASE_DATABASE_URL', 'https://your-project-id.firebaseio.com');
```

Contoh:
```php
define('FIREBASE_DATABASE_URL', 'https://relay-control-12345.firebaseio.com');
```

### 5. Setup Firebase Rules (Opsional untuk Development)

Untuk testing, Anda bisa set Firebase Rules menjadi public:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **PENTING**: Jangan gunakan rules public untuk production!

### 6. Menggunakan Firebase Authentication (Recommended)

Jika ingin lebih aman, gunakan Firebase Database Secret atau Service Account:

#### Menggunakan Database Secret (Legacy):
1. Buka Firebase Console > Project Settings > Service Accounts
2. Di bagian "Database secrets", copy secret key
3. Update `index.php`:
```php
define('FIREBASE_SECRET', 'your-database-secret');
```

#### Menggunakan Service Account (Modern):
Untuk implementasi yang lebih aman, gunakan Firebase Admin SDK dengan Service Account.

### 7. Testing

1. Buka browser
2. Akses:
   - Opsi A: `http://localhost/relay-control/relay-control.html`
   - Opsi B: `http://relay.local/relay-control.html`

3. Test API endpoint:
   ```
   http://localhost/relay-control/index.php?action=get
   ```

### 8. Troubleshooting

#### Error: cURL not enabled
Edit `php.ini`:
```ini
extension=curl
```
Restart Apache.

#### Error: Failed to connect to Firebase
- Pastikan URL Firebase sudah benar
- Cek koneksi internet
- Verifikasi Firebase Rules
- Cek firewall/antivirus

#### Error: CORS issues
Sudah dihandle di `index.php` dengan headers:
```php
header('Access-Control-Allow-Origin: *');
```

### 9. Struktur Database Firebase

Data disimpan di path `/relay`:
```json
{
  "relay": {
    "status": true/false,
    "lastControl": 1234567890,
    "lastUpdate": "2026-01-04T12:00:00Z",
    "deviceOnline": true/false,
    "deviceIP": "192.168.1.100"
  }
}
```

### 10. API Endpoints

#### GET Status
```
GET index.php?action=get
```

Response:
```json
{
  "success": true,
  "data": {
    "status": true,
    "lastControl": 1234567890,
    "lastUpdate": "2026-01-04T12:00:00Z",
    "deviceOnline": true,
    "deviceIP": "192.168.1.100"
  }
}
```

#### SET Status
```
POST index.php?action=set
Body: status=1 (atau 0)
```

Response:
```json
{
  "success": true,
  "message": "Relay status updated",
  "data": { ... }
}
```

#### Initialize Relay
```
GET index.php?action=init
```

### 11. Integrasi dengan Arduino/ESP32

Arduino/ESP32 akan membaca data yang sama dari Firebase path `/relay/status`.
File `relay_control.ino` sudah dikonfigurasi untuk membaca dari path yang sama.

### 12. Keamanan untuk Production

Untuk production environment:

1. **Gunakan HTTPS**
2. **Set Firebase Rules dengan authentication**:
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

3. **Tambahkan rate limiting**
4. **Gunakan environment variables untuk credentials**
5. **Implementasi session/token based authentication di PHP**

### 13. Fitur Tambahan

File HTML sudah include:
- ✅ Real-time monitoring (auto-refresh setiap 3 detik)
- ✅ Status indicator (online/offline)
- ✅ Device IP display
- ✅ Timestamp display
- ✅ Error handling
- ✅ Responsive design
- ✅ Loading states

### Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository.

---
**Dibuat untuk**: Remote Relay Control System
**Platform**: XAMPP (PHP) + Firebase Realtime Database
**Tanggal**: 4 Januari 2026
