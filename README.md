# Todos API Node

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bu proje, Node.js ve TypeScript kullanılarak geliştirilmiş bir RESTful Todo API'sidir. Modern web geliştirme pratiklerini ve güvenlik önlemlerini içeren bir örnek uygulama olarak tasarlanmıştır.

## 🚀 Özellikler

- RESTful API endpoints
- TypeScript ile tip güvenliği
- JWT tabanlı kimlik doğrulama
- Request validasyonu (Zod)
- CORS yapılandırması
- Rate limiting
- Error handling
- Request logging
- Todo filtreleme ve sıralama
- Çevresel değişken yönetimi

## 🛠️ Teknolojiler

- Node.js
- Express.js
- TypeScript
- JWT (JSON Web Tokens)
- Zod
- CORS
- dotenv
- UUID

## 📦 Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/mehmetext/todos-api-node.git
cd todos-api-node
```

2. Bağımlılıkları yükleyin:

```bash
pnpm install
```

3. Örnek env dosyasını kopyalayın:

```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin:

```env
PORT=3030
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

5. Geliştirme modunda çalıştırın:

```bash
pnpm dev
```

## 🔑 API Endpoints

### Kimlik Doğrulama

- `POST /api/auth/login` - Kullanıcı girişi

### Todo İşlemleri

- `GET /api/todos` - Todoları listele (filtreleme ve sıralama destekli)
- `GET /api/todos/:id` - Tek bir todo getir
- `POST /api/todos` - Yeni todo oluştur
- `PUT /api/todos/:id` - Todo güncelle
- `DELETE /api/todos/:id` - Todo sil

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Request rate limiting
- CORS koruması
- Input validasyonu
- Error handling

## 🧪 Geliştirme

Proje TypeScript ile geliştirilmiş olup, modüler bir yapı kullanılmaktadır:

- `src/app/controllers` - API endpoint işleyicileri
- `src/app/middlewares` - Express middleware'leri
- `src/app/lib` - Yardımcı fonksiyonlar ve tipler
- `src/app/routes` - API route tanımlamaları

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun
