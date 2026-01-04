/*
 * ESP32 Remote Relay Control via Firebase
 * Kompatibel dengan relay_api.php dan index.html
 * 
 * Koneksi: 
 * - Relay VCC -> ESP32 5V (VIN)
 * - Relay GND -> ESP32 GND
 * - Relay IN  -> ESP32 GPIO 14 (Active HIGH)
 */

#include <WiFi.h>
#include <FirebaseESP32.h>

// ============================================
// KONFIGURASI - GANTI DENGAN MILIK ANDA
// ============================================
#define WIFI_SSID       "Wokwi-GUEST"
#define WIFI_PASSWORD   ""

#define FIREBASE_HOST   "https://relay01-3aec2-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH   "AIzaSyBorkitXzDJOVU2boZO8ticiciVoB1LAgs"
// ============================================

// Pin Relay (Active HIGH)
#define RELAY_PIN 14

// Firebase objects
FirebaseData firebaseData;
FirebaseData streamData;
FirebaseConfig config;
FirebaseAuth auth;

// Variabel
bool currentRelayState = false;
bool lastRelayState = false;
unsigned long lastStatusUpdate = 0;
unsigned long lastManualCheck = 0;
const unsigned long STATUS_UPDATE_INTERVAL = 2000; // Update status setiap 2 detik (lebih cepat)
const unsigned long MANUAL_CHECK_INTERVAL = 500;   // Manual check setiap 500ms

// Callback untuk stream
void streamCallback(StreamData data) {
    Serial.println("------- Stream Data Received -------");
    Serial.println("Path: " + data.dataPath());
    Serial.println("Type: " + data.dataType());
    
    // Handle perubahan di /status atau root /
    String path = data.dataPath();
    if (path == "/status" || path == "/" || path == "") {
        bool newState;
        
        if (data.dataType() == "boolean") {
            newState = data.boolData();
            Serial.println("New state from Firebase: " + String(newState ? "ON" : "OFF"));
        } else if (data.dataType() == "json") {
            // Jika menerima objek JSON lengkap
            FirebaseJson json = data.jsonObject();
            FirebaseJsonData jsonData;
            json.get(jsonData, "status");
            newState = jsonData.boolValue;
            Serial.println("New state from Firebase (JSON): " + String(newState ? "ON" : "OFF"));
        } else {
            Serial.println("Unknown data type, skipping...");
            return;
        }
        
        if (newState != currentRelayState) {
            currentRelayState = newState;
            lastRelayState = currentRelayState; // Update lastRelayState juga
            updateRelay();
        } else {
            Serial.println("State unchanged, no action needed");
        }
    } else {
        Serial.println("Path not relevant: " + path);
    }
    Serial.println("------------------------------------");
}

void streamTimeoutCallback(bool timeout) {
    if (timeout) {
        Serial.println("Stream timeout, reconnecting...");
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("\n=================================");
    Serial.println("ESP32 Firebase Relay Controller");
    Serial.println("=================================\n");
    
    // Setup pin
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW); // Relay OFF (Active HIGH)
    
    // Koneksi WiFi
    connectWiFi();
    
    // Konfigurasi Firebase
    config.host = FIREBASE_HOST;
    config. signer. tokens.legacy_token = FIREBASE_AUTH;
    
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
    
    // Set buffer size
    firebaseData.setBSSLBufferSize(1024, 1024);
    streamData.setBSSLBufferSize(1024, 1024);
    
    // Inisialisasi data di Firebase
    initializeFirebase();
    
    // Mulai stream untuk realtime update
    Serial.println("Starting Firebase stream at path: /relay/status");
    if (!Firebase.beginStream(streamData, "/relay/status")) {
        Serial.println("Stream begin error: " + streamData.errorReason());
    } else {
        Serial.println("Stream started successfully!");
    }
    
    Firebase.setStreamCallback(streamData, streamCallback, streamTimeoutCallback);
    
    Serial.println("\n>>> Sistem Siap!  <<<\n");
}

