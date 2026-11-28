export function downloadBlob(blob:Blob,name:string) {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href=url; link.download=name; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
}
export function safeName(title:string):string {
  return title.replace(/[\/:*?"<>|]/g,'_').slice(0,60)||'翻点演出';
}
