export const removeAccents = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u02B0-\u02FF]/g, "")
    .replace(/[\u1AB0-\u1AFF]/g, "")
    .replace(/[\u1DC0-\u1DFF]/g, "")
    .replace(/[\u20D0-\u20FF]/g, "")
    .replace(/[\uFE20-\uFE2F]/g, "");

export const createSlug = (name = "") =>
  removeAccents(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const toTitleCase = (s = "") =>
  s
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
