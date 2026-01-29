# 🔥 ACİL ÇÖZÜM: Mixed Content Sorunu

## ❌ Sorun Ne?

Firebase **HTTPS** kullanıyor → `https://ismeranket.web.app`
Backend **HTTP** kullanıyor → `http://13.63.57.2`

**Tarayıcı güvenlik nedeniyle HTTP isteklerini blokluyor!**

---

## ✅ ÇÖZÜM SEÇENEKLERİ

### Seçenek 1: LOCALHOST'ta Test Et (Geçici)

Firebase deployment çalışmaz ama local test için:

```powershell
cd d:\Projeler\anket-quiz\frontend
npm run dev
```

Tarayıcıda: `http://localhost:5173` (HTTP olduğu için çalışır)

---

### Seçenek 2: Backend'e HTTPS Ekle (KESİN ÇÖZÜM)

**Gereksinimler:**
- ✅ Bir domain adı (örn: `anket-api.com` veya subdomain)
- ✅ Domain'in A kaydını AWS IP'sine yönlendir

**Sunucuda çalıştır:**

```bash
# 1. Certbot kur (zaten kurulu olabilir)
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. SSL sertifikası al (DOMAIN_NAME yerine kendi domain'ini yaz)
sudo certbot --nginx -d anket-api.example.com

# 3. Otomatik yenileme testi
sudo certbot renew --dry-run
```

**Frontend config'i güncelle:**
```typescript
// frontend/src/config.ts
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://anket-api.example.com";  // HTTPS!
```

**Frontend yeniden deploy:**
```powershell
cd frontend
npm run build
firebase deploy --only hosting
```

---

### Seçenek 3: Firebase Functions ile Proxy (Orta Çözüm)

Backend'i HTTPS yapmak yerine Firebase Functions üzerinden proxy:

1. Firebase Functions kur
2. Cloud Function oluştur ki backend'e proxy yapsın (HTTPS → HTTP)
3. Frontend direkt function'a istek atsın

**Ama bu karmaşık ve gereksiz!** Seçenek 2 daha iyi.

---

## 🎯 ÖNERİM

**Eğer domain'in varsa:** Seçenek 2 (SSL)
**Eğer domain'in yoksa:** Şimdilik localhost'ta test et, sonra domain al

---

## 📋 Domain Nasıl Alınır?

1. **Domain satın al:**
   - Namecheap.com
   - GoDaddy.com
   - Cloudflare (ucuz)

2. **DNS Ayarları:**
   - A Record: `@` → `13.63.57.2`
   - A Record: `api` → `13.63.57.2` (subdomain için)

3. **24 saat bekle** (DNS propagation)

4. **Certbot ile SSL kur** (yukarıdaki komutlar)

---

**Şu an için localhost'ta test et:** `npm run dev`

Domain alınca SSL kurarsın! 🚀
