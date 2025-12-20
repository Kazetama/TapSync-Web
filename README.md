# KazeEngine

KazeEngine adalah **mini backend framework** berbasis **Node.js dan Express** yang dilengkapi dengan **Command Line Interface (CLI)** untuk manajemen **controller** dan **database migration**.  
Framework ini dirancang sebagai **learning-oriented framework** yang tetap memiliki fondasi arsitektural untuk dikembangkan menjadi **project publik atau production-ready prototype**.

---

## Key Features

### 1. CLI (Command Line Interface)
Menyediakan perintah CLI dengan konsep serupa *Laravel Artisan*:

- `make:controller <name>`  
  Membuat file controller baru secara otomatis.
- `make:migration <name>`  
  Membuat file migration baru.
- `migrate`  
  Menjalankan seluruh migration yang belum dieksekusi.
- `migrate:fresh [--force]`  
  Menghapus seluruh tabel dan menjalankan ulang semua migration.

---

### 2. Migration Engine
- Tracking riwayat migration menggunakan tabel `kaze_migrations`
- **Safety guard** untuk mencegah operasi destruktif yang tidak disengaja
- Mendukung **foreign key constraint**
- Idempotent execution (migration tidak dijalankan ulang)

---

### 3. Project Architecture
- Struktur folder terorganisir dan scalable
- Pemisahan yang jelas antara **core engine**, **application logic**, dan **database layer**
- Mendukung **ES Module** (`"type": "module"`)

---

### 4. Environment & Database
- Konfigurasi menggunakan file `.env`
- MySQL support melalui `mysql2/promise`
- Siap dikembangkan untuk multi-environment (dev / staging / production)

---

## Installation

### 1. Clone Repository
```bash
git clone <repo-url>
cd KazeEngine
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Link CLI Globally
```bash
npm link
```

---

### 4. Environment Configuration

Buat file `.env` pada root project:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=kaze_db
DB_PORT=3306
```

---

## Project Structure

```text
KazeEngine/
├─ bin/
│  └─ kaze.js
├─ core/
│  ├─ migration/
│  │  ├─ fresh.js
│  │  └─ runner.js
│  └─ database/
│     └─ connection.js
├─ database/
│  └─ migrations/
├─ app/
│  └─ controllers/
├─ package.json
└─ README.md
```

---

## Usage

### CLI Help
```bash
kaze --help
```

### Create Controller
```bash
kaze make:controller UserController
```

### Create Migration
```bash
kaze make:migration create_users_table
```

### Run Migration
```bash
kaze migrate
```

### Fresh Migration
```bash
kaze migrate:fresh
```

### Force Fresh Migration
```bash
kaze migrate:fresh --force
```

---

## Notes & Best Practices

- Hindari penggunaan `--force` di environment production
- Pastikan file `.env` telah dikonfigurasi sebelum menjalankan migration
- Migration history otomatis dicatat di tabel `kaze_migrations`
- Gunakan penamaan migration yang deskriptif

---

## Roadmap

- migrate:rollback
- migrate:status
- kaze serve
- Seeder support

---

## Contributing

1. Fork repository
2. Buat branch baru
3. Commit perubahan dengan pesan jelas
4. Push dan ajukan Pull Request

---

## License

MIT License
