"use client";
import { useCallback, useState } from "react";
import { useCamera } from "@/hooks/useCamera";

export default function ReceiptScanner() {
  const { videoRef, canvasRef, isActive, error, start, stop, capture } = useCamera({ facingMode: "environment" });
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const snap = useCallback(async () => {
    const blob = capture();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setPreview(url);

    setUploading(true);
    const fd = new FormData();
    fd.append("file", blob, "receipt.jpg");
    await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
  }, [capture]);

  return (
    <div className="max-w-sm mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Receipt Scanner</h1>
      <div className="relative rounded-xl overflow-hidden bg-black">
        <video ref={videoRef} className="w-full" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">Camera off</div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button onClick={() => start()} disabled={isActive} className="flex-1 bg-indigo-600 text-white py-2 rounded disabled:opacity-50">Start</button>
        <button onClick={stop} disabled={!isActive} className="flex-1 bg-gray-200 py-2 rounded disabled:opacity-50">Stop</button>
        <button onClick={snap} disabled={!isActive || uploading} className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50">
          {uploading ? "Uploading…" : "Snap"}
        </button>
      </div>
      {preview && <img src={preview} alt="Preview" className="rounded-lg border" />}
    </div>
  );
}
