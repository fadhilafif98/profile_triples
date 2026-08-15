# tripleS Fan Directory — Engineering & Data Architecture Guide (`GEMINI.md`)

Panduan teknis resmi untuk pengembangan, arsitektur data, penambahan konten, dan standar desain website **tripleS Profile & Fan Directory** (`profile-triples.vercel.app`).

---

## 1. Arsitektur Data (*Single Source of Truth*)

Proyek ini mengadopsi arsitektur **1 File per Entitas (JSON Modular)** untuk memastikan integritas data, kemudahan pemeliharaan, dan performa tinggi tanpa dependensi database eksternal.

### Struktur Direktori Data:
```
src/
├── data/
│   ├── members/       # 24 file JSON member (s01-yoon-seo-yeon.json ... s24-jiyeon.json)
│   ├── albums/        # 18 file JSON album (01-access.json ... 18-love-and-pop-pt1.json)
│   └── sub-units/     # 15 file JSON sub-unit (01-acid-angel-from-asia.json ... 15-zenith.json)
├── lib/               # Data Loader terpusat (TypeScript)
│   ├── members.ts     # getAllMembers(), getMemberBySlug(), getMemberById()
│   ├── albums.ts      # getAllAlbums(), getAlbumById(), latest releases
│   └── sub-units.ts   # getAllSubUnits(), getSubUnitBySlug(), getSubUnitsByCategory()
└── types/             # Kontrak Interface TypeScript
    ├── member.ts      # Interface Member
    ├── album.ts       # Interface Album
    └── sub-unit.ts    # Interface SubUnit
```

---

## 2. Skema Entitas & Konvensi Penamaan

### A. Member (`src/types/member.ts`)
* **`name`**: Nama panggung resmi tunggal / nickname (misal: `SeoYeon`, `HyeRin`, `JiWoo`, `Kaede`, `SeoAh`). Ini yang tampil di kartu grid, judul utama, dan badge.
* **`birthName`**: Nama lengkap / nama lahir asli (misal: `Yoon Seo-yeon`, `Yamada Kaede`, `Jeong Hae-rin`).
* **`hangul`**: Hangul untuk nama panggung (misal: `서연`, `혜린`, `카에데`).
* **`birthNameHangul`**: Hangul untuk nama lahir lengkap (misal: `윤서연`, `야마다 카에데`, `정해린`).
* **`nativeName`**: Aksara asli untuk member internasional (Jepang: Kanji, Tiongkok: Hanzi, Thailand: Thai).
* **`slug`**: Identifier URL unik (misal: `yoon-seo-yeon`, `seoah`, `kaede`).
* **`representativeEmoji`**: Format: `[Emoji] ([Label])` contoh `🐶 (Puppy) / 🐹 (Hamster)`.

#### Contoh JSON Member (`src/data/members/s01-yoon-seo-yeon.json`):
```json
{
  "id": 1,
  "name": "SeoYeon",
  "birthName": "Yoon Seo-yeon",
  "hangul": "서연",
  "birthNameHangul": "윤서연",
  "slug": "yoon-seo-yeon",
  "role": "Leader, Vocalist",
  "image": "2f3S1Da.jpg",
  "birthday": "2003-08-06",
  "birthplace": "Daejeon, South Korea",
  "nationality": "South Korean",
  "bloodType": "B",
  "height": "160 cm",
  "mbti": "ISFP",
  "representativeEmoji": "🐶 (Puppy) / 🐹 (Hamster)",
  "subUnits": [
    "+(KR)ystal Eyes",
    "ACID EYES",
    "LOVElution",
    "neptune"
  ],
  "revealDate": "2022-05-01",
  "funFacts": [
    "First member revealed (S1) on May 1, 2022",
    "Recruited through Instagram DM without prior idol trainee experience",
    "Elected official leader for ASSEMBLE24 & ASSEMBLE25 via Grand Gravity"
  ],
  "gif": "Y2lkPTc5MGI3NjExZGpxbm9lMGxtOXFua2I5aGp0eXcyYTh3b3dxMWt5emU5MzVocmg1ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cW9hS5al3lUuPvblI6/giphy.gif"
}
```

