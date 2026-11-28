import { useEffect, useState } from "react";
export function useTimer(active: boolean, limit: number) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!active) {
      setNow(0);
      return;
    }
    const start = Date.now() - now * 1000,
      id = window.setInterval(() => setNow((Date.now() - start) / 1000), 200);
    return () => clearInterval(id);
  }, [active, limit]);
  return Math.min(now, limit);
}
