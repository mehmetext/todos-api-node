# 🚀 Node.js Todo API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview | Genel Bakış

**EN**: This project is a RESTful Todo API built with Node.js and TypeScript, incorporating modern web development practices and security measures. It's being developed for learning purposes and includes real-world best practices.

**TR**: Bu proje, modern web geliştirme pratiklerini ve güvenlik önlemlerini içeren, Node.js ve TypeScript tabanlı bir RESTful Todo API'sidir. Öğrenim amacıyla geliştirilmekte olan bu proje, gerçek dünya uygulamalarında kullanılan best practice'leri içermektedir.

## 💫 Features | Özellikler

- Full type safety with TypeScript | TypeScript ile tam tip güvenliği
- JWT-based authentication (Access & Refresh tokens) | JWT tabanlı kimlik doğrulama
- PostgreSQL database with Prisma ORM | PostgreSQL veritabanı (Prisma ORM)
- Request validation with Zod | Zod ile request validasyonu
- Rate limiting and CORS protection | Rate limiting ve CORS koruması
- Advanced error handling and logging | Detaylı hata yönetimi ve loglama
- Filtering and pagination for Todos | Todo'lar için filtreleme ve sayfalama
- Environment variable management | Çevresel değişken yönetimi
- Soft delete support | Soft delete desteği
- Secure cookie management | Güvenli cookie yönetimi
- Standardized API responses | API response standardizasyonu

## 🛠️ Tech Stack | Teknoloji Yığını

### Core Technologies | Ana Teknolojiler

- Node.js & Express.js
- TypeScript
- PostgreSQL & Prisma ORM

### Security | Güvenlik

- JWT (JSON Web Tokens)
- Bcrypt (Password Hashing)
- CORS & Cookie Parser
- Express Rate Limit

### Development Tools | Geliştirme Araçları

- ESLint (Code quality)
- Prettier (Code formatting)
- dotenv (Environment variables)
- pnpm (Package manager)

## 📦 Installation | Kurulum

1. Clone the repository | Repoyu klonlayın

```bash
git clone <repository-url>
```

2. Install dependencies | Bağımlılıkları yükleyin

```bash
pnpm install
```

3. Set up environment variables | Çevresel değişkenleri ayarlayın

```bash
cp .env.example .env.local
```

4. Run database migrations | Veritabanı migration'larını çalıştırın

```bash
pnpm prisma:migrate
```

5. Start development server | Geliştirme modunda başlatın

```bash
pnpm dev
```

## 🔑 API Endpoints

### Authentication | Kimlik Doğrulama

- `POST /api/auth/register` - Register new user | Yeni kullanıcı kaydı
- `POST /api/auth/login` - User login | Kullanıcı girişi
- `POST /api/auth/refresh` - Refresh access token | Access token yenileme
- `POST /api/auth/logout` - Logout | Çıkış yapma

### Todos

- `GET /api/todos` - List todos | Todo listesi
  - Query Parameters:
    - `sort`: Sorting options | Sıralama seçenekleri
    - `q`: Search term | Arama terimi
    - `page`: Page number | Sayfa numarası
- `GET /api/todos/:id` - Get single todo | Tek bir todo detayı
- `POST /api/todos` - Create todo | Yeni todo oluşturma
- `PUT /api/todos/:id` - Update todo | Todo güncelleme
- `DELETE /api/todos/:id` - Delete todo (soft delete) | Todo silme

### Labels | Etiketler

- `GET /api/labels` - List labels | Etiket listesi
- `POST /api/labels` - Create label | Yeni etiket oluşturma
- `PUT /api/labels/:id` - Update label | Etiket güncelleme
- `DELETE /api/labels/:id` - Delete label | Etiket silme

## 🔒 Security Features | Güvenlik Özellikleri

- JWT-based authentication | JWT tabanlı kimlik doğrulama
- HttpOnly cookie for refresh tokens | HttpOnly cookie ile refresh token yönetimi
- Request rate limiting | İstek sınırlama
- CORS protection | CORS koruması
- Input validation | Girdi doğrulama
- Password hashing (bcrypt) | Şifre hashleme
- Error handling and sanitization | Hata yönetimi ve sanitizasyon
- Secure HTTP headers | Güvenli HTTP başlıkları

## 📝 Development Note | Geliştirme Notu

**EN**: This project is still under development and is created for learning purposes. It can be used as an example to learn and implement modern web development practices.

**TR**: Bu proje halen geliştirme aşamasındadır ve öğrenim amacıyla oluşturulmuştur. Modern web geliştirme pratiklerini öğrenmek ve uygulamak için bir örnek olarak kullanılabilir.

## 📄 License | Lisans

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakınız.
