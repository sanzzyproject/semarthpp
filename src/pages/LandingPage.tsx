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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background noise-bg overflow-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground tracking-tight">SemartHPP</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2">by SANN404 FORUM</span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/calculator")}
            className="gradient-primary text-white border-0 shadow-glow hover:opacity-90 transition-opacity gap-1.5"
            size="sm"
          >
            Mulai Hitung
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute top-40 -right-32 w-80 h-80 rounded-full bg-accent/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-primary/5 blur-[80px]" />

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Kalkulator HPP Bisnis Terlengkap
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5"
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
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Kalkulator Harga Pokok Produksi otomatis untuk UMKM, manufaktur, F&B, dan semua jenis bisnis.
            Gratis, akurat, dan langsung di browser Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={() => navigate("/calculator")}
              size="lg"
              className="gradient-primary text-white border-0 shadow-glow hover:opacity-90 transition-all h-12 px-8 text-base font-semibold gap-2"
            >
              <Zap className="h-5 w-5" />
              Mulai Hitung HPP
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="glass h-12 px-8 text-base font-semibold gap-2"
            >
              Lihat Fitur
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
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
                <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Fitur <span className="gradient-text">Lengkap</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Semua yang Anda butuhkan untuk menghitung HPP bisnis dengan akurat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group glass rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative z-10">
              <Star className="h-10 w-10 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Siap Menghitung HPP Bisnis Anda?
              </h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Mulai hitung HPP sekarang. Tanpa registrasi, tanpa biaya, langsung pakai.
              </p>
              <Button
                onClick={() => navigate("/calculator")}
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 h-12 px-8 text-base font-bold gap-2 shadow-lg"
              >
                Mulai Sekarang
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">SemartHPP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 <span className="font-semibold text-foreground">SANN404 FORUM</span> — All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
