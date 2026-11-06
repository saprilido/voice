import React, { useEffect, useState } from 'react';
import { BatteryWarning, X } from 'lucide-react';
import { QUOTA_EVENT } from '../utils/quota';

interface QuotaModalProps {
  onOpenApiKey: () => void;
}

export const QuotaModal: React.FC<QuotaModalProps> = ({ onOpenApiKey }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(QUOTA_EVENT, show);
    return () => window.removeEventListener(QUOTA_EVENT, show);
  }, []);

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
              <BatteryWarning className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">Kuota habis</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-2 text-sm text-stone-600 leading-relaxed">
          <p>
            Kuota Gemini API sudah habis, sehingga suara belum bisa dibuat saat ini.
          </p>
          <p>
            Kuota harian direset setiap tengah malam waktu Pasifik (sore hari WIB). Coba lagi nanti, atau pakai
            Gemini API Key milikmu sendiri.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 pb-5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Mengerti
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenApiKey();
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Pakai API Key sendiri
          </button>
        </div>
      </div>
    </div>
  );
};
