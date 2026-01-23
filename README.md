# camera-capture

Demonstrates the MediaDevices API — live camera preview, multi-device switching, canvas frame capture, client-side image resize, and upload to a Next.js API route.

## Web APIs Used

| API | Chrome | Firefox | Safari | Edge |
|-----|--------|---------|--------|------|
| MediaDevices.getUserMedia | 53+ | 36+ | 11+ | 12+ |
| MediaDevices.enumerateDevices | 45+ | 39+ | 11+ | 12+ |
| ImageCapture API | 59+ | ❌ | ❌ | 79+ |
| OffscreenCanvas | 69+ | 105+ | 16.4+ | 79+ |
| Canvas.toBlob | 50+ | 19+ | 11+ | 79+ |

## How to Run

```bash
npm install
npm run dev   # http://localhost:3000
```

Grant camera permission. Switch between front/rear cameras. Capture, preview, upload.
