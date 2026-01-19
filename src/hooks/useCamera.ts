"use client";
import { useRef, useState, useCallback, useEffect } from "react";

interface CameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

export function useCamera(opts: CameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((all) => setDevices(all.filter((d) => d.kind === "videoinput")))
      .catch(() => {});
  }, []);

  const start = useCallback(async (deviceId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: opts.facingMode ?? "environment", width: opts.width ?? 1280, height: opts.height ?? 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setIsActive(true);
      setError(null);
    } catch (err) { setError((err as Error).message); }
  }, [opts.facingMode, opts.width, opts.height]);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) { videoRef.current.srcObject = null; }
    setIsActive(false);
  }, []);

  const capture = useCallback((): Blob | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const { videoWidth, videoHeight } = videoRef.current;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    canvasRef.current.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    let result: Blob | null = null;
    canvasRef.current.toBlob((b) => { result = b; }, "image/jpeg", 0.92);
    return result;
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { videoRef, canvasRef, isActive, error, devices, start, stop, capture };
}
