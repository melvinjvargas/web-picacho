const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function sanitizeFilename(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex >= 0 ? name.slice(dotIndex) : "";
  const base = dotIndex >= 0 ? name.slice(0, dotIndex) : name;
  const clean = base
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
    .slice(0, 100);
  return `${clean}${ext.toLowerCase()}`;
}

export function isValidImageFile(file: File): boolean {
  if (!file.type.startsWith("image/")) return false;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  if (!ext || !validExtensions.includes(ext)) return false;
  return true;
}

export { MAX_FILE_SIZE };