---

### B. Album (`src/types/album.ts`)
* **`id`**: Identifier album (misal: `18-love-and-pop-pt1` atau `assemble24`).
* **`title`**: Judul resmi album.
* **`type`**: `"Studio Album" | "Mini Album" | "Single Album" | "Digital Single" | "Japanese EP" | "Japanese Single"`.
* **`unit`**: Unit yang merilis (misal: `tripleS (OT24 Full Group)` atau `Acid Angel from Asia`).
* **`releaseDate`**: Tanggal rilis terformat (misal: `June 1, 2026`).
* **`cover`**: Lokasi file di folder `public/album/` (misal: `/album/18_LOVE_AND_POP_PT1.jpg`).
* **`spotifyLink`**: Tautan streaming resmi Spotify.

#### Contoh JSON Album (`src/data/albums/18-love-and-pop-pt1.json`):
```json
{
  "id": "18-love-and-pop-pt1",
  "title": "LOVE&POP pt. 1",
  "type": "Mini Album",
  "unit": "tripleS (OT24 Full Group)",
  "releaseDate": "June 1, 2026",
  "cover": "/album/18_LOVE_AND_POP_PT1.jpg",
  "description": "First installment of the ASSEMBLE26 comeback trilogy, fronted by the vibrant full-group title track 'Baby Flower'.",
  "spotifyLink": "https://open.spotify.com/album/4e2Z8X9p3m1q8K7v0L"
}
```

---

### C. Sub-Unit / Dimension (`src/types/sub-unit.ts`)
* **`slug`**: URL slug unik (misal: `visionary-vision`, `hatchi`, `glow`).
* **`category`**: `"Main Dimension" | "Special Dimension" | "Japan Dimension" | "Ballad Dimension" | "msnz Project"`.
* **`members`**: Array nama panggung member yang tergabung.

---

## 3. Langkah-Langkah Menambah & Mengupdate Data

