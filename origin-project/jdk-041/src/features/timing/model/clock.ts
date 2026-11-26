export function formatTime(ms:number|null) {
 if(ms===null)return '—';
 const minutes=Math.floor(ms/60000);
 const seconds=(ms%60000/1000).toFixed(2).padStart(5,'0');
 return minutes+':'+seconds;
}
export const sampleInterval=45;
export const maxDuration=180000;
