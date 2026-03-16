import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  BarChart3,
  Package,
  FileSpreadsheet,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  ArrowRight,
  Star,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calculator,
    title: "Hitung HPP Otomatis",
    desc: "Alokasi biaya proporsional berdasarkan nilai jual setiap produk turunan.",
  },
  {
    icon: TrendingUp,
    title: "Proyeksi Laba Real-time",
    desc: "Simulasi laba 30 hari dengan 3 skenario: rame, target, dan sepi.",
  },
  {
    icon: Package,
    title: "Bundling Cerdas",
    desc: "Buat paket bundling otomatis dengan 3 tier harga optimal.",
  },
  {
    icon: BarChart3,
    title: "Grafik Interaktif",
    desc: "Visualisasi proyeksi laba dengan grafik garis yang responsif.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export Excel",
    desc: "Download seluruh data perhitungan ke file Excel (.xlsx).",
  },
  {
    icon: Shield,
    title: "Data Tersimpan Aman",
    desc: "Semua data tersimpan di perangkat Anda menggunakan IndexedDB.",
  },
];

const stats = [
  { value: "100%", label: "Akurasi Perhitungan" },
  { value: "6+", label: "Mode Bisnis" },
  { value: "∞", label: "Produk Turunan" },
  { value: "0", label: "Biaya Langganan" },
];

const highlights = [
  "Gratis selamanya, tanpa biaya tersembunyi",
  "Perhitungan akurat berbasis proporsi nilai jual",
  "Langsung di browser, tanpa install apapun",
  "Data tersimpan aman di perangkat Anda",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-foreground tracking-tight leading-tight">SemartHPP</span>
              <span className="text-[10px] text-muted-foreground leading-tight font-medium">by SANN404 FORUM</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/calculator")}
            className="btn-primary-xl h-10 px-5 text-sm gap-1.5 flex items-center rounded-xl"
          >
            Mulai Hitung
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-blue-100/30 blur-[140px] animate-pulse-slow" />
        <div className="absolute top-32 -right-40 w-[500px] h-[500px] rounded-full bg-blue-200/20 blur-[140px] animate-pulse-slow" />

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="badge-label mx-auto mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Kalkulator HPP Bisnis #1 Indonesia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.06] mb-7 text-foreground"
          >
            Hitung{" "}
            <span className="gradient-text">HPP Bisnis</span>
            <br />
            dengan Presisi Tinggi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Kalkulator Harga Pokok Produksi otomatis untuk UMKM, manufaktur, F&B, dan semua jenis bisnis.
            Gratis, akurat, dan langsung di browser Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <button
              onClick={() => navigate("/calculator")}
              className="btn-primary-xl h-14 px-10 text-base gap-2.5 flex items-center justify-center rounded-2xl"
            >
              <Zap className="h-5 w-5" />
              Mulai Hitung HPP
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="h-14 px-10 text-base font-semibold gap-2 flex items-center justify-center rounded-2xl bg-white border-2 border-border/80 hover:border-primary/30 hover:shadow-card-hover text-foreground transition-all duration-300 active:scale-[0.98]"
            >
              Lihat Fitur
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-2"
          >
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
                {h}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-extrabold gradient-text leading-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-white" />
        <div className="container max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="badge-label mx-auto mb-5">
              Fitur Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              Semua yang Anda <span className="gradient-text">Butuhkan</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base">
              Tools lengkap untuk menghitung HPP bisnis dengan akurat dan profesional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group card-premium p-6"
              >
                <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-glow"
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/8 -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 blur-2xl" />

            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                Siap Menghitung HPP<br />Bisnis Anda?
              </h2>
              <p className="text-white/75 mb-8 max-w-md mx-auto text-base leading-relaxed">
                Mulai hitung HPP sekarang. Tanpa registrasi, tanpa biaya, langsung pakai.
              </p>
              <button
                onClick={() => navigate("/calculator")}
                className="h-14 px-10 text-base font-bold gap-2.5 rounded-2xl bg-white text-primary hover:bg-blue-50 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center"
              >
                Mulai Sekarang
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight">SemartHPP</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Kalkulator HPP Bisnis</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 <span className="font-bold text-foreground">SANN404 FORUM</span> — All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