void loop() {
    // Cek koneksi WiFi
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected!  Reconnecting...");
        connectWiFi();
    }
    
    // Cek status stream dan reconnect jika perlu
    if (!Firebase.readStream(streamData)) {
        if (streamData.streamTimeout()) {
            Serial.println("Stream timeout detected, reconnecting...");
            Firebase.beginStream(streamData, "/relay/status");
        }
    }
    
    // Manual check Firebase status sebagai backup (jika stream tidak bekerja)
    if (millis() - lastManualCheck > MANUAL_CHECK_INTERVAL) {
        checkRelayStatus();
        lastManualCheck = millis();
    }
    
    // Update status ESP32 ke Firebase secara berkala
    if (millis() - lastStatusUpdate > STATUS_UPDATE_INTERVAL) {
        updateDeviceStatus();
        lastStatusUpdate = millis();
    }
    
    delay(10); // Delay lebih kecil untuk response lebih cepat
}

void connectWiFi() {
    Serial.print("Connecting to WiFi: ");
    Serial.println(WIFI_SSID);
    
    WiFi. begin(WIFI_SSID, WIFI_PASSWORD);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 30) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial. println("\n✓ WiFi Connected!");
        Serial.print("  IP Address: ");
        Serial.println(WiFi.localIP());
        Serial.print("  Signal Strength: ");
        Serial.print(WiFi. RSSI());
        Serial.println(" dBm");
    } else {
        Serial.println("\n✗ WiFi Connection Failed!");
        Serial.println("  Restarting ESP32.. .");
        delay(3000);
        ESP.restart();
    }
}

void initializeFirebase() {
    Serial.println("Initializing Firebase...");
    
    // Baca status terakhir dari Firebase
    if (Firebase.getBool(firebaseData, "/relay/status")) {
        currentRelayState = firebaseData.boolData();
        updateRelay();
        Serial.println("✓ Last relay status: " + String(currentRelayState ? "ON" :  "OFF"));
    } else {
        // Jika belum ada, buat data awal
        Serial.println("Creating initial data...");
        
        FirebaseJson json;
        json. set("status", false);
        json.set("lastControl", (int)0);
        json.set("lastUpdate", "");
        json.set("deviceOnline", true);
        json.set("deviceIP", WiFi.localIP().toString());
        
        if (Firebase.setJSON(firebaseData, "/relay", json)) {
            Serial.println("✓ Initial data created!");
        } else {
            Serial.println("✗ Failed:  " + firebaseData.errorReason());
        }
    }
}

void updateRelay() {
    Serial.println("Relay state changed: " + String(currentRelayState ? "ON" : "OFF"));
    
    if (currentRelayState) {
        digitalWrite(RELAY_PIN, HIGH); // Relay ON (Active HIGH)
        Serial.println("⚡ RELAY:  ON");
    } else {
        digitalWrite(RELAY_PIN, LOW);  // Relay OFF
        Serial.println("○ RELAY: OFF");
    }
}

void updateDeviceStatus() {
    // Update status device ke Firebase
    FirebaseJson json;
    json.set("deviceOnline", true);
    json.set("deviceIP", WiFi.localIP().toString());
    json.set("rssi", WiFi. RSSI());
    json.set("uptime", millis() / 1000);
    json.set("freeHeap", ESP.getFreeHeap());
    
    if (Firebase.updateNode(firebaseData, "/relay/device", json)) {
        Serial.println("Device status updated");
    }
}

void checkRelayStatus() {
    // Manual check status relay dari Firebase (backup jika stream tidak bekerja)
    if (Firebase.getBool(firebaseData, "/relay/status")) {
        bool newState = firebaseData.boolData();
        if (newState != currentRelayState) {
            Serial.println("Manual check: State changed detected!");
            currentRelayState = newState;
            lastRelayState = currentRelayState;
            updateRelay();
        }
    }
}