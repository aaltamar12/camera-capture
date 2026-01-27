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


/**
 * iOS Safari camera orientation fix:
 * The front camera returns a horizontally mirrored, rotated frame based on
 * device orientation but does NOT set EXIF orientation in canvas captures.
 * Apply a CSS transform to the video element to compensate.
 *
 * Also: enumerateDevices() returns empty labels until getUserMedia() has been
 * called at least once on iOS 16 and earlier.
 */
export function getIosOrientationTransform(angle: number, facingUser: boolean): string {
  const mirror = facingUser ? "scaleX(-1)" : "";
  if (angle === 0) return mirror;
  if (angle === 90) return `${mirror} rotate(-90deg)`;
  if (angle === 180) return `${mirror} rotate(180deg)`;
  if (angle === 270) return `${mirror} rotate(90deg)`;
  return mirror;
}