### A. Cara Menambah Album Baru:
1. Simpan gambar sampul di `public/album/{nomor}_{JUDUL}.jpg`.
2. Buat file baru `src/data/albums/{nomor}-{slug}.json` dengan skema `Album`.
3. Buka [src/lib/albums.ts](file:///Users/macair/Project/Github/profile_triples/src/lib/albums.ts):
   * Import file JSON baru: `import aXX from "@/data/albums/{nomor}-{slug}.json"`
   * Masukkan ke dalam array `albumsList`.
   * Album terbaru otomatis muncul di timeline discography dan Featured Release landing page.

### B. Cara Mengupdate Data Member:
1. Edit file bersangkutan di `src/data/members/s{ID}-{slug}.json`.
2. Jika ada perubahan nama/panggung:
   * Perbarui `name` dengan nama panggung (CamelCase).
   * Perbarui `birthName` dengan nama lengkap.
   * Pastikan `hangul` dan `birthNameHangul` sesuai.
3. Simpan file. HMR (*Hot Module Replacement*) langsung memperbarui UI di browser.

### C. Cara Menambah Sub-Unit (Dimension) Baru:
1. Simpan foto unit di `public/sub-units/sub_unit_{nama}.jpg`.
2. Buat file baru `src/data/sub-units/{nomor}-{slug}.json`.
3. Buka [src/lib/sub-units.ts](file:///Users/macair/Project/Github/profile_triples/src/lib/sub-units.ts):
   * Import file JSON: `import uXX from "@/data/sub-units/{nomor}-{slug}.json"`
   * Tambahkan ke array `subUnits`.

---

## 4. Standar Desain & UI/UX

### A. Tema & Visual Hierarchy (*Dark Editorial Cosmos*):
* **Background Utama**: `bg-[#050505]` dengan aksen subtle `border-zinc-800/80`.
* **Glass Bento Cards**: `bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800`.
* **Tipografi**:
  * Judul & Nama: `font-pretendard font-extrabold tracking-tight text-white`.
  * Label Teknis / Badge: `font-mono text-xs uppercase tracking-widest text-zinc-400`.
  * Paragraf & Deskripsi: `text-zinc-300 text-sm leading-relaxed`.
* **Hero Headline**: Teks hollow transparan dengan stroke (`WebkitTextStroke: "2.5px rgba(255, 255, 255, 0.9)"`, `text-transparent`) dan ghost buttons transparan agar foto grup 24 member di background tidak terhalang.

### B. Standar Halaman Profil Member (*Zero-Scroll Above-the-Fold*):
* Foto profil resmi, nama panggung, nomor S, badge emoji, MBTI, dan tabel spesifikasi terintegrasi langsung di viewport atas tanpa perlu scrolling banner kosong.
* **Tabel Spesifikasi**:
  1. `Stage Name (예명 / 활동명)`: Nama panggung + Hangul.
  2. `Birth Name (본명)`: Nama lahir lengkap + Hangul + Native Script.
  3. `Birthday (생년월일)`: Format tanggal + umur internasional.
  4. `Origin (출생 / 국적)`: Tempat lahir / kebangsaan.
  5. `Symbol (상징)`: Emoji & simbol resmi.
  6. `Career (활동 경력)`: Riwayat & sub-unit.
  7. `History & Bio (이력)`: Fakta & biografi terkurasi.
* **More tripleS Slider**: Slider horizontal responsif dengan mouse click-and-drag (`cursor-grab active:cursor-grabbing`) dan auto-centering pada member yang aktif tanpa memicu loncatan scroll vertikal pada window.

### C. Birthday Countdown:
* Menggunakan antrean ulang tahun satu bulan yang sama (`sameMonthMembers`), jam countdown monokrom, dan selector interaktif antar-member.

---

## 5. Peraturan & Batasan Engineering (*Strict Rules*)

1. **Dilarang Menjalankan `npm run build` di Terminal Agen**:
   * User menjalankan `npm run dev` di terminal lokal. Menjalankan build dapat mengganggu file lock dan HMR.
2. **Dilarang Menjalankan `git commit` / `git push` Otomatis**:
   * Simpan semua perubahan langsung pada file sumber lokal (`src/`). Biarkan user mengontrol commit git.
3. **Pencegahan Hydration Error pada Next.js Client Components**:
   * Komponen interaktif yang bergantung pada status browser (`window`, `localStorage`, atau `scroll`) wajib menggunakan guard `mounted` state atau `suppressHydrationWarning`.
4. **Format Kode & TypeScript**:
   * Semua data loader wajib memiliki *strict return type*.
   * Dilarang menggunakan `any` pada skema data inti.

---

## 6. Sumber Data Resmi & Referensi (*Official Data Sources*)

Semua data profil, diskografi, foto, dan aktivitas tripleS diverifikasi dan diperbarui secara berkala dari sumber-sumber resmi berikut:

1. **tripleS Official Fandom Wiki**:
   * URL: [https://triples.fandom.com/wiki/Category:Members](https://triples.fandom.com/wiki/Category:Members) & [https://triples.fandom.com/wiki/tripleS_(group)](https://triples.fandom.com/wiki/tripleS_(group))
   * *Kegunaan*: Sumber utama verifikasi nama panggung, nama lahir, aksara asli (Kanji/Hanzi/Thai), emoji representatif, fakta unik, tanggal pengumuman (*reveal date*), dan pembagian sub-unit.
2. **MODHAUS & COSMO Application**:
   * URL: [https://triples.cosmos.art](https://triples.cosmos.art) / [https://modhaus.xyz](https://modhaus.xyz)
   * *Kegunaan*: Sumber primer struktur tata kelola grup, sistem voting *Grand Gravity*, status kepemimpinan resmi (*official leader*), dan rilisan *Digital Objekts*.
3. **Spotify tripleS Official Artist Page**:
   * URL: [https://open.spotify.com/artist/77mI9zFqg1gD9nF188tU5G](https://open.spotify.com/artist/77mI9zFqg1gD9nF188tU5G)
   * *Kegunaan*: Metadata resmi rilisan musik, daftar album, tracklist, tanggal rilis global, dan tautan streaming audio langsung.
4. **Official YouTube Channel (@triplescosmos)**:
   * URL: [https://www.youtube.com/@triplescosmos](https://www.youtube.com/@triplescosmos)
   * *Kegunaan*: Verifikasi konten harian *SIGNAL*, pengumuman unit baru (*Dimension*), dan video musik resmi.
5. **Official Social Media (X/Twitter & Instagram)**:
   * X / Twitter: [https://x.com/triplescosmos](https://x.com/triplescosmos)
   * Instagram: [https://www.instagram.com/triplescosmos](https://www.instagram.com/triplescosmos)
   * *Kegunaan*: Foto konsep resolusi tinggi, pengumuman teaser, dan banner grup resmi.
6. **Namu Wiki (Korean)**:
   * URL: [https://namu.wiki/w/tripleS](https://namu.wiki/w/tripleS)
   * *Kegunaan*: Referensi detail penulisan Hangul asli, data kota kelahiran, MBTI, dan riwayat aktivitas member sebelum debut.

---

## 7. Protokol Perubahan & Log Riwayat Signifikan (*Change Protocol & Significant Changelog*)

### Aturan Wajib untuk Developer & AI Agent:
1. **Kepatuhan Standar**: Setiap perubahan kode, data, atau tampilan **WAJIB** mematuhi standar arsitektur dan desain yang tertulis di dalam `GEMINI.md`.
2. **Kewajiban Dokumentasi Perubahan Signifikan**: Jika melakukan perubahan besar (seperti penambahan skema data baru, refactoring arsitektur komponen, perombakan tema, atau migrasi data loader), developer/agen **WAJIB mencatat ringkasannya ke dalam tabel riwayat perubahan di bawah ini**.

### Log Riwayat Perubahan Signifikan (*Significant Changelog*):

| Tanggal | Versi / Komponen | Kategori Perubahan | Deskripsi Signifikan |
| :--- | :--- | :--- | :--- |
| **2026-08-15** | `src/components/objekt-modal.tsx` | **Integrasi & Tautan** | Penyelarasan tautan tombol COSMO App di modal agar mengarah ke universal download link resmi MODHAUS (`https://bit.ly/4hQegaj`), konsisten dengan halaman Credits. |
| **2026-08-15** | `src/components/objekt-modal.tsx` | **UI/UX & Responsiveness** | Pembaruan layout modal: 3 action pills (`[Info/Verified]`, `[COSMO]`, `[Apollo]`) ditempatkan di kolom kanan pada tampilan desktop di bawah spesifikasi, dan tetap ringkas di bawah foto pada layar mobile. |
| **2026-08-15** | `public/icons/cosmo-logo.png` & `src/components/cosmo-logo.tsx` | **Aset & UI/UX** | Integrasi logo resmi COSMO App langsung dari sumber resmi (`shop.cosmo.fans/favicons/apple-touch-icon.png`) dan diimplementasikan pada tombol COSMO di modal photocard. |
| **2026-08-15** | `src/components/objekt-modal.tsx` | **UI/UX & Desain** | Pembaruan modal preview: foto photocard full-size di tengah (klik untuk 3D flip), toolbar 3 kolom sejajar di bawah foto (`[Info]`, `[COSMO App]`, `[Apollo Explorer]`), dan collapsible drawer yang menampilkan spesifikasi saat tombol Info ditekan. |
| **2026-08-15** | `src/app/objekts/` | **UI/UX & Desain** | Integrasi circular *Member Story Avatar Strip* (`0T24` & `S1`–`S24` dengan active gradient glow ring) langsung pada halaman utama Vault, menggantikan dropdown *Collections* di toolbar. |
| **2026-08-15** | `src/app/objekts/` & `src/components/objekt-card.tsx` | **UI/UX & Responsiveness** | Penyesuaian `ITEMS_PER_PAGE = 30` sehingga habis dibagi 3 kolom (mobile 10 baris penuh) dan 5 kolom (desktop 6 baris penuh) tanpa ada slot kartu gantung yang kosong pada baris terakhir. |
| **2026-08-15** | `src/app/objekts/` & `src/components/objekt-card.tsx` | **UI/UX & Responsiveness** | Pengubahan grid photocard pada tampilan mobile menjadi 3 kolom (`grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`), gap rapat proporsional (`gap-2`), dan sudut kartu rounded adaptif (`rounded-xl sm:rounded-2xl md:rounded-3xl`). |
| **2026-08-15** | `src/components/objekt-image.tsx` | **Bugfix & Performance** | Menghilangkan error network 404 di browser console: memprioritaskan URL gambar resmi MODHAUS/COSMO (`frontImage`/`thumbnailImage`) yang selalu valid (HTTP 200) dan langsung menampilkan placeholder SVG static untuk sisi yang belum memiliki scan tanpa memicu request yang gagal. |
| **2026-08-15** | `src/components/custom-dropdown.tsx` & `src/components/season-dropdown.tsx` | **Bugfix & Responsiveness** | Penambahan deteksi posisi viewport otomatis (*Auto Boundary Left/Right Alignment*) pada seluruh dropdown toolbar sehingga menu popover tidak pernah terpotong atau tembus ke luar layar kanan pada mobile/tablet. |
| **2026-08-15** | `src/app/objekts/` | **UI/UX & Refactoring** | Penghapusan avatar strip member S1–S24 yang redundan di atas toolbar, menyatukan seluruh kontrol filter anggota ke dalam dropdown terpadu *Collections*. |
| **2026-08-15** | `src/app/objekts/` | **Copywriting & UI/UX** | Refinemen deskripsi header Objekts Vault (penghapusan teks CDN pihak ketiga) dan penggantian indikator COMO Power menjadi status timestamp pembaruan terkini (*Updated: Aug 15, 2026*). |
| **2026-08-15** | `src/components/back-to-top.tsx` & `src/app/layout.tsx` | **Fitur & UI/UX** | Pembuatan floating button *Back to Top* minimalis tema cosmos glassmorphic, fade/scale micro-animations, dan integrasi global di RootLayout. |
| **2026-08-15** | `src/components/objekt-modal.tsx` | **UI/UX & Fitur** | Modal preview diperbarui: penghapusan tombol tab front/back (diganti interaksi klik langsung foto untuk 3D flip), penghapusan baris COMO & Smart Contract, penggantian tombol CDN URL menjadi direct link *Buy on COSMO App* (`https://triples.cosmos.art`). |
| **2026-08-15** | `src/components/objekt-image.tsx` | **UI/UX & Desain** | Fallback placeholder disederhanakan menjadi logo vector ribbon tripleS murni (`TriplesLogo` static SVG) di atas permukaan kartu gelap tanpa teks tambahan ketika scan belum tersedia di CDN. |
| **2026-08-15** | `src/components/objekt-card.tsx` & `src/app/objekts/` | **UI/UX & Desain** | Redesain kartu photocard Objekt murni borderless edge-to-edge dengan sudut rounded 3xl, hover zoom, 5-kolom layout desktop, toolbar terpadu (Season, Collections, Type, Class, Sort, Search, dan inline Reset Filters). |
| **2026-08-15** | `src/app/objekts/` & `src/lib/objekts.ts` | **Fitur & Integrasi CDN** | Pembuatan halaman dedicated *COSMO Digital Objekts Vault* (`/objekts`) terintegrasi Hugging Face CDN (`/images/{season}/{member}/{slug}_{side}.png`), dataset `all_objekts.json`, komponen `ObjektImage` & `ObjektCard` (3D flip scan front/back), filter 24 member S1-S24, season dinamis Atom01–Cream02 (`Atom02`, `Binary02`, `Cream02`), class `Motion`/`Unit`, format online/offline, dan high-res modal preview. |
| **2026-08-15** | `src/app/members/[slug]/` | **UI/UX & Modularity** | Penonaktifan sementara section *Objekt Vault* pada profil member, menjaga halaman tetap fokus pada profil resmi, Teaser Teasers, Formasi Dimensions, dan Slider Anggota. |
| **2026-08-15** | `src/lib/objekts.ts` & `next.config.ts` | **Caching & Data** | Konfigurasi 30-day Edge Image Caching (`minimumCacheTTL: 2592000`), integrasi scan photocard asli per nomor serial, dan `no-referrer` guard untuk pencegahan hotlink blocking. |
| **2026-08-15** | `src/components/objekt-vault.tsx` | **Fitur & UI/UX** | Integrasi *COSMO Digital Objekts Vault* di profil member (filter season Atom01–Ever01, photocard 3D hover tilt, badge class & COMO bonus, direct Apollo.cafe explorer). |
| **2026-08-15** | `src/components/birthday-countdown.tsx` | **Logika & UI/UX** | Penerapan sistem cerdas *Monthly Celebrant Stars* (tampil tanpa countdown 350h untuk member bulan berjalan) & *H-30 Active Countdown Radar* (jam live countdown hanya aktif saat &le;30 hari seperti S5 YooYeon D-17). |
| **2026-08-15** | `src/app/sub-units/[slug]/` | **Fitur & Arsitektur Data** | Pembuatan dynamic route `/sub-units/[slug]`, tagged members lineup bento grid (`👑 Leader`, `S#` outline badge, emoji, role), unit discography, dan cross-linking ke seluruh situs. |
| **2026-08-15** | `src/data/sub-units/` | **Arsitektur Data** | Standardisasi daftar member di seluruh 15 file sub-unit JSON menjadi nama panggung/nickname resmi (`S1 SeoYeon`, `S2 HyeRin`, dst). |
| **2026-08-15** | `src/app/layout.tsx` | **Refactoring Arsitektur** | Penghapusan komponen redundant `layout-wrapper.tsx` dan integrasi langsung `<Navigation />`, `<main>`, `<Footer />` ke dalam `RootLayout`. |
| **2026-08-15** | `src/components/birthday-countdown.tsx` | **Refactoring & UI/UX** | Refaktor arsitektur kode (-40% lines), deterministic birthday helper, penghapusan dead imports, dan penerapan desain *Option A: Editorial Split-Card* (Countdown & Celebration mode). |
| **2026-08-15** | `src/app/` & `src/components/` | **Tema & UI/UX** | Penyesuaian menyeluruh Light Mode & Dark Mode (`bg-[#fafafa]` / `dark:bg-[#050505]`, segmented pill theme switcher di bagian bawah drawer navbar, glass bento cards, typography, dan timeline discography). |
| **2026-08-15** | `src/components/` & `src/app/` | **Redesain UI/UX** | Penggantian badge nomor `S#` menjadi tipografi hollow outline stroke transparan (`WebkitTextStroke`) pada kartu foto member, profil utama, dan birthday countdown. |
| **2026-08-15** | `GEMINI.md` | **Tata Kelola Proyek** | Pembuatan panduan arsitektur resmi, standar desain, dan protokol perubahan wajib. |
| **2026-08-15** | `src/data/members/` & `src/types/member.ts` | **Arsitektur Data** | Standardisasi nama panggung tunggal (`name`), nama lahir lengkap (`birthName` & `birthNameHangul`), dan aksara asli (`nativeName`) sesuai referensi tripleS Fandom Wiki. |
| **2026-08-15** | `src/app/page.tsx` | **Fitur & Integrasi Data** | Menghubungkan section Discography & Featured Dimensions ke data loader modular dinamis (`src/lib/albums.ts` & `src/lib/sub-units.ts`). |
| **2026-08-15** | `src/components/birthday-countdown.tsx` | **Redesain UI/UX** | Perombakan total ke tema *Bento Editorial Cosmos*, jam countdown monokrom, dan antrean khusus member dengan bulan kelahiran yang sama. |
| **2026-08-14** | `src/app/members/[slug]/` | **Redesain UI/UX** | Implementasi layout *Zero-Scroll Above-the-Fold*, Quick-Stats Bento grid (MBTI, Height, Blood, Zodiac), tabel spesifikasi *English (Hangul)*, dan perbaikan loncatan scroll slider horizontal. |
| **2026-08-14** | `src/data/` & `src/lib/` | **Arsitektur Data** | Migrasi struktur data monolitik ke arsitektur modular **1 File per Entitas (JSON)** untuk 24 member, 18 album, dan 15 sub-unit. |


