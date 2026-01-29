export interface MediaCapabilities {
  getUserMediaSupported: boolean;
  enumerateDevicesSupported: boolean;
  imageCaptureSupported: boolean;
  offscreenCanvasSupported: boolean;
  multipleCameras: boolean;
}

export async function detectMediaCapabilities(): Promise<MediaCapabilities> {
  if (typeof navigator === "undefined" || !("mediaDevices" in navigator)) {
    return {
      getUserMediaSupported: false,
      enumerateDevicesSupported: false,
      imageCaptureSupported: false,
      offscreenCanvasSupported: false,
      multipleCameras: false,
    };
  }

  let multipleCameras = false;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    multipleCameras = devices.filter((d) => d.kind === "videoinput").length > 1;
  } catch {
    // Permission not yet granted
  }

  return {
    getUserMediaSupported: typeof navigator.mediaDevices.getUserMedia === "function",
    enumerateDevicesSupported: typeof navigator.mediaDevices.enumerateDevices === "function",
    imageCaptureSupported: typeof window !== "undefined" && "ImageCapture" in window,
    offscreenCanvasSupported: typeof OffscreenCanvas !== "undefined",
    multipleCameras,
  };
}
