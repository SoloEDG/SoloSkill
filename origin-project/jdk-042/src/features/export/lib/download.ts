export function download(blob: Blob, suffix: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'prism-desk.' + suffix;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function toPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve,reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(Error('无法生成图像')), 'image/png');
  });
}
