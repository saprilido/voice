import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X, ShieldCheck, AlertCircle, Loader2, ExternalLink, RefreshCw } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey,
  onClearApiKey,
}) => {
  const [keyValue, setKeyValue] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setKeyValue(currentApiKey);
    setTestResult(null);
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = keyValue.trim();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Silakan masukkan API Key terlebih dahulu sebelum melakukan tes.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': keyToTest,
        },
        body: JSON.stringify({ apiKey: keyToTest }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setTestResult({
          success: true,
          message: data.message || 'API Key valid dan siap digunakan!',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'API Key tidak valid atau kuota tidak mencukupi.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Gagal memvalidasi: ${err?.message || 'Koneksi bermasalah'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(keyValue.trim());
    onClose();
  };

  const handleResetToDefault = () => {
    setKeyValue('');
    onClearApiKey();
    setTestResult(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                Pengaturan Gemini API Key
              </h2>
              <p className="text-[11px] text-stone-500">
                Gunakan API Key sendiri atau tetap gunakan key server
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4.5">
          {/* Current Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-stone-50 border-stone-200/90 text-xs">
            <span className="text-stone-600 font-medium">Status saat ini:</span>
            {currentApiKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                API Key Pribadi Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Menggunakan Key Server (Default)
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-stone-600 leading-relaxed">
            Secara default, aplikasi berjalan menggunakan API Key bawaan dari server. Jika Anda ingin menggunakan kuota atau proyek Google Gemini Anda sendiri, masukkan API Key di bawah ini:
          </p>

          {/* Input field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="Contoh: AIzaSyD..."
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all bg-white"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? 'Sembunyikan' : 'Tampilkan'}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-2 text-[11px] text-stone-500 leading-normal">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>
              API Key Anda disimpan secara aman hanya di browser lokal Anda (<code className="font-mono text-stone-600">localStorage</code>) dan tidak disimpan di database manapun.
            </span>
          </div>

          {/* Link to get key */}
          <div className="pt-1">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 hover:underline font-medium"
            >
              <span>Belum punya key? Dapatkan gratis di Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-6 py-4 border-t border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={testing || !keyValue.trim()}
              onClick={handleTestKey}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Menguji...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Key</span>
                </>
              )}
            </button>

            {currentApiKey && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset ke Default
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
