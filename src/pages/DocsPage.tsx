import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  Target,
  BookOpen,
  Users,
  ShoppingBag,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const DocsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen noise-bg">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-strong"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-9 w-9 rounded-xl hover:bg-primary/5"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
            <img src="/logo.png" alt="SmartHPP" className="h-14 w-auto" />
          </div>
          <Button
            onClick={() => navigate("/calculator")}
            className="btn-primary-xl h-10 px-5 text-sm"
          >
            Mulai Hitung
          </Button>
        </div>
      </motion.header>

      <main className="container py-8 pb-24 max-w-2xl">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
          {/* Hero */}
          <motion.div variants={fadeUp}>
            <div className="badge-label mb-4">
              <BookOpen className="h-3 w-3" />
              Dokumentasi
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Panduan Lengkap<br />
              <span className="gradient-text">SmartHPP</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
              Pelajari cara menggunakan SmartHPP untuk menghitung HPP bisnis Anda secara akurat dan profesional.
            </p>
          </motion.div>

          {/* Apa itu SmartHPP */}
          <motion.div variants={fadeUp} className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Apa itu SmartHPP?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SmartHPP adalah kalkulator Harga Pokok Produksi (HPP) berbasis web yang dirancang khusus untuk pelaku UMKM, reseller, dan pebisnis pemula. Dengan SmartHPP, Anda bisa menghitung biaya produksi, menentukan harga jual yang tepat, dan memproyeksikan keuntungan bisnis Anda secara otomatis.
            </p>
          </motion.div>

          {/* Fungsi Utama */}
          <motion.div variants={fadeUp} className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
                <Calculator className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Fungsi Utama</h2>
            </div>
            <div className="space-y-3">
              {[
                { icon: Calculator, title: "Hitung HPP Otomatis", desc: "Menghitung Harga Pokok Produksi berdasarkan bahan baku, biaya pengolahan, dan alokasi proporsional ke setiap produk turunan." },
                { icon: TrendingUp, title: "Rekomendasi Harga Jual", desc: "Memberikan rekomendasi harga jual dengan berbagai tingkat margin (30%, 50%, 100%) agar bisnis tetap untung." },
                { icon: Target, title: "Target Penjualan", desc: "Menghitung berapa unit yang harus dijual per hari/bulan untuk mencapai target laba bersih yang diinginkan." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30">
                  <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cara Penggunaan */}
          <motion.div variants={fadeUp} className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Cara Penggunaan</h2>
            </div>
            <div className="space-y-3">
              {[
                { step: "1", title: "Pilih Mode Bisnis", desc: "Pilih jenis bisnis Anda: Manufaktur, F&B, Reseller, atau Jasa." },
                { step: "2", title: "Masukkan Data Produksi", desc: "Isi nama bisnis dan jumlah batch produksi per bulan." },
                { step: "3", title: "Input Bahan Baku", desc: "Tambahkan semua bahan baku beserta jumlah, satuan, dan harga per satuan." },
                { step: "4", title: "Input Biaya Pengolahan", desc: "Masukkan biaya-biaya lain seperti tenaga kerja, packaging, listrik, dll." },
                { step: "5", title: "Input Produk Turunan", desc: "Tambahkan produk yang dihasilkan beserta jumlah unit dan harga jual per unit." },
                { step: "6", title: "Hitung HPP", desc: "Klik tombol 'Hitung HPP Sekarang' untuk mendapatkan hasil perhitungan lengkap." },
                { step: "7", title: "Analisis Hasil", desc: "Lihat HPP per produk, rekomendasi harga, proyeksi laba, dan target penjualan." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Istilah Penting */}
          <motion.div variants={fadeUp} className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Penjelasan Istilah</h2>
            </div>
            <div className="space-y-3">
              {[
                { term: "HPP (Harga Pokok Produksi)", desc: "Total biaya yang dikeluarkan untuk menghasilkan satu unit produk, termasuk bahan baku dan biaya pengolahan." },
                { term: "Margin", desc: "Selisih antara harga jual dan HPP, biasanya dinyatakan dalam persentase. Semakin besar margin, semakin besar keuntungan per unit." },
                { term: "Profit", desc: "Keuntungan bersih yang diperoleh setelah dikurangi semua biaya produksi. Profit = Harga Jual - HPP." },
                { term: "Break-Even Point (BEP)", desc: "Titik di mana total pendapatan sama dengan total biaya, sehingga tidak ada untung maupun rugi." },
                { term: "Batch Produksi", desc: "Jumlah siklus produksi dalam satu bulan. Misalnya 30 batch berarti produksi dilakukan setiap hari." },
              ].map((item) => (
                <div key={item.term} className="p-3 rounded-2xl bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground">{item.term}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Siapa yang cocok */}
          <motion.div variants={fadeUp} className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">Siapa yang Cocok Menggunakan?</h2>
            </div>
            <div className="space-y-3">
              {[
                { icon: ShoppingBag, title: "UMKM", desc: "Pelaku usaha mikro, kecil, dan menengah yang ingin menghitung biaya produksi secara akurat." },
                { icon: TrendingUp, title: "Reseller", desc: "Reseller yang perlu menentukan harga jual optimal dengan mempertimbangkan semua biaya operasional." },
                { icon: Users, title: "Pebisnis Pemula", desc: "Siapa saja yang baru memulai bisnis dan ingin memahami struktur biaya produksi mereka." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30">
                  <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <button
              onClick={() => navigate("/calculator")}
              className="btn-primary-xl h-14 px-8 text-base gap-2.5 inline-flex items-center justify-center"
            >
              <Calculator className="h-5 w-5" />
              Mulai Hitung HPP
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Footer */}
          <div className="text-center pt-10 pb-4">
            <img src="/logo.png" alt="SmartHPP" className="h-10 w-auto mx-auto" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DocsPage;
