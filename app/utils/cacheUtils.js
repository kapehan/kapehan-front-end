export function getCache(key, ttlMs) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (!data || !timestamp) return null;
    if (Date.now() - timestamp > ttlMs) return null;
    return data;
  } catch {
    return null;
  }
}

export function setCache(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {}
}
