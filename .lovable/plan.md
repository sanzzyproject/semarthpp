
# Kalkulator HPP Bisnis — Full Feature Plan

## Overview
Aplikasi web kalkulator HPP (Harga Pokok Produksi) bisnis yang mobile-first, menggunakan IndexedDB untuk penyimpanan data, dengan fitur perhitungan otomatis, proyeksi laba, bundling cerdas, grafik, dan export Excel.

## Design System
- **Font**: Inter (Google Font)
- **Primary**: #2563EB (blue), **Success**: #10B981 (green), **Danger**: #EF4444 (red)
- **Background**: #F9FAFB, **Cards**: white with subtle border & shadow
- **Accent**: #6366F1 (indigo) untuk interactive elements
- **Mobile-first** vertical stack layout

## Pages & Components

### 1. Halaman Utama (Single Page App)
Semua fitur dalam satu halaman scrollable dengan sections:

#### A. Business Mode Selector (Grid 2x3)
- 6 mode: Iklan & COD, Marketplace, Bisnis Ritel/F&B, Manufaktur/Pabrik, Produksi Turunan, Produk Jasa
- Masing-masing dengan Lucide icon, highlight indigo border saat dipilih

#### B. Form Input Data
- **Nama Bisnis / Produk Utama** — text input
- **Jumlah Batch Produksi per Bulan** — number input

#### C. Bahan Baku Utama
- Dynamic list: Nama, Harga Total, Jumlah, Satuan
- Tombol "Tambah Bahan" dan hapus per item

#### D. Biaya Pengolahan
- Dynamic list: Nama Biaya, Harga, Periode (Per Batch / Per Bulan dropdown)
- Tombol "Tambah Biaya" dan hapus per item

#### E. Produk Turunan
- Dynamic list: Nama Produk, Qty, Satuan, Harga Jual per Satuan
- Tombol "Tambah Produk" dan hapus per item

#### F. Tombol "Hitung HPP" (full-width, blue primary)

### 2. Hasil Perhitungan (muncul setelah hitung)

#### A. Ringkasan Card
- Total Biaya Produksi
- Total Potensi Penjualan
- Proyeksi Laba / (Rugi) — green jika profit, red jika rugi

#### B. Detail Rincian Biaya per Batch (collapsible)
- Breakdown bahan baku dan biaya pengolahan

#### C. Detail HPP per Produk Turunan (collapsible table)
- Nama Produk, Qty, Alokasi Biaya (%), HPP per Satuan

#### D. Target & Proyeksi Penjualan
- Input: Target Laba Bersih/Bulan, Harga Jual Pilihan
- Card proyeksi: Omzet/Bulan, Total Biaya/Bulan, Laba Bersih/Bulan

#### E. Grafik Proyeksi Laba 30 Hari (Recharts)
- Line chart dengan 3 garis: Kondisi Rame, Target, Kondisi Sepi
- Titik data: Hari 1, 15, 30

### 3. Bundling Cerdas (Dialog/Modal)
- Pilih produk dari daftar produk turunan
- Tampilkan: Total HPP Gabungan, Harga Normal
- 3 opsi harga otomatis: Paket Hemat, Paling Seimbang, Profit Maksimal
- Masing-masing menampilkan: Diskon, Profit, Margin

### 4. Simpan & Riwayat
- Tombol "Simpan Perhitungan" — simpan ke IndexedDB
- Panel "Riwayat" — list semua perhitungan tersimpan, bisa buka kembali

### 5. Export Excel
- Tombol export menggunakan library `xlsx`
- File berisi semua input dan hasil perhitungan

## Data & Storage
- **IndexedDB** database `hpp_calculator_db` dengan object store `calculations`
- Library `idb` untuk akses IndexedDB
- Schema sesuai spesifikasi user

## Rumus Perhitungan
- Total Biaya Produksi = Σ Bahan Baku + Σ Biaya Pengolahan (biaya per bulan ÷ batch)
- Proporsi produk = (Qty × Harga Jual) ÷ Total Nilai Jual
- Alokasi biaya = Proporsi × Total Biaya Produksi
- HPP per unit = Alokasi biaya ÷ Qty
- Bundling: Hemat (80%), Seimbang (87%), Maksimal (93.5%) dari harga normal

## Libraries to Install
- `idb` — IndexedDB wrapper
- `xlsx` — Export Excel

## File Structure
```
src/
  components/
    BusinessModeSelector.tsx
    InputBahanBaku.tsx
    InputBiaya.tsx
    InputProduk.tsx
    HPPResult.tsx
    BundlingCalculator.tsx
    ProfitProjection.tsx
    ChartProfit.tsx
    HistoryPanel.tsx
  lib/
    db.ts (IndexedDB setup)
    calculations.ts (rumus HPP)
    export.ts (Excel export)
  types/
    index.ts
  hooks/
    useCalculations.ts
  pages/
    Index.tsx (main page)
```
