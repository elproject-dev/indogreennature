"use client";

import { useState } from "react";
import { checkMemberPoints } from "@/app/actions/pos";
import { Button } from "@/components/ui/button"; // Asumsi ada UI komponen ini
import { Input } from "@/components/ui/input"; // Asumsi ada UI komponen ini

export function CheckPointsForm() {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    name?: string;
    points?: number;
    message?: string;
    isMock?: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;

    setLoading(true);
    setResult(null);

    try {
      // Memanggil Server Action
      const data = await checkMemberPoints(memberId);
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-bold mb-2">Cek Poin CV. Indo Green Nature</h3>
      <p className="text-sm text-zinc-500 mb-6">
        Masukkan Nomor HP atau ID Member Anda untuk melihat sisa poin dari transaksi kasir.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Contoh: 08123456789 atau MEMBER-001"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-destructive text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Mengecek..." : "Cek Poin"}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-xl border ${result.success ? 'bg-green-50 border-green-200 dark:bg-green-950/30' : 'bg-red-50 border-red-200 dark:bg-red-950/30'}`}>
          {result.success ? (
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Halo, {result.name}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500 my-1">
                {result.points?.toLocaleString('id-ID')} Poin
              </p>
              {result.isMock && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-full mt-2 inline-block">
                  Menampilkan Data Sample
                </span>
              )}
            </div>
          ) : (
            <div className="text-center text-red-600 text-sm">
              <p>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
