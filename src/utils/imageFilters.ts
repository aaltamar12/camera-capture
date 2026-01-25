export type FilterName = "none" | "grayscale" | "sharpen" | "enhance";

export function applyFilter(imageData: ImageData, filter: FilterName): ImageData {
  if (filter === "none") return imageData;
  if (filter === "grayscale") return applyGrayscale(imageData);
  if (filter === "sharpen") return applySharpen(imageData);
  if (filter === "enhance") return applyAutoEnhance(imageData);
  return imageData;
}

function applyGrayscale(imageData: ImageData): ImageData {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = gray;
  }
  return imageData;
}

function applyAutoEnhance(imageData: ImageData): ImageData {
  const d = imageData.data;
  const ch = [
    { min: 255, max: 0 },
    { min: 255, max: 0 },
    { min: 255, max: 0 },
  ];
  for (let i = 0; i < d.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      if (d[i + c] < ch[c].min) ch[c].min = d[i + c];
      if (d[i + c] > ch[c].max) ch[c].max = d[i + c];
    }
  }
  for (let i = 0; i < d.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const range = ch[c].max - ch[c].min;
      d[i + c] = range === 0 ? d[i + c] : Math.round(((d[i + c] - ch[c].min) / range) * 255);
    }
  }
  return imageData;
}

function applySharpen(imageData: ImageData): ImageData {
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            val += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        output[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, val));
      }
    }
  }
  return new ImageData(output, width, height);
}
