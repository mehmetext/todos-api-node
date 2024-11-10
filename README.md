# 🚀 Node.js Todo API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bu proje, modern web geliştirme pratiklerini ve güvenlik önlemlerini içeren, Node.js ve TypeScript tabanlı bir RESTful Todo API'sidir. Öğrenim amacıyla geliştirilmekte olan bu proje, gerçek dünya uygulamalarında kullanılan best practice'leri içermektedir.

## 💫 Özellikler

- TypeScript ile tam tip güvenliği
- JWT tabanlı kimlik doğrulama sistemi (Access & Refresh token)
- PostgreSQL veritabanı (Prisma ORM)
- Zod ile request validasyonu
- Rate limiting ve CORS koruması
- Detaylı hata yönetimi ve loglama
- Todo'lar için gelişmiş filtreleme ve sayfalama
- Çevresel değişken yönetimi
- Soft delete desteği
- Güvenli cookie yönetimi
- API response standardizasyonu

## 🛠️ Teknoloji Yığını

### Ana Teknolojiler

- Node.js & Express.js
- TypeScript
- PostgreSQL & Prisma ORM

### Güvenlik

- JWT (JSON Web Tokens)
- Bcrypt (Şifreleme)
- CORS & Cookie Parser
- Express Rate Limit

### Geliştirme Araçları

- ESLint (Kod kalitesi)
- Prettier (Kod formatı)
- dotenv (Çevresel değişkenler)
- pnpm (Paket yöneticisi)

## 📦 Kurulum

1. Repoyu klonlayın
2. Bağımlılıkları yükleyin: `pnpm install`
3. Çevresel değişkenleri ayarlayın: `.env.example` → `.env.local`
4. Veritabanı migration'larını çalıştırın: `pnpm prisma:migrate`
5. Geliştirme modunda başlatın: `pnpm dev`

## 🔑 API Endpoints

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/refresh` - Access token yenileme
- `POST /api/auth/logout` - Çıkış yapma

### Todo İşlemleri

- `GET /api/todos` - Todo listesi
  - Query Parameters:
    - `sort`: Sıralama seçenekleri (örn: descByCreatedAt)
    - `q`: Arama terimi
    - `page`: Sayfa numarası
- `GET /api/todos/:id` - Tek bir todo detayı
- `POST /api/todos` - Yeni todo oluşturma
- `PUT /api/todos/:id` - Todo güncelleme
- `DELETE /api/todos/:id` - Todo silme (soft delete)

## 🏗️ Proje Yapısı

```
src/
├── app/
│   ├── controllers/    # API endpoint işleyicileri
│   ├── middlewares/    # Express middleware'leri
│   ├── routes/         # API route tanımlamaları
│   ├── services/       # İş mantığı katmanı
│   └── lib/
│       ├── core/       # Çekirdek yapılandırmalar
│       ├── types/      # TypeScript tip tanımlamaları
│       ├── utils/      # Yardımcı fonksiyonlar
│       ├── constants/  # Sabit değerler
│       └── validations/# Request şema validasyonları
```

## 🔒 Güvenlik Özellikleri

- JWT tabanlı authentication
- HttpOnly cookie ile refresh token yönetimi
- Request rate limiting
- CORS koruması
- Input validasyonu
- Password hashing (bcrypt)
- Error handling ve sanitization
- Güvenli HTTP başlıkları

## 📚 API Dokümantasyonu

API endpoint'lerini test etmek için `/docs/todos-api.postman_collection.json` dizininde Postman Collection bulunmaktadır.

## 🧪 Veritabanı Şeması

Proje üç ana model içerir:

- User: Kullanıcı bilgileri
- Todo: Görev kayıtları
- RefreshToken: Token yönetimi

## 📝 Geliştirme Notu

Bu proje halen geliştirme aşamasındadır ve öğrenim amacıyla oluşturulmuştur. Modern web geliştirme pratiklerini öğrenmek ve uygulamak için bir örnek olarak kullanılabilir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.
