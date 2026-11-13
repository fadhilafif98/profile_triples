# tripleS Member Local Photos Directory (`public/members/`)

Folder ini disiapkan untuk menampung file foto lokal member tripleS (S01 – S24) sebagai pengganti foto Imgur saat ini.

---

## 📌 Cara Kerja Fallback (Zero Downtime)
- **Saat ini (Default)**: Jika belum ada foto lokal atau belum didaftarkan, sistem secara otomatis memakai URL Imgur yang sudah ada (`https://i.imgur.com/{id}`). Tidak ada gambar rusak.
- **Ketika Foto Baru Siap**: Letakkan file gambar di dalam folder ini (`public/members/`), lalu aktifkan dengan salah satu dari 2 cara di bawah.

---

## 🚀 Cara Memakai Foto Lokal Baru

### Cara 1: Ubah JSON Member (Direkomendasikan)
1. Taruh file gambar ke folder `public/members/`, misalnya `s01.jpg` atau `s01_seo-yeon.webp`.
2. Buka file JSON member terkait di `src/data/members/s{ID}-{slug}.json`.
3. Ubah field `"image"`:
   ```json
   "image": "/members/s01.jpg"
   ```
4. Selesai! Foto langsung terpakai di seluruh website.

### Cara 2: Daftarkan di Override Dictionary (`src/lib/members.ts`)
Tanpa mengedit file JSON member, cukup buka `src/lib/members.ts` dan tambahkan ID member ke `MEMBER_LOCAL_OVERRIDES`:
```ts
export const MEMBER_LOCAL_OVERRIDES: Record<number, string> = {
  1: "/members/s01.jpg",
  // 2: "/members/s02.jpg",
}
```

---

## 📋 Daftar Roster 24 Member & Rekomendasi Nama File

| S# | Stage Name | Legal Name | Slug | Rekomendasi Nama File |
|---|---|---|---|---|
| S01 | SeoYeon | Yoon Seo-yeon | `yoon-seo-yeon` | `s01_seo-yeon.jpg` / `s01.jpg` |
| S02 | HyeRin | Jeong Hye-rin | `jeong-hye-rin` | `s02_hye-rin.jpg` / `s02.jpg` |
| S03 | JiWoo | Lee Ji-woo | `lee-ji-woo` | `s03_ji-woo.jpg` / `s03.jpg` |
| S04 | ChaeYeon | Kim Chae-yeon | `kim-chae-yeon` | `s04_chae-yeon.jpg` / `s04.jpg` |
| S05 | YooYeon | Kim Yoo-yeon | `kim-yoo-yeon` | `s05_yoo-yeon.jpg` / `s05.jpg` |
| S06 | SooMin | Kim Soo-min | `kim-soo-min` | `s06_soo-min.jpg` / `s06.jpg` |
| S07 | NaKyoung | Kim Na-kyoung | `kim-na-kyoung` | `s07_na-kyoung.jpg` / `s07.jpg` |
| S08 | YuBin | Gong Yu-bin | `gong-yu-bin` | `s08_yu-bin.jpg` / `s08.jpg` |
| S09 | Kaede | Yamada Kaede | `kaede` | `s09_kaede.jpg` / `s09.jpg` |
| S10 | DaHyun | Seo Da-hyun | `seo-da-hyun` | `s10_da-hyun.jpg` / `s10.jpg` |
| S11 | Kotone | Kamimoto Kotone | `kotone` | `s11_kotone.jpg` / `s11.jpg` |
| S12 | YeonJi | Kwak Yeon-ji | `kwak-yeon-ji` | `s12_yeon-ji.jpg` / `s12.jpg` |
| S13 | Nien | Hsu Nien-tzu | `nien` | `s13_nien.jpg` / `s13.jpg` |
| S14 | SoHyun | Park So-hyun | `park-so-hyun` | `s14_so-hyun.jpg` / `s14.jpg` |
| S15 | Xinyu | Zhou Xin-yu | `xinyu` | `s15_xinyu.jpg` / `s15.jpg` |
| S16 | Mayu | Koma Mayu | `mayu` | `s16_mayu.jpg` / `s16.jpg` |
| S17 | Lynn | Kawakami Lynn | `lynn` | `s17_lynn.jpg` / `s17.jpg` |
| S18 | JooBin | Seo Joo-bin | `joobin` | `s18_joobin.jpg` / `s18.jpg` |
| S19 | HaYeon | Jeong Ha-yeon | `jeong-ha-yeon` | `s19_ha-yeon.jpg` / `s19.jpg` |
| S20 | ShiOn | Park Shi-on | `park-shi-on` | `s20_shi-on.jpg` / `s20.jpg` |
| S21 | ChaeWon | Kim Chae-won | `kim-chae-won` | `s21_chae-won.jpg` / `s21.jpg` |
| S22 | Sullin | Pirada Bunphisut | `sullin` | `s22_sullin.jpg` / `s22.jpg` |
| S23 | SeoAh | Jeong Hae-rin | `seoah` | `s23_seoah.jpg` / `s23.jpg` |
| S24 | JiYeon | Ji Suh-yeon | `jiyeon` | `s24_jiyeon.jpg` / `s24.jpg` |

*Format file yang direkomendasikan: `.jpg`, `.jpeg`, `.webp`, atau `.png` (orientasi potret 3:4).*
