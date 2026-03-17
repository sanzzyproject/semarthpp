import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Download, MessageCircle, X, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const POPUP_KEY = "smarthpp_welcome_seen";

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);
  const { install } = usePWAInstall();

  useEffect(() => {
    const seen = localStorage.getItem(POPUP_KEY);
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(POPUP_KEY, "true");
  };

  const handleInstall = () => {
    install();
    handleClose();
  };

  const handleChannel = () => {
    window.open("https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L", "_blank");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/40 shadow-2xl p-0 overflow-hidden gap-0">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-blue-700 p-6 pb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <DialogHeader className="space-y-0 text-left">
                  <DialogTitle className="text-lg font-bold text-white">
                    SmartHPP Update
                  </DialogTitle>
                </DialogHeader>
              </div>
            </div>
            <DialogDescription className="text-white/90 text-sm leading-relaxed mt-2">
              Sekarang SmartHPP sudah mendukung instalasi sebagai aplikasi (PWA) dan akan terus dikembangkan dengan fitur-fitur baru.
            </DialogDescription>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* PWA education */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
            <Smartphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Web ini sudah support PWA, kamu bisa install seperti aplikasi agar lebih cepat dan nyaman digunakan.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleInstall}
              className="btn-primary-xl h-12 text-sm gap-2.5 flex items-center justify-center"
            >
              <Download className="h-4 w-4" />
              Install App
            </button>
            <button
              onClick={handleChannel}
              className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Join Channel Developer
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
          >
            Nanti saja
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
