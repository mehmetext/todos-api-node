# 🚀 Node.js Todo API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bu proje, modern web geliştirme pratiklerini ve güvenlik önlemlerini içeren, Node.js ve TypeScript tabanlı bir RESTful Todo API'sidir. Öğrenim amacıyla geliştirilmekte olan bu proje, gerçek dünya uygulamalarında kullanılan best practice'leri içermektedir.

## 💫 Özellikler

- TypeScript ile tam tip güvenliği
- JWT tabanlı kimlik doğrulama sistemi
- Access ve Refresh token yapısı
- PostgreSQL veritabanı (Prisma ORM)
- Zod ile request validasyonu
- Rate limiting ve CORS koruması
- Detaylı hata yönetimi
- Request loglama
- Todo'lar için filtreleme ve sayfalama
- Çevresel değişken yönetimi

## 🛠️ Kullanılan Teknolojiler

- Node.js & Express.js
- TypeScript
- PostgreSQL & Prisma ORM
- JWT (JSON Web Tokens)
- Zod Validation
- Bcrypt
- CORS & Cookie Parser
- Express Rate Limit

## 📦 Kurulum

1. Repoyu klonlayın:

```bash
git clone https://github.com/yourusername/todos-api-node.git
cd todos-api-node
```

2. Bağımlılıkları yükleyin:

```bash
pnpm install
```

3. `.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin:

```env
PORT=3030
DATABASE_URL="postgresql://user:password@localhost:5432/todosdb"
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

5. Veritabanı migration'larını çalıştırın:

```bash
pnpm prisma:migrate
```

6. Geliştirme modunda başlatın:

```bash
pnpm dev
```

## 🔑 API Endpoints

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/refresh` - Access token yenileme
- `POST /api/auth/logout` - Çıkış yapma

### Todo İşlemleri

- `GET /api/todos` - Todo listesi (filtreleme & sayfalama)
- `GET /api/todos/:id` - Tek bir todo detayı
- `POST /api/todos` - Yeni todo oluşturma
- `PUT /api/todos/:id` - Todo güncelleme
- `DELETE /api/todos/:id` - Todo silme

## 🔒 Güvenlik Önlemleri

- JWT tabanlı authentication
- HttpOnly cookie ile refresh token yönetimi
- Request rate limiting
- CORS koruması
- Input validasyonu
- Password hashing (bcrypt)
- Error handling ve sanitization

## 🧪 Proje Yapısı

```
src/
├── app/
│   ├── controllers/    # API endpoint işleyicileri
│   ├── middlewares/    # Express middleware'leri
│   ├── routes/         # API route tanımlamaları
│   └── lib/
│       ├── core/       # Çekirdek yapılandırmalar
│       ├── types/      # TypeScript tip tanımlamaları
│       ├── utils/      # Yardımcı fonksiyonlar
│       └── validations/# Request şema validasyonları
```

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
