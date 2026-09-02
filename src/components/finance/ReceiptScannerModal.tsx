import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { parseReceiptWithAI } from '../../utils/aiAnalystEngine';
import { formatIDR } from '../../utils/formatters';
import { Camera, Upload, Sparkles, Check, X, Loader2, AlertCircle, FileText, ShoppingBag, ArrowRight } from 'lucide-react';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, accounts, aiSettings } = useData();
  const { showToast } = useNotification();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    merchant: string;
    amount: number;
    date: string;
    category: string;
    description: string;
    sourceAccountId: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImageSrc(base64);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string) => {
    setIsProcessing(true);
    try {
      const defaultAccId = accounts[0]?.id || 'acc-1';
      const parsed = await parseReceiptWithAI(aiSettings?.geminiApiKey || '', base64);
      setExtractedData({
        ...parsed,
        sourceAccountId: defaultAccId,
      });
      showToast('✨ Struk berhasil dianalisis oleh AI OCR!', 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Gagal memproses struk: ' + (e.message || 'Format tidak dikenali'), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveTransaction = () => {
    if (!extractedData || extractedData.amount <= 0) {
      showToast('Mohon isi data nominal transaksi struk.', 'error');
      return;
    }

    addTransaction({
      type: 'expense',
      amount: extractedData.amount,
      category: extractedData.category,
      description: `${extractedData.merchant} - ${extractedData.description}`,
      sourceAccountId: extractedData.sourceAccountId,
      date: extractedData.date,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      tags: ['#ocr_receipt', '#struk_ai'],
    });

    showToast(`✅ Pengeluaran ${formatIDR(extractedData.amount)} dari ${extractedData.merchant} berhasil dicatat!`, 'success');
    onClose();
    // Reset state
    setImageSrc(null);
    setExtractedData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg flex items-center gap-2">
                <span>Smart Receipt OCR Scanner</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  AI VISION
                </span>
              </h3>
              <p className="text-xs text-slate-400">Scan nota, invoice, atau struk kasir otomatis.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Upload Dropzone */}
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/50 hover:bg-indigo-950/20 transition-all flex flex-col items-center justify-center space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-200 group-hover:text-white">
                  Ambil Foto Kamera atau Upload Gambar Struk
                </p>
                <p className="text-xs text-slate-500 mt-1">Mendukung file JPG, PNG, WEBP (maks. 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview & Processing state */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-56 flex items-center justify-center">
                <img src={imageSrc} alt="Preview Struk" className="max-h-56 w-auto object-contain" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="text-xs font-bold text-slate-200 animate-pulse">
                      AI sedang mengekstrak teks nominal & toko...
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImageSrc(null);
                    setExtractedData(null);
                  }}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700"
                >
                  Ganti Foto
                </button>
              </div>

              {/* Extracted Form Fields */}
              {extractedData && (
                <div className="bg-slate-950/70 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Hasil Ekstraksi OCR (Bisa Anda Edit)</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">Terkonfirmasi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nama Toko / Merchant</label>
                      <input
                        type="text"
                        value={extractedData.merchant}
                        onChange={(e) => setExtractedData({ ...extractedData, merchant: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Total Nominal (Rp)</label>
                      <input
                        type="number"
                        value={extractedData.amount}
                        onChange={(e) => setExtractedData({ ...extractedData, amount: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Kategori Pengeluaran</label>
                      <select
                        value={extractedData.category}
                        onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      >
                        <option value="Makanan & Minuman">Makanan & Minuman</option>
                        <option value="Belanja Harian">Belanja Harian</option>
                        <option value="Transportasi">Transportasi</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                        <option value="Hiburan">Hiburan</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Sumber Akun / Dompet</label>
                      <select
                        value={extractedData.sourceAccountId}
                        onChange={(e) => setExtractedData({ ...extractedData, sourceAccountId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      >
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.name} ({formatIDR(acc.balance)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Catatan / Detail Barang</label>
                    <input
                      type="text"
                      value={extractedData.description}
                      onChange={(e) => setExtractedData({ ...extractedData, description: e.target.value })}
                      placeholder="Contoh: Belanja mingguan sayur, susu, roti"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 sm:p-6 border-t border-slate-800 bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Batal
          </button>
          {extractedData && (
            <button
              type="button"
              onClick={handleSaveTransaction}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan ke Catatan Keuangan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
