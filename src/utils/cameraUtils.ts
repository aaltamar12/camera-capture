export async function listCameras(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === "videoinput");
}

export async function switchFacingMode(
  currentStream: MediaStream,
  currentFacing: "user" | "environment"
): Promise<{ stream: MediaStream; facing: "user" | "environment" }> {
  currentStream.getTracks().forEach((t) => t.stop());
  const facing = currentFacing === "user" ? "environment" : "user";
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: facing } },
    audio: false,
  });
  return { stream, facing };
}

export function captureFrame(video: HTMLVideoElement): Blob {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")!.drawImage(video, 0, 0);
  return canvas as unknown as Blob;
}
